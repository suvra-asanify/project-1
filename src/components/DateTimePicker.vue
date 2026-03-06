<template>
  <div
    ref="rootEl"
    class="date-time-picker-shell"
    :class="{ disabled }"
    :style="{ minWidth: fieldWidth }"
  >
    <v-text-field
      :model-value="displayValue"
      class="date-time-picker"
      :class="rootClasses"
      :variant="vuetifyVariant"
      :placeholder="resolvedPlaceholder"
      :disabled="disabled"
      :id="id"
      :name="name"
      :error="ariaInvalid"
      :aria-invalid="ariaInvalid ? 'true' : undefined"
      :aria-label="ariaLabel || undefined"
      :aria-required="ariaRequired ? 'true' : undefined"
      :aria-describedby="describedBy"
      :hide-details="$slots.details || showHint ? false : 'auto'"
      readonly
      single-line
      flat
      @click="openMenu"
    >
      <template v-if="$slots['prepend-inner'] || showLeadingIcon" #prepend-inner>
        <slot name="prepend-inner" :icon="leadingIconConfig">
          <ds-icon
            :config="leadingIconConfig"
            icon-class="date-time-picker-icon date-time-picker-leading-icon"
            :image-class="[
              'date-time-picker-image-icon',
              leadingIconConfig.assetType === 'flag' && 'date-time-picker-flag-icon flagcdn-icon',
              leadingIconConfig.assetType === 'image' && 'date-time-picker-custom-icon',
            ]"
          />
        </slot>
      </template>

      <template #append-inner>
        <slot
          name="append-inner"
          :icon="trailingIconConfig"
          :toggle-menu="toggleMenu"
        >
          <button
            class="date-time-picker-append-action"
            type="button"
            :disabled="disabled"
            tabindex="-1"
            @click.stop.prevent="toggleMenu"
          >
            <ds-icon
              :config="trailingIconConfig"
              icon-class="date-time-picker-icon date-time-picker-trailing-icon"
              image-class="date-time-picker-image-icon"
            />
          </button>
        </slot>
      </template>

      <template v-for="slotName in forwardedSlotNames" :key="slotName" #[slotName]="slotProps">
        <slot :name="slotName" v-bind="slotProps" />
      </template>

      <template v-if="$slots.details || showHint" #details>
        <slot name="details" :hint="normalizedHint">
          <div class="date-time-picker-meta">
            <span v-if="showHint" :id="hintId" class="date-time-picker-hint">{{ normalizedHint }}</span>
          </div>
        </slot>
      </template>
    </v-text-field>

    <div v-if="menuValue" class="date-time-picker-dropdown" @mousedown.stop>
      <slot
        name="picker"
        :type="normalizedType"
        :value="dateTimeValue"
        :close="closeMenu"
      >
        <div v-if="normalizedType === 'month'" class="picker-months">
          <button
            v-for="month in monthOptions"
            :key="month.value"
            type="button"
            class="picker-month-chip"
            :class="{ active: monthPickerValue.startsWith(month.value.slice(0, 7)) }"
            @click="onMonthChange(month.value)"
          >
            {{ month.label }}
          </button>
        </div>

        <div v-else-if="normalizedType === 'time'" class="picker-time-list">
          <button
            v-for="time in timeOptions"
            :key="time"
            type="button"
            class="picker-time-item"
            :class="{ active: timeValue === time }"
            @click="onTimeChange(time)"
          >
            {{ time }}
          </button>
        </div>

        <div v-else-if="normalizedType === 'date-range'" class="picker-calendar-wrap">
          <div class="picker-range-calendars">
            <div class="picker-calendar">
              <div class="picker-calendar-header">
                <div class="picker-nav-group">
                  <v-icon size="20">mdi-chevron-double-left</v-icon>
                  <v-icon size="20">mdi-chevron-left</v-icon>
                </div>
                <div class="picker-month-year">Sep 2020</div>
                <div class="picker-nav-group">
                  <v-icon size="20">mdi-chevron-right</v-icon>
                  <v-icon size="20">mdi-chevron-double-right</v-icon>
                </div>
              </div>

              <div class="picker-weekdays">
                <span v-for="day in weekdays" :key="`left-${day}`">{{ day }}</span>
              </div>

              <div class="picker-days-grid">
                <button
                  v-for="cell in leftRangeCalendarCells"
                  :key="`left-${cell.iso}`"
                  type="button"
                  class="picker-day"
                  :class="{
                    muted: cell.muted,
                    selected: isSelectedDay(cell),
                    'in-range': isInRange(cell),
                    'range-start': isRangeEdge(cell, 'start'),
                    'range-end': isRangeEdge(cell, 'end'),
                  }"
                  @click="onDaySelect(cell)"
                >
                  <span>{{ cell.label }}</span>
                  <span v-if="cell.hasDot" class="picker-day-dot"></span>
                </button>
              </div>
            </div>

            <div class="picker-calendar picker-calendar-right">
              <div class="picker-calendar-header">
                <div class="picker-nav-group">
                  <v-icon size="20">mdi-chevron-double-left</v-icon>
                  <v-icon size="20">mdi-chevron-left</v-icon>
                </div>
                <div class="picker-month-year">Oct 2020</div>
                <div class="picker-nav-group">
                  <v-icon size="20">mdi-chevron-right</v-icon>
                  <v-icon size="20">mdi-chevron-double-right</v-icon>
                </div>
              </div>

              <div class="picker-weekdays">
                <span v-for="day in weekdays" :key="`right-${day}`">{{ day }}</span>
              </div>

              <div class="picker-days-grid">
                <button
                  v-for="cell in rightRangeCalendarCells"
                  :key="`right-${cell.iso}`"
                  type="button"
                  class="picker-day"
                  :class="{
                    muted: cell.muted,
                    selected: isSelectedDay(cell),
                    'in-range': isInRange(cell),
                    'range-start': isRangeEdge(cell, 'start'),
                    'range-end': isRangeEdge(cell, 'end'),
                  }"
                  @click="onDaySelect(cell)"
                >
                  <span>{{ cell.label }}</span>
                  <span v-if="cell.hasDot" class="picker-day-dot"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="picker-calendar-wrap" :class="{ 'with-time': normalizedType === 'date-time' }">
          <div class="picker-calendar">
            <div class="picker-calendar-header">
              <div class="picker-nav-group">
                <v-icon size="20">mdi-chevron-double-left</v-icon>
                <v-icon size="20">mdi-chevron-left</v-icon>
              </div>
              <div class="picker-month-year">Sep 2020</div>
              <div class="picker-nav-group">
                <v-icon size="20">mdi-chevron-right</v-icon>
                <v-icon size="20">mdi-chevron-double-right</v-icon>
              </div>
            </div>

            <div class="picker-weekdays">
              <span v-for="day in weekdays" :key="day">{{ day }}</span>
            </div>

            <div class="picker-days-grid">
              <button
                v-for="cell in calendarCells"
                :key="cell.iso"
                type="button"
                class="picker-day"
                :class="{
                  muted: cell.muted,
                  selected: isSelectedDay(cell),
                  'in-range': isInRange(cell),
                  'range-start': isRangeEdge(cell, 'start'),
                  'range-end': isRangeEdge(cell, 'end'),
                }"
                @click="onDaySelect(cell)"
              >
                <span>{{ cell.label }}</span>
                <span v-if="cell.hasDot" class="picker-day-dot"></span>
              </button>
            </div>
          </div>

          <div v-if="normalizedType === 'date-time'" class="picker-time-list picker-time-list-inline">
            <button
              v-for="time in timeOptions"
              :key="time"
              type="button"
              class="picker-time-item"
              :class="{ active: dateTimeValue.time === time }"
              @click="onDateTimeTimeChange(time)"
            >
              {{ time }}
            </button>
          </div>
        </div>
      </slot>
    </div>

    <span v-if="disabled" class="date-time-picker-disabled-overlay" aria-hidden="true"></span>
  </div>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  DATE_TIME_PICKER_STATES,
  DATE_TIME_PICKER_TYPES,
  DATE_TIME_PICKER_VARIANTS,
  useDateTimePicker,
} from '../composables/useDateTimePicker';
import DsIcon from '../shared/DsIcon.vue';
import { useForwardSlots } from '../shared/useForwardSlots';

