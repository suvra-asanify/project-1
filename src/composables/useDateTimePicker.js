import { computed, ref } from 'vue';
import { normalizeText } from '../shared/sharedHelpers';
import { toIconConfig } from '../shared/iconHelpers';

export const DATE_TIME_PICKER_VARIANTS = Object.freeze(['default', 'underlined']);
export const DATE_TIME_PICKER_TYPES = Object.freeze(['date', 'month', 'date-range', 'time', 'date-time']);
// Kept for external consumers; no longer used internally.
export const DATE_TIME_PICKER_STATES = Object.freeze(['default', 'hover', 'pressed']);

const DEFAULT_PLACEHOLDERS = Object.freeze({
  date: 'Select Date',
  month: 'Select Month',
  'date-range': 'Select Date Range',
  time: 'Select Time',
  'date-time': 'Select Date and Time',
});

const TRAILING_ICONS = Object.freeze({
  date: 'mdi-calendar',
  month: 'mdi-calendar-month',
  'date-range': 'mdi-calendar-range',
  time: 'mdi-clock-time-two-outline',
  'date-time': 'mdi-calendar-clock',
});

const MONTH_LABELS = Object.freeze([
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]);

function normalizePickerType(value) {
  const normalized = normalizeText(value, 'date').trim();
  if (DATE_TIME_PICKER_TYPES.includes(normalized)) return normalized;
  return 'date';
}

function normalizeVariant(value) {
  const normalized = normalizeText(value, 'default').trim();
  if (DATE_TIME_PICKER_VARIANTS.includes(normalized)) return normalized;
  return 'default';
}

function ensureDate(value) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) return value;
  if (typeof value !== 'string') return null;
  const safeValue = value.includes('T') ? value : `${value}T00:00:00`;
  const date = new Date(safeValue);
  if (Number.isNaN(date.valueOf())) return null;
  return date;
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function toDateValue(date) {
  if (!(date instanceof Date) || Number.isNaN(date.valueOf())) return '';
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function toMonthValue(date) {
  if (!(date instanceof Date) || Number.isNaN(date.valueOf())) return '';
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
}

function formatDateLabel(value) {
  const date = ensureDate(value);
  if (!date) return '';
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatMonthLabel(value) {
  const date = ensureDate(value);
  if (!date) return '';
  return date.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
}

function normalizeRangeValue(value) {
  if (!Array.isArray(value)) return [];
  return value.filter((token) => typeof token === 'string' && token.trim().length > 0).slice(0, 2);
}

function parseDateTimeValue(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return {
      date: normalizeText(value.date, ''),
      time: normalizeText(value.time, ''),
    };
  }
  if (typeof value === 'string' && value.includes('T')) {
    const [datePart, timePart = ''] = value.split('T');
    return { date: datePart, time: timePart.slice(0, 5) };
  }
  return { date: '', time: '' };
}

// Generates calendar cells for a given year/month (0-based month), Monday-first grid.
function generateCalendarCells(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDate = new Date(year, month + 1, 0).getDate();

  // Convert JS Sunday=0 to Monday=0 grid
  let startDow = firstDay.getDay();
  startDow = startDow === 0 ? 6 : startDow - 1;

  const cells = [];

  // Trailing days from previous month
  const prevMonthLastDate = new Date(year, month, 0).getDate();
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  for (let i = startDow - 1; i >= 0; i--) {
    const day = prevMonthLastDate - i;
    cells.push({
      label: String(day),
      iso: `${prevYear}-${pad2(prevMonth + 1)}-${pad2(day)}`,
      muted: true,
      hasDot: false,
    });
  }

  // Current month days
  for (let day = 1; day <= lastDate; day++) {
    cells.push({
      label: String(day),
      iso: `${year}-${pad2(month + 1)}-${pad2(day)}`,
      muted: false,
      hasDot: false,
    });
  }

  // Leading days from next month to complete the last row
  const remaining = cells.length % 7;
  if (remaining > 0) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const fill = 7 - remaining;
    for (let day = 1; day <= fill; day++) {
      cells.push({
        label: String(day),
        iso: `${nextYear}-${pad2(nextMonth + 1)}-${pad2(day)}`,
        muted: true,
        hasDot: false,
      });
    }
  }

  return Object.freeze(cells);
}

function getInitialCalendarDate(props) {
  const today = new Date();
  const type = normalizePickerType(props.type);
  let dateStr = '';

  if (type === 'date') {
    dateStr = typeof props.value === 'string' ? props.value : '';
  } else if (type === 'date-time') {
    dateStr = parseDateTimeValue(props.value).date;
  } else if (type === 'date-range') {
    const range = normalizeRangeValue(props.value);
    dateStr = range[0] || '';
  } else if (type === 'month') {
    dateStr = typeof props.value === 'string' ? props.value : '';
  }

  return ensureDate(dateStr) || today;
}

