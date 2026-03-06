import { computed, ref } from 'vue';
import { normalizeText } from '../shared/sharedHelpers';
import { toIconConfig } from '../shared/iconHelpers';

export const DATE_TIME_PICKER_VARIANTS = Object.freeze(['default', 'underlined']);
export const DATE_TIME_PICKER_TYPES = Object.freeze(['date', 'month', 'date-range', 'time', 'date-time']);
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

function normalizePickerType(value) {
  const normalized = normalizeText(value, 'date').trim();
  if (DATE_TIME_PICKER_TYPES.includes(normalized)) {
    return normalized;
  }
  return 'date';
}

function normalizeVariant(value) {
  const normalized = normalizeText(value, 'default').trim();
  if (DATE_TIME_PICKER_VARIANTS.includes(normalized)) {
    return normalized;
  }
  return 'default';
}

function normalizeState(value) {
  const normalized = normalizeText(value, 'default').trim();
  if (DATE_TIME_PICKER_STATES.includes(normalized)) {
    return normalized;
  }
  return 'default';
}

function ensureDate(value) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value;
  }
  if (typeof value !== 'string') {
    return null;
  }

  const safeValue = value.includes('T') ? value : `${value}T00:00:00`;
  const date = new Date(safeValue);
  if (Number.isNaN(date.valueOf())) {
    return null;
  }

  return date;
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function toDateValue(date) {
  if (!(date instanceof Date) || Number.isNaN(date.valueOf())) {
    return '';
  }
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function toMonthValue(date) {
  if (!(date instanceof Date) || Number.isNaN(date.valueOf())) {
    return '';
  }
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}`;
}

function formatDateLabel(value) {
  const date = ensureDate(value);
  if (!date) return '';
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatMonthLabel(value) {
  const date = ensureDate(value);
  if (!date) return '';
  return date.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric',
  });
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
    return {
      date: datePart,
      time: timePart.slice(0, 5),
    };
  }

  return {
    date: '',
    time: '',
  };
}

export function useDateTimePicker(props, emit) {
  const internalMenuValue = ref(false);
  const dateTimeDraft = ref(parseDateTimeValue(props.value));

  const normalizedType = computed(() => normalizePickerType(props.type));
  const normalizedVariant = computed(() => normalizeVariant(props.variant));
  const normalizedState = computed(() => normalizeState(props.state));
  const normalizedHint = computed(() => normalizeText(props.hint, '').trim());

  const resolvedPlaceholder = computed(() => {
    const rawPlaceholder = normalizeText(props.placeholder, '').trim();
    if (rawPlaceholder.length > 0) {
      return rawPlaceholder;
    }
    return DEFAULT_PLACEHOLDERS[normalizedType.value];
  });

  const leadingIconConfig = computed(() =>
    toIconConfig(normalizeText(props.icon, 'mdi-plus').trim() || 'mdi-plus')
  );
  const trailingIconConfig = computed(() => toIconConfig(TRAILING_ICONS[normalizedType.value]));

  const showLeadingIcon = computed(() => props.hasIcon === true && leadingIconConfig.value.type !== 'none');
  const showHint = computed(() => props.hasHint === true && normalizedHint.value.length > 0);

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
      const nextText = normalizeText(nextValue, '').trim();
      emit('update:value', nextText);
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
      emit('update:value', {
        date: nextDraft.date,
        time: nextDraft.time,
      });
    },
  });

  const monthPickerValue = computed({
    get() {
      const source = normalizeText(props.value, '');
      if (source.length === 7) {
        return `${source}-01`;
      }
      return source;
    },
    set(nextValue) {
      const date = ensureDate(normalizeText(nextValue, ''));
      emit('update:value', toMonthValue(date));
    },
  });

  const displayValue = computed(() => {
    if (normalizedType.value === 'date') {
      return formatDateLabel(dateValue.value);
    }
    if (normalizedType.value === 'month') {
      return formatMonthLabel(monthPickerValue.value);
    }
    if (normalizedType.value === 'date-range') {
      const [start, end] = rangeValue.value;
      const startLabel = formatDateLabel(start);
      const endLabel = formatDateLabel(end);
      if (startLabel && endLabel) {
        return `${startLabel} - ${endLabel}`;
      }
      return startLabel || endLabel;
    }
    if (normalizedType.value === 'time') {
      return normalizeText(timeValue.value, '');
    }
    const dateLabel = formatDateLabel(dateTimeValue.value.date);
    const timeLabel = normalizeText(dateTimeValue.value.time, '');
    if (dateLabel && timeLabel) {
      return `${dateLabel} ${timeLabel}`;
    }
    return dateLabel || timeLabel;
  });

  const rootClasses = computed(() => [
    normalizedVariant.value,
    `picker-${normalizedType.value}`,
    `state-${normalizedState.value}`,
    props.disabled && 'disabled',
    showLeadingIcon.value && 'has-leading-icon',
    showHint.value && 'has-hint',
  ].filter(Boolean));

  const isSelectionActive = computed(() => displayValue.value.trim().length > 0);
  const fieldWidth = computed(() => (
    normalizedType.value === 'date-range' ? '320px' : '240px'
  ));

  const vuetifyVariant = computed(() => (
    normalizedVariant.value === 'underlined' ? 'underlined' : 'filled'
  ));

  const hintId = computed(() => (
    props.id && showHint.value ? `${props.id}-hint` : null
  ));
  const describedBy = computed(() => hintId.value || null);

  function openMenu() {
    if (props.disabled) return;
    menuValue.value = true;
  }

  function closeMenu() {
    menuValue.value = false;
  }

  function toggleMenu() {
    if (props.disabled) return;
    menuValue.value = !menuValue.value;
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
    if (Array.isArray(nextValue) && nextValue.length === 2) {
      closeMenu();
    }
  }

  function onTimeChange(nextValue) {
    timeValue.value = nextValue;
    closeMenu();
  }

  function onDateTimeDateChange(nextValue) {
    const nextDate = toDateValue(ensureDate(nextValue));
    const nextDraft = {
      ...dateTimeDraft.value,
      date: nextDate,
    };
    dateTimeValue.value = nextDraft;
  }

  function onDateTimeTimeChange(nextValue) {
    const nextDraft = {
      ...dateTimeDraft.value,
      time: normalizeText(nextValue, '').trim(),
    };
    dateTimeValue.value = nextDraft;
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
    normalizedState,
    normalizedHint,
    resolvedPlaceholder,
    leadingIconConfig,
    trailingIconConfig,
    showLeadingIcon,
    showHint,
    menuValue,
    rootClasses,
    isSelectionActive,
    fieldWidth,
    vuetifyVariant,
    hintId,
    describedBy,
    openMenu,
    closeMenu,
    toggleMenu,
    onDateChange,
    onMonthChange,
    onRangeChange,
    onTimeChange,
    onDateTimeDateChange,
    onDateTimeTimeChange,
  };
}