const SINGLE_CALENDAR_CELLS = Object.freeze([
  { label: '29', iso: '2020-08-29', muted: true, hasDot: false },
  { label: '30', iso: '2020-08-30', muted: true, hasDot: false },
  { label: '1', iso: '2020-09-01', muted: false, hasDot: false },
  { label: '2', iso: '2020-09-02', muted: false, hasDot: false },
  { label: '3', iso: '2020-09-03', muted: false, hasDot: false },
  { label: '4', iso: '2020-09-04', muted: false, hasDot: false },
  { label: '5', iso: '2020-09-05', muted: false, hasDot: false },
  { label: '6', iso: '2020-09-06', muted: false, hasDot: false },
  { label: '7', iso: '2020-09-07', muted: false, hasDot: false },
  { label: '8', iso: '2020-09-08', muted: false, hasDot: false },
  { label: '9', iso: '2020-09-09', muted: false, hasDot: true },
  { label: '10', iso: '2020-09-10', muted: false, hasDot: false },
  { label: '11', iso: '2020-09-11', muted: false, hasDot: false },
  { label: '12', iso: '2020-09-12', muted: false, hasDot: false },
  { label: '13', iso: '2020-09-13', muted: false, hasDot: false },
  { label: '14', iso: '2020-09-14', muted: false, hasDot: false },
  { label: '15', iso: '2020-09-15', muted: false, hasDot: false },
  { label: '16', iso: '2020-09-16', muted: false, hasDot: false },
  { label: '17', iso: '2020-09-17', muted: false, hasDot: false },
  { label: '18', iso: '2020-09-18', muted: false, hasDot: false },
  { label: '19', iso: '2020-09-19', muted: false, hasDot: false },
  { label: '20', iso: '2020-09-20', muted: false, hasDot: false },
  { label: '21', iso: '2020-09-21', muted: false, hasDot: false },
  { label: '22', iso: '2020-09-22', muted: false, hasDot: false },
  { label: '23', iso: '2020-09-23', muted: false, hasDot: false },
  { label: '24', iso: '2020-09-24', muted: false, hasDot: false },
  { label: '25', iso: '2020-09-25', muted: false, hasDot: false },
  { label: '26', iso: '2020-09-26', muted: false, hasDot: false },
  { label: '27', iso: '2020-09-27', muted: false, hasDot: false },
  { label: '28', iso: '2020-09-28', muted: false, hasDot: false },
  { label: '29', iso: '2020-09-29', muted: false, hasDot: false },
  { label: '30', iso: '2020-09-30', muted: false, hasDot: false },
  { label: '1', iso: '2020-10-01', muted: true, hasDot: false },
  { label: '2', iso: '2020-10-02', muted: true, hasDot: false },
  { label: '3', iso: '2020-10-03', muted: true, hasDot: false },
]);