export function useDateTimePicker(props, emit) {
  const initialDate = getInitialCalendarDate(props);
  const calendarDate = ref({ year: initialDate.getFullYear(), month: initialDate.getMonth() });
  const pickerYear = ref(initialDate.getFullYear());
  const internalMenuValue = ref(false);
  const dateTimeDraft = ref(parseDateTimeValue(props.value));

  const normalizedType = computed(() => normalizePickerType(props.type));
  const normalizedVariant = computed(() => normalizeVariant(props.variant));
  const normalizedHint = computed(() => normalizeText(props.hint, '').trim());

  const resolvedPlaceholder = computed(() => {
    const rawPlaceholder = normalizeText(props.placeholder, '').trim();
    return rawPlaceholder.length > 0 ? rawPlaceholder : DEFAULT_PLACEHOLDERS[normalizedType.value];
  });

  const leadingIconConfig = computed(() =>
    toIconConfig(normalizeText(props.icon, 'mdi-plus').trim() || 'mdi-plus')
  );
  const trailingIconConfig = computed(() => toIconConfig(TRAILING_ICONS[normalizedType.value]));

  const showLeadingIcon = computed(() => props.hasIcon === true && leadingIconConfig.value.type !== 'none');
  // Derived from hint content only — no boolean gate required
  const showHint = computed(() => normalizedHint.value.length > 0);

  const menuValue = computed({
    get() {
      return internalMenuValue.value;
    },
    set(nextValue) {
      internalMenuValue.value = nextValue === true;
      emit('update:menu', internalMenuValue.value);
    },
  });

  const dateValue = computed({
    get() {
      return normalizeText(props.value, '');
    },
    set(nextValue) {
      emit('update:value', normalizeText(nextValue, '').trim());
    },
  });

  const rangeValue = computed({
    get() {
      return normalizeRangeValue(props.value);
    },
    set(nextValue) {
      emit('update:value', normalizeRangeValue(nextValue));
    },
  });

  const timeValue = computed({
    get() {
      return normalizeText(props.value, '');
    },
    set(nextValue) {
      emit('update:value', normalizeText(nextValue, '').trim());
    },
  });

  const dateTimeValue = computed({
    get() {
      const parsed = parseDateTimeValue(props.value);
      dateTimeDraft.value = parsed;
      return parsed;
    },
    set(nextValue) {
      const nextDraft = parseDateTimeValue(nextValue);
      dateTimeDraft.value = nextDraft;
      emit('update:value', { date: nextDraft.date, time: nextDraft.time });
    },
  });

  const monthPickerValue = computed({
    get() {
      const source = normalizeText(props.value, '');
      return source.length === 7 ? `${source}-01` : source;
    },
    set(nextValue) {
      const date = ensureDate(normalizeText(nextValue, ''));
      emit('update:value', toMonthValue(date));
    },
  });

  // --- Dynamic calendar cells ---

  const calendarCells = computed(() =>
    generateCalendarCells(calendarDate.value.year, calendarDate.value.month)
  );

  const leftRangeCalendarCells = computed(() => calendarCells.value);

  const rightRangeCalendarCells = computed(() => {
    let { year, month } = calendarDate.value;
    month += 1;
    if (month > 11) { month = 0; year += 1; }
    return generateCalendarCells(year, month);
  });

  // --- Calendar header labels ---

  const calendarMonthYear = computed(() => {
    const { year, month } = calendarDate.value;
    return new Date(year, month, 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  });

  const rightCalendarMonthYear = computed(() => {
    let { year, month } = calendarDate.value;
    month += 1;
    if (month > 11) { month = 0; year += 1; }
    return new Date(year, month, 1).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  });

  // --- Month picker options (bound to navigable pickerYear) ---

  const monthOptions = computed(() =>
    MONTH_LABELS.map((label, index) => ({
      label,
      value: `${pickerYear.value}-${pad2(index + 1)}-01`,
    }))
  );

  // --- Display value for the trigger field ---

  const displayValue = computed(() => {
    if (normalizedType.value === 'date') return formatDateLabel(dateValue.value);
    if (normalizedType.value === 'month') return formatMonthLabel(monthPickerValue.value);
    if (normalizedType.value === 'date-range') {
      const [start, end] = rangeValue.value;
      const startLabel = formatDateLabel(start);
      const endLabel = formatDateLabel(end);
      if (startLabel && endLabel) return `${startLabel} - ${endLabel}`;
      return startLabel || endLabel;
    }
    if (normalizedType.value === 'time') return normalizeText(timeValue.value, '');
    const dateLabel = formatDateLabel(dateTimeValue.value.date);
    const timeLabel = normalizeText(dateTimeValue.value.time, '');
    if (dateLabel && timeLabel) return `${dateLabel} ${timeLabel}`;
    return dateLabel || timeLabel;
  });

  const rootClasses = computed(() => [
    normalizedVariant.value,
    `picker-${normalizedType.value}`,
    internalMenuValue.value && 'is-active',
    props.disabled && 'disabled',
    showLeadingIcon.value && 'has-leading-icon',
    showHint.value && 'has-hint',
  ].filter(Boolean));

  const isSelectionActive = computed(() => displayValue.value.trim().length > 0);

  const vuetifyVariant = computed(() =>
    normalizedVariant.value === 'underlined' ? 'underlined' : 'filled'
  );

  const hintId = computed(() =>
    props.id && showHint.value ? `${props.id}-hint` : null
  );
  const describedBy = computed(() => hintId.value || null);

  // --- Calendar navigation ---

  function prevMonth() {
    let { year, month } = calendarDate.value;
    month -= 1;
    if (month < 0) { month = 11; year -= 1; }
    calendarDate.value = { year, month };
  }

  function nextMonth() {
    let { year, month } = calendarDate.value;
    month += 1;
    if (month > 11) { month = 0; year += 1; }
    calendarDate.value = { year, month };
  }

  function prevYear() {
    calendarDate.value = { ...calendarDate.value, year: calendarDate.value.year - 1 };
  }

  function nextYear() {
    calendarDate.value = { ...calendarDate.value, year: calendarDate.value.year + 1 };
  }

  function pickerPrevYear() {
    pickerYear.value -= 1;
  }

  function pickerNextYear() {
    pickerYear.value += 1;
  }

  // Sync the displayed calendar to the current value when the menu opens.
  function syncCalendarToValue() {
    const type = normalizedType.value;
    let dateStr = '';

    if (type === 'month') {
      dateStr = typeof props.value === 'string' ? props.value : '';
      const d = ensureDate(dateStr);
      if (d) pickerYear.value = d.getFullYear();
      return;
    }

    if (type === 'date') dateStr = typeof props.value === 'string' ? props.value : '';
    else if (type === 'date-time') dateStr = dateTimeValue.value.date;
    else if (type === 'date-range') { const range = rangeValue.value; dateStr = range[0] || ''; }

    const d = ensureDate(dateStr);
    if (d) calendarDate.value = { year: d.getFullYear(), month: d.getMonth() };
  }

  function openMenu() {
    if (props.disabled) return;
    syncCalendarToValue();
    menuValue.value = true;
  }

  function closeMenu() {
    menuValue.value = false;
  }

  function toggleMenu() {
    if (props.disabled) return;
    if (internalMenuValue.value) {
      menuValue.value = false;
    } else {
      syncCalendarToValue();
      menuValue.value = true;
    }
  }

  function onDateChange(nextValue) {
    dateValue.value = nextValue;
    closeMenu();
  }

  function onMonthChange(nextValue) {
    monthPickerValue.value = nextValue;
    closeMenu();
  }

  function onRangeChange(nextValue) {
    rangeValue.value = nextValue;
    if (Array.isArray(nextValue) && nextValue.length === 2) closeMenu();
  }

  function onTimeChange(nextValue) {
    timeValue.value = nextValue;
    closeMenu();
  }

  function onDateTimeDateChange(nextValue) {
    const nextDate = toDateValue(ensureDate(nextValue));
    dateTimeValue.value = { ...dateTimeDraft.value, date: nextDate };
  }

  function onDateTimeTimeChange(nextValue) {
    dateTimeValue.value = {
      ...dateTimeDraft.value,
      time: normalizeText(nextValue, '').trim(),
    };
  }

  return {
    dateValue,
    rangeValue,
    timeValue,
    dateTimeValue,
    monthPickerValue,
    displayValue,
    normalizedType,
    normalizedVariant,
    normalizedHint,
    resolvedPlaceholder,
    leadingIconConfig,
    trailingIconConfig,
    showLeadingIcon,
    showHint,
    menuValue,
    rootClasses,
    isSelectionActive,
    vuetifyVariant,
    hintId,
    describedBy,
    calendarCells,
    leftRangeCalendarCells,
    rightRangeCalendarCells,
    calendarMonthYear,
    rightCalendarMonthYear,
    monthOptions,
    pickerYear,
    openMenu,
    closeMenu,
    toggleMenu,
    onDateChange,
    onMonthChange,
    onRangeChange,
    onTimeChange,
    onDateTimeDateChange,
    onDateTimeTimeChange,
    prevMonth,
    nextMonth,
    prevYear,
    nextYear,
    pickerPrevYear,
    pickerNextYear,
  };
}