const LEFT_RANGE_CALENDAR_CELLS = Object.freeze([
  { label: '29', iso: '2020-08-29', muted: true, hasDot: false },
  { label: '30', iso: '2020-08-30', muted: true, hasDot: false },
  { label: '1', iso: '2020-09-01', muted: false, hasDot: false },
  { label: '2', iso: '2020-09-02', muted: false, hasDot: false },
  { label: '3', iso: '2020-09-03', muted: false, hasDot: false },
  { label: '4', iso: '2020-09-04', muted: false, hasDot: false },
  { label: '5', iso: '2020-09-05', muted: false, hasDot: false },
  { label: '6', iso: '2020-09-06', muted: false, hasDot: false },
  { label: '7', iso: '2020-09-07', muted: false, hasDot: false },
  { label: '8', iso: '2020-09-08', muted: false, hasDot: false },
  { label: '9', iso: '2020-09-09', muted: false, hasDot: true },
  { label: '10', iso: '2020-09-10', muted: false, hasDot: false },
  { label: '11', iso: '2020-09-11', muted: false, hasDot: false },
  { label: '12', iso: '2020-09-12', muted: false, hasDot: false },
  { label: '13', iso: '2020-09-13', muted: false, hasDot: false },
  { label: '14', iso: '2020-09-14', muted: false, hasDot: false },
  { label: '15', iso: '2020-09-15', muted: false, hasDot: false },
  { label: '16', iso: '2020-09-16', muted: false, hasDot: false },
  { label: '17', iso: '2020-09-17', muted: false, hasDot: false },
  { label: '18', iso: '2020-09-18', muted: false, hasDot: false },
  { label: '19', iso: '2020-09-19', muted: false, hasDot: false },
  { label: '20', iso: '2020-09-20', muted: false, hasDot: false },
  { label: '21', iso: '2020-09-21', muted: false, hasDot: false },
  { label: '22', iso: '2020-09-22', muted: false, hasDot: false },
  { label: '23', iso: '2020-09-23', muted: false, hasDot: false },
  { label: '24', iso: '2020-09-24', muted: false, hasDot: false },
  { label: '25', iso: '2020-09-25', muted: false, hasDot: false },
  { label: '26', iso: '2020-09-26', muted: false, hasDot: false },
  { label: '27', iso: '2020-09-27', muted: false, hasDot: false },
  { label: '28', iso: '2020-09-28', muted: false, hasDot: false },
  { label: '29', iso: '2020-09-29', muted: false, hasDot: false },
  { label: '30', iso: '2020-09-30', muted: false, hasDot: false },
  { label: '1', iso: '2020-10-01', muted: true, hasDot: false },
  { label: '2', iso: '2020-10-02', muted: true, hasDot: false },
  { label: '3', iso: '2020-10-03', muted: true, hasDot: false },
]);

const RIGHT_RANGE_CALENDAR_CELLS = Object.freeze([
  { label: '27', iso: '2020-09-27', muted: true, hasDot: false },
  { label: '28', iso: '2020-09-28', muted: true, hasDot: false },
  { label: '29', iso: '2020-09-29', muted: true, hasDot: false },
  { label: '30', iso: '2020-09-30', muted: true, hasDot: false },
  { label: '1', iso: '2020-10-01', muted: false, hasDot: false },
  { label: '2', iso: '2020-10-02', muted: false, hasDot: false },
  { label: '3', iso: '2020-10-03', muted: false, hasDot: false },
  { label: '4', iso: '2020-10-04', muted: false, hasDot: false },
  { label: '5', iso: '2020-10-05', muted: false, hasDot: false },
  { label: '6', iso: '2020-10-06', muted: false, hasDot: false },
  { label: '7', iso: '2020-10-07', muted: false, hasDot: false },
  { label: '8', iso: '2020-10-08', muted: false, hasDot: false },
  { label: '9', iso: '2020-10-09', muted: false, hasDot: false },
  { label: '10', iso: '2020-10-10', muted: false, hasDot: false },
  { label: '11', iso: '2020-10-11', muted: false, hasDot: false },
  { label: '12', iso: '2020-10-12', muted: false, hasDot: false },
  { label: '13', iso: '2020-10-13', muted: false, hasDot: false },
  { label: '14', iso: '2020-10-14', muted: false, hasDot: false },
  { label: '15', iso: '2020-10-15', muted: false, hasDot: false },
  { label: '16', iso: '2020-10-16', muted: false, hasDot: false },
  { label: '17', iso: '2020-10-17', muted: false, hasDot: false },
  { label: '18', iso: '2020-10-18', muted: false, hasDot: false },
  { label: '19', iso: '2020-10-19', muted: false, hasDot: false },
  { label: '20', iso: '2020-10-20', muted: false, hasDot: false },
  { label: '21', iso: '2020-10-21', muted: false, hasDot: false },
  { label: '22', iso: '2020-10-22', muted: false, hasDot: false },
  { label: '23', iso: '2020-10-23', muted: false, hasDot: false },
  { label: '24', iso: '2020-10-24', muted: false, hasDot: false },
  { label: '25', iso: '2020-10-25', muted: false, hasDot: false },
  { label: '26', iso: '2020-10-26', muted: false, hasDot: false },
  { label: '27', iso: '2020-10-27', muted: false, hasDot: false },
  { label: '28', iso: '2020-10-28', muted: false, hasDot: false },
  { label: '29', iso: '2020-10-29', muted: false, hasDot: false },
  { label: '30', iso: '2020-10-30', muted: false, hasDot: false },
  { label: '31', iso: '2020-10-31', muted: false, hasDot: false },
]);

export default {
  name: 'date-time-picker',
  components: {
    DsIcon,
  },
  emits: ['update:value', 'update:menu'],
  props: {
    variant: {
      type: String,
      default: 'default',
      validator(value) {
        return DATE_TIME_PICKER_VARIANTS.includes(value);
      },
    },
    type: {
      type: String,
      default: 'date',
      validator(value) {
        return DATE_TIME_PICKER_TYPES.includes(value);
      },
    },
    state: {
      type: String,
      default: 'default',
      validator(value) {
        return DATE_TIME_PICKER_STATES.includes(value);
      },
    },
    placeholder: {
      type: String,
      default: '',
    },
    hasIcon: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: 'mdi-plus',
    },
    hasHint: {
      type: Boolean,
      default: false,
    },
    hint: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Array, Object],
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    ariaInvalid: {
      type: Boolean,
      default: false,
    },
    ariaLabel: {
      type: String,
      default: null,
    },
    ariaRequired: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit, slots }) {
    const dateTimePickerState = useDateTimePicker(props, emit);
    const forwardedSlotNames = useForwardSlots(slots, ['prepend-inner', 'append-inner', 'details', 'picker']);
    const rootEl = ref(null);

    const weekdays = Object.freeze(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
    const calendarCells = SINGLE_CALENDAR_CELLS;
    const leftRangeCalendarCells = LEFT_RANGE_CALENDAR_CELLS;
    const rightRangeCalendarCells = RIGHT_RANGE_CALENDAR_CELLS;

    const monthOptions = Object.freeze([
      { label: 'Jan', value: '2020-01-01' },
      { label: 'Feb', value: '2020-02-01' },
      { label: 'Mar', value: '2020-03-01' },
      { label: 'Apr', value: '2020-04-01' },
      { label: 'May', value: '2020-05-01' },
      { label: 'Jun', value: '2020-06-01' },
      { label: 'Jul', value: '2020-07-01' },
      { label: 'Aug', value: '2020-08-01' },
      { label: 'Sep', value: '2020-09-01' },
      { label: 'Oct', value: '2020-10-01' },
      { label: 'Nov', value: '2020-11-01' },
      { label: 'Dec', value: '2020-12-01' },
    ]);

    const timeOptions = computed(() => {
      const options = [];
      for (let hour = 0; hour < 24; hour += 1) {
        for (let minute = 0; minute < 60; minute += 30) {
          const hh = String(hour).padStart(2, '0');
          const mm = String(minute).padStart(2, '0');
          options.push(`${hh}:${mm}`);
        }
      }
      return options;
    });

    function handleOutsideClick(event) {
      if (!dateTimePickerState.menuValue.value || !rootEl.value) {
        return;
      }
      if (!rootEl.value.contains(event.target)) {
        dateTimePickerState.closeMenu();
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        dateTimePickerState.closeMenu();
      }
    }

    onMounted(() => {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    });

    function isSelectedDay(cell) {
      if (!cell || !cell.iso) {
        return false;
      }

      if (dateTimePickerState.normalizedType.value === 'date') {
        return dateTimePickerState.dateValue.value === cell.iso;
      }

      if (dateTimePickerState.normalizedType.value === 'date-time') {
        return dateTimePickerState.dateTimeValue.value.date === cell.iso;
      }

      if (dateTimePickerState.normalizedType.value === 'date-range') {
        const range = Array.isArray(dateTimePickerState.rangeValue.value)
          ? dateTimePickerState.rangeValue.value
          : [];
        return range.includes(cell.iso);
      }

      return false;
    }

    function isInRange(cell) {
      if (dateTimePickerState.normalizedType.value !== 'date-range') {
        return false;
      }

      const range = Array.isArray(dateTimePickerState.rangeValue.value)
        ? dateTimePickerState.rangeValue.value
        : [];
      if (range.length < 2) {
        return false;
      }

      const [start, end] = range;
      return cell.iso > start && cell.iso < end;
    }

    function isRangeEdge(cell, edge) {
      if (dateTimePickerState.normalizedType.value !== 'date-range') {
        return false;
      }

      const range = Array.isArray(dateTimePickerState.rangeValue.value)
        ? dateTimePickerState.rangeValue.value
        : [];

      if (range.length === 0) {
        return false;
      }

      if (edge === 'start') {
        return range[0] === cell.iso;
      }

      if (edge === 'end') {
        return range[1] === cell.iso;
      }

      return false;
    }

    function onDaySelect(cell) {
      if (!cell || !cell.iso) {
        return;
      }

      if (dateTimePickerState.normalizedType.value === 'date') {
        dateTimePickerState.onDateChange(cell.iso);
        return;
      }

      if (dateTimePickerState.normalizedType.value === 'date-time') {
        dateTimePickerState.onDateTimeDateChange(cell.iso);
        return;
      }

      if (dateTimePickerState.normalizedType.value !== 'date-range') {
        return;
      }

      const range = Array.isArray(dateTimePickerState.rangeValue.value)
        ? dateTimePickerState.rangeValue.value
        : [];

      if (range.length !== 1) {
        dateTimePickerState.onRangeChange([cell.iso]);
        return;
      }

      const [start] = range;
      if (cell.iso < start) {
        dateTimePickerState.onRangeChange([cell.iso, start]);
      } else {
        dateTimePickerState.onRangeChange([start, cell.iso]);
      }
    }

    return {
      ...dateTimePickerState,
      forwardedSlotNames,
      rootEl,
      weekdays,
      calendarCells,
      leftRangeCalendarCells,
      rightRangeCalendarCells,
      monthOptions,
      timeOptions,
      isSelectedDay,
      isInRange,
      isRangeEdge,
      onDaySelect,
    };
  },
};
</script>

<style scoped>
.date-time-picker-shell {
  display: inline-flex;
  flex-direction: column;
  position: relative;
  width: 100%;
}

.date-time-picker-shell.disabled {
  cursor: not-allowed;
}

.date-time-picker-disabled-overlay {
  background: transparent;
  cursor: not-allowed;
  inset: 0;
  position: absolute;
  z-index: 4;
}

.date-time-picker {
  width: 100%;
}

.date-time-picker :deep(.v-input__control) {
  min-height: var(--base-40);
}

.date-time-picker :deep(.v-field) {
  --v-field-border-opacity: 1;

  align-items: center;
  background: var(--black-04, rgba(0, 0, 0, 0.04));
  border-radius: var(--rounded-md) var(--rounded-md) 0 0;
  color: var(--black-38, rgba(0, 0, 0, 0.38));
  min-height: var(--base-40);
}

.date-time-picker :deep(.v-field__overlay) {
  display: none;
}

.date-time-picker :deep(.v-field__outline) {
  color: inherit;
}

.date-time-picker :deep(.v-field__input) {
  align-items: center;
  color: rgba(0, 0, 0, 0.87);
  cursor: pointer;
  font-size: var(--body-base-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-base-lh);
  min-height: var(--base-40);
  padding-bottom: 0;
  padding-top: 0;
}

.date-time-picker:not(.underlined):not(.disabled).state-hover :deep(.v-field) {
  background: rgba(0, 0, 0, 0.08);
}

.date-time-picker:not(.underlined):not(.disabled).state-pressed :deep(.v-field) {
  background: rgba(0, 0, 0, 0.16);
}

.date-time-picker.underlined :deep(.v-field) {
  background: transparent;
  border-radius: 0;
  color: #767676;
}

.date-time-picker.underlined :deep(.v-field--variant-underlined .v-field__outline::before) {
  border-bottom-width: var(--border-sm);
  border-top-width: 0;
}

.date-time-picker.underlined :deep(.v-field--variant-underlined .v-field__outline::after) {
  border-bottom-width: var(--base-2);
  border-top-width: 0;
}

.date-time-picker.underlined.state-hover:not(.disabled) :deep(.v-field) {
  color: #717171;
}

.date-time-picker.underlined.state-pressed:not(.disabled) :deep(.v-field) {
  color: var(--brand-87, rgba(0, 90, 156, 0.87));
}

.date-time-picker.disabled :deep(.v-field) {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.18);
}

.date-time-picker.underlined.disabled :deep(.v-field) {
  background: transparent;
}

.date-time-picker :deep(input::placeholder) {
  color: var(--black-60, rgba(0, 0, 0, 0.6));
  opacity: 1;
}

.date-time-picker-icon {
  color: var(--black-60, rgba(0, 0, 0, 0.6));
  font-size: var(--icon-dense);
}

.date-time-picker-image-icon {
  flex: 0 0 auto;
}

.date-time-picker-custom-icon {
  border-radius: var(--base-2);
  height: var(--base-16);
  object-fit: cover;
  width: var(--base-16);
}

.date-time-picker-append-action {
  align-items: center;
  background: none;
  border: 0;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  padding: 0;
}

.date-time-picker.disabled .date-time-picker-append-action {
  cursor: not-allowed;
}

.date-time-picker :deep(.v-field__append-inner),
.date-time-picker :deep(.v-field__prepend-inner) {
  align-items: center;
  padding-bottom: 0;
  padding-top: 0;
}

.date-time-picker :deep(.v-input__details) {
  align-items: center;
  min-height: var(--base-16);
  padding-top: var(--base-4);
}

.date-time-picker-meta {
  display: flex;
  width: 100%;
}

.date-time-picker-hint {
  color: var(--black-60, rgba(0, 0, 0, 0.6));
  font-size: var(--body-xs-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-xs-lh);
}

.date-time-picker-shell.disabled {
  opacity: 0.85;
}

.date-time-picker-dropdown {
  background: var(--white, #fff);
  border-radius: 0 0 var(--rounded-md) var(--rounded-md);
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  left: 0;
  margin-top: 0;
  min-width: 100%;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 12;
}

.picker-calendar-wrap {
  background: #fff;
  min-width: 100%;
  padding: var(--base-8);
}

.picker-calendar-wrap.with-time {
  column-gap: var(--base-8);
  display: grid;
  grid-template-columns: 50% 50%;
}

.picker-range-calendars {
  display: grid;
  gap: var(--base-0);
  grid-template-columns: 50% 50%;
  width: 100%;
}

.picker-calendar-right {
  border-left: var(--border-sm) solid rgba(0, 0, 0, 0.12);
  padding-left: var(--base-8);
}

.picker-calendar {
  min-width: 0;
  width: 100%;
}

.picker-calendar-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--base-4);
  padding: 0 var(--base-4);
}

.picker-nav-group {
  align-items: center;
  color: var(--brand-87, rgba(0, 90, 156, 0.87));
  display: inline-flex;
  gap: var(--base-8);
}

.picker-month-year {
  color: var(--black-87, rgba(0, 0, 0, 0.87));
  font-size: var(--body-sm-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-sm-lh);
}

.picker-weekdays {
  color: var(--black-60, rgba(0, 0, 0, 0.6));
  display: grid;
  font-size: var(--body-xs-size);
  font-weight: var(--font-weight-semibold);
  grid-template-columns: repeat(7, minmax(0, 1fr));
  line-height: var(--body-xs-lh);
  margin-bottom: var(--base-4);
  text-align: center;
  width: 100%;
}

.picker-days-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  width: 100%;
}

.picker-day {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 0;
  color: var(--black-87, rgba(0, 0, 0, 0.87));
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  font-size: var(--body-xs-size);
  font-weight: var(--font-weight-medium);
  height: var(--base-32);
  justify-content: center;
  line-height: var(--body-xs-lh);
  position: relative;
  width: 100%;
}

.picker-day.muted {
  opacity: 0.4;
}

.picker-day-dot {
  background: var(--brand-87, rgba(0, 90, 156, 0.87));
  border-radius: 50%;
  height: 3px;
  margin-top: 2px;
  width: 3px;
}

.picker-day.in-range {
  background: rgba(0, 90, 156, 0.12);
}

.picker-day.range-start,
.picker-day.range-end,
.picker-day.selected {
  background: var(--brand-darken-1, rgb(0, 72, 125));
  color: #fff;
}

.picker-day.range-start {
  border-radius: var(--rounded-md) 0 0 var(--rounded-md);
}

.picker-day.range-end {
  border-radius: 0 var(--rounded-md) var(--rounded-md) 0;
}

.picker-time-list {
  align-content: start;
  display: grid;
  gap: 2px;
  max-height: 248px;
  overflow-y: auto;
  padding: var(--base-8);
  width: 100%;
}

.picker-time-list-inline {
  align-items: center;
  border-left: var(--border-sm) solid rgba(0, 0, 0, 0.12);
  justify-items: center;
  padding-left: var(--base-8);
  width: 100%;
}

.picker-time-item {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: var(--rounded-md);
  color: var(--black-87, rgba(0, 0, 0, 0.87));
  cursor: pointer;
  display: inline-flex;
  font-size: var(--body-sm-size);
  font-weight: var(--font-weight-medium);
  justify-content: center;
  line-height: var(--body-sm-lh);
  min-height: var(--base-32);
  padding: 0 var(--base-8);
  text-align: center;
  width: 100%;
}

.picker-time-item:hover {
  background: rgba(0, 0, 0, 0.06);
}

.picker-time-item.active {
  background: var(--brand-darken-1, rgb(0, 72, 125));
  color: #fff;
}

.picker-months {
  display: grid;
  gap: var(--base-8);
  grid-template-columns: repeat(auto-fit, minmax(88px, 1fr));
  padding: var(--base-8);
  width: 100%;
}

.picker-month-chip {
  background: transparent;
  border: var(--border-sm) solid rgba(0, 0, 0, 0.2);
  border-radius: var(--rounded-md);
  color: var(--black-87, rgba(0, 0, 0, 0.87));
  cursor: pointer;
  font-size: var(--body-sm-size);
  font-weight: var(--font-weight-medium);
  min-height: var(--base-32);
}

.picker-month-chip.active {
  background: var(--brand-darken-1, rgb(0, 72, 125));
  border-color: var(--brand-darken-1, rgb(0, 72, 125));
  color: #fff;
}
</style>
