<template>
  <v-app class="policy-builder-page">
    <v-app-bar
      app
      flat
      height="70"
      class="policy-app-bar"
    >
      <div class="app-bar-left">
        <v-btn
          icon
          variant="text"
          size="small"
          class="menu-trigger"
          @click="toggleDrawer"
        >
          <v-icon icon="mdi-menu" />
        </v-btn>

        <span class="brand-text">asanify</span>

        <v-btn
          variant="text"
          size="small"
          class="apps-trigger"
        >
          <v-icon icon="mdi-view-grid" size="14" />
          <span>Apps</span>
        </v-btn>

        <v-text-field
          model-value="Search in Apps and People"
          readonly
          hide-details
          density="compact"
          variant="underlined"
          prepend-inner-icon="mdi-magnify"
          class="search-field"
        />

        <v-btn
          icon
          variant="outlined"
          class="insight-btn"
        >
          <v-icon icon="mdi-star-four-points-outline" size="16" />
        </v-btn>
      </div>

      <div class="app-bar-right">
        <button class="quick-link" type="button">
          <span>I want to...</span>
          <v-icon icon="mdi-chevron-down" size="16" />
        </button>

        <v-btn icon variant="text" size="small" class="top-action">
          <v-icon icon="mdi-help-circle-outline" />
        </v-btn>
        <v-btn icon variant="text" size="small" class="top-action">
          <v-icon icon="mdi-bell-outline" />
        </v-btn>
        <v-btn icon variant="text" size="small" class="top-action">
          <v-icon icon="mdi-calendar-blank-outline" />
        </v-btn>

        <v-divider vertical class="top-divider" />

        <div class="profile-menu">
          <v-avatar size="28" class="initials-avatar">AA</v-avatar>

          <div class="profile-meta">
            <span class="company-name">Acme Corporation</span>
            <span class="company-role">Admin</span>
          </div>

          <v-avatar size="28" class="company-avatar">
            <v-img :src="companyAvatarUrl" cover />
          </v-avatar>

          <v-icon icon="mdi-chevron-down" size="16" class="profile-chevron" />
        </div>
      </div>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawerOpen"
      app
      class="policy-nav"
      :permanent="!isMobile"
      :temporary="isMobile"
      :width="256"
    >
      <div class="policy-nav-inner">
        <v-list density="compact" class="nav-list">
          <v-list-item
            v-for="item in navItems"
            :key="item.title"
            :ripple="false"
            class="nav-item"
            :class="{
              'nav-item--active': item.active,
              'nav-item--highlight': item.highlight,
            }"
          >
            <template #prepend>
              <v-icon :icon="item.icon" class="nav-item-icon" />
            </template>

            <v-list-item-title class="nav-item-title">{{ item.title }}</v-list-item-title>

            <template #append>
              <v-icon icon="mdi-chevron-down" size="16" class="nav-chevron" />
            </template>
          </v-list-item>
        </v-list>

        <div class="nav-scroll-track">
          <div class="nav-scroll-thumb" />
        </div>
      </div>
    </v-navigation-drawer>

    <v-main class="policy-main">
      <div class="policy-content">
        <div class="breadcrumbs-row">
          <span class="crumb-link">Attendance</span>
          <v-icon icon="mdi-chevron-right" size="18" />
          <span class="crumb-link">Policies</span>
          <v-icon icon="mdi-chevron-right" size="18" />
          <span class="crumb-current">Create</span>
        </div>

        <div class="stepper-strip">
          <template v-for="(step, index) in steps" :key="step.title">
            <div class="step-item">
              <div
                class="step-dot"
                :class="{
                  'step-dot--complete': step.state === 'complete',
                  'step-dot--active': step.state === 'active',
                  'step-dot--pending': step.state === 'pending',
                }"
              >
                <v-icon v-if="step.state === 'complete'" icon="mdi-check" size="18" />
                <span v-else>{{ step.number }}</span>
              </div>

              <span
                class="step-label"
                :class="{
                  'step-label--active': step.state === 'active',
                  'step-label--pending': step.state === 'pending',
                }"
              >
                {{ step.title }}
              </span>
            </div>

            <div v-if="index < steps.length - 1" class="step-line" />
          </template>
        </div>

        <section class="form-stack">
          <h1 class="section-title">Shift Details</h1>

          <v-sheet class="question-card" rounded="sm">
            <h2 class="question-label">At what time does the shift start?</h2>
            <v-text-field
              model-value="05:00 AM"
              readonly
              density="compact"
              hide-details
              variant="underlined"
              append-inner-icon="mdi-clock-time-two-outline"
              class="base-field"
            />
          </v-sheet>

          <v-sheet class="question-card" rounded="sm">
            <h2 class="question-label">At what time does the shift end?</h2>
            <v-text-field
              model-value="11:30 AM"
              readonly
              density="compact"
              hide-details
              variant="underlined"
              append-inner-icon="mdi-clock-time-two-outline"
              class="base-field"
            />
          </v-sheet>

          <v-sheet class="question-card" rounded="sm">
            <h2 class="question-label">Which day should be considered the first day of the work week?</h2>
            <div class="day-toggle-row">
              <v-btn
                v-for="option in dayOptions"
                :key="`first-${option.key}`"
                :ripple="false"
                variant="outlined"
                class="day-toggle-btn"
                :class="{ 'day-toggle-btn--active': firstDay === option.key }"
                @click="firstDay = option.key"
              >
                {{ option.label }}
              </v-btn>
            </div>
          </v-sheet>

          <v-sheet class="question-card" rounded="sm">
            <h2 class="question-label">Which days of the week are weekly offs?</h2>
            <p class="helper-text">
              Weekly off is a day in the week when the person is not expected to work or come to the office.
            </p>

            <div class="day-toggle-row">
              <v-btn
                v-for="option in dayOptions"
                :key="`weekly-${option.key}`"
                :ripple="false"
                variant="outlined"
                class="day-toggle-btn"
                :class="{
                  'day-toggle-btn--selected': weeklyOffs.includes(option.key),
                  'day-toggle-btn--weekend': weeklyOffs.includes(option.key) && option.weekend,
                }"
                @click="toggleWeeklyOff(option.key)"
              >
                {{ option.label }}
              </v-btn>
            </div>
          </v-sheet>

          <v-sheet class="question-card" rounded="sm">
            <h2 class="question-label">Do you want to give break hours between work hours?</h2>

            <v-radio-group v-model="breakHours" hide-details class="radio-group">
              <v-radio label="Yes" value="yes" />

              <div v-if="breakHours === 'yes'" class="inline-form-row">
                <span class="inline-text">Break hours in mins</span>
                <v-text-field
                  model-value="60"
                  readonly
                  density="compact"
                  hide-details
                  variant="underlined"
                  class="base-field tiny-field"
                />
              </div>

              <v-radio label="No" value="no" />
            </v-radio-group>
          </v-sheet>

          <v-sheet class="question-card" rounded="sm">
            <h2 class="question-label">Should employee clock in and out on each break?</h2>
            <p class="helper-text">
              If employee forgot to clock out then also he will be marked as full day present if Yes is selected.
            </p>

            <v-radio-group v-model="singleClockIn" hide-details class="radio-group">
              <v-radio label="Yes" value="yes" />
              <v-radio label="No" value="no" />
            </v-radio-group>
          </v-sheet>

          <h1 class="section-title">Handling late arrivals</h1>

          <v-sheet class="question-card" rounded="sm">
            <h2 class="question-label">
              What happens when an employee's first clock in is after the shift start time (05:00 AM)?
            </h2>

            <v-radio-group v-model="lateArrivalRule" hide-details class="radio-group">
              <v-radio
                value="anytime"
                label="It doesn't matter; Employees can clock in any time during the day without being marked late"
              />

              <v-radio
                value="threshold"
                label="Employees need to clock in by a certain time to not be marked late"
              />

              <div v-if="lateArrivalRule === 'threshold'" class="inline-form-row">
                <span class="inline-text">First clock in should be before</span>
                <v-text-field
                  model-value="05:00 AM"
                  readonly
                  density="compact"
                  hide-details
                  variant="underlined"
                  append-inner-icon="mdi-clock-time-two-outline"
                  class="base-field medium-field"
                />
              </div>

              <v-radio value="late" label="Employees are marked late" />
            </v-radio-group>
          </v-sheet>

          <v-sheet class="question-card" rounded="sm">
            <h2 class="question-label">What happens when an employee arrives late?</h2>

            <v-radio-group v-model="lateConsequence" hide-details class="radio-group">
              <v-radio value="none" label="No Action Taken" />
              <v-radio value="lop" label="Loss of Pay" />
              <v-radio value="leave" label="Loss of Leave" />
            </v-radio-group>

            <v-sheet class="leave-policy-box" rounded="0">
              <h3 class="policy-label">Which leave policies should be deducted, and in what priority order?</h3>

              <div
                v-for="(policy, index) in leavePolicies"
                :key="`policy-${index}`"
                class="policy-row"
              >
                <v-icon icon="mdi-drag-vertical" size="22" class="drag-icon" />
                <span class="policy-index">{{ index + 1 }}.</span>

                <v-select
                  v-model="leavePolicies[index]"
                  :items="leavePolicyOptions"
                  hide-details
                  density="compact"
                  variant="underlined"
                  class="base-field policy-field"
                />
              </div>

              <v-btn variant="text" class="add-policy-btn" prepend-icon="mdi-plus">
                Add another leave policy
              </v-btn>

              <v-alert
                type="info"
                variant="tonal"
                density="compact"
                icon="mdi-information-slab-circle-outline"
                class="leave-alert"
              >
                If no leave balance is available for deduction, Loss of Pay will be applied automatically.
              </v-alert>
            </v-sheet>
          </v-sheet>

          <v-sheet class="question-card" rounded="sm">
            <h2 class="question-label">How should penalty be calculated?</h2>

            <div class="penalty-row">
              <span class="inline-text">Deduct</span>

              <v-text-field
                model-value="--"
                readonly
                density="compact"
                hide-details
                variant="underlined"
                class="base-field tiny-field"
              />

              <span class="inline-text">day(s) of leaves, for every</span>

              <v-text-field
                model-value="--"
                readonly
                density="compact"
                hide-details
                variant="underlined"
                class="base-field tiny-field"
              />

              <span class="inline-text">day(s) of late arrival in a</span>

              <v-select
                v-model="selectedPeriod"
                :items="periodOptions"
                chips
                hide-details
                density="compact"
                variant="underlined"
                class="base-field period-field"
              />
            </div>
          </v-sheet>

          <div class="footer-actions">
            <v-btn
              class="footer-btn footer-btn--secondary"
              variant="outlined"
              prepend-icon="mdi-chevron-left"
            >
              Go back
            </v-btn>

            <v-btn
              class="footer-btn footer-btn--primary"
              color="primary"
              append-icon="mdi-chevron-right"
            >
              Deviations
            </v-btn>
          </div>
        </section>
      </div>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';

const display = useDisplay();
const isMobile = computed(() => display.mdAndDown.value);
const drawerOpen = ref(true);

const companyAvatarUrl = 'https://www.figma.com/api/mcp/asset/141dd3c4-2e03-4f77-b006-9a15508f5618';

const navItems = [
  { title: 'Home', icon: 'mdi-home', active: true },
  { title: 'Hiring', icon: 'mdi-account-plus' },
  { title: 'People', icon: 'mdi-account' },
  { title: 'Payroll', icon: 'mdi-currency-inr' },
  { title: 'Leave', icon: 'mdi-file-document-outline' },
  { title: 'Attendance', icon: 'mdi-clock-time-three-outline' },
  { title: 'Documents', icon: 'mdi-folder' },
  { title: 'Performance & OKRs', icon: 'mdi-chart-bar' },
  { title: 'Requests', icon: 'mdi-clipboard-text-outline' },
  { title: 'Analytics', icon: 'mdi-chart-line' },
  { title: 'Company', icon: 'mdi-domain' },
  { title: 'Plan and Billing', icon: 'mdi-cash-multiple' },
  { title: 'Integrations', icon: 'mdi-arrow-expand-all' },
  { title: 'Agentic AI Status', icon: 'mdi-star-four-points' },
  { title: 'All Apps', icon: 'mdi-view-grid', highlight: true },
];

const steps = [
  { number: 1, title: 'Basic', state: 'complete' },
  { number: 2, title: 'Shift', state: 'active' },
  { number: 3, title: 'Deviation', state: 'pending' },
  { number: 4, title: 'Summary', state: 'pending' },
];

const dayOptions = [
  { key: 'mon', label: 'M', weekend: false },
  { key: 'tue', label: 'T', weekend: false },
  { key: 'wed', label: 'W', weekend: false },
  { key: 'thu', label: 'T', weekend: false },
  { key: 'fri', label: 'F', weekend: false },
  { key: 'sat', label: 'S', weekend: true },
  { key: 'sun', label: 'S', weekend: true },
];

const firstDay = ref('mon');
const weeklyOffs = ref(dayOptions.map((option) => option.key));

const breakHours = ref('yes');
const singleClockIn = ref('yes');
const lateArrivalRule = ref('threshold');
const lateConsequence = ref('leave');

const leavePolicyOptions = ['Leave Policy', 'Annual Leave', 'Sick Leave', 'Casual Leave'];
const leavePolicies = ref(['Leave Policy', 'Leave Policy']);

const periodOptions = ['Week', 'Month', 'Quarter'];
const selectedPeriod = ref('Month');

const toggleDrawer = () => {
  if (isMobile.value) {
    drawerOpen.value = !drawerOpen.value;
  }
};

const toggleWeeklyOff = (key) => {
  if (weeklyOffs.value.includes(key)) {
    weeklyOffs.value = weeklyOffs.value.filter((value) => value !== key);
    return;
  }

  weeklyOffs.value = [...weeklyOffs.value, key];
};

watch(
  isMobile,
  (mobile) => {
    drawerOpen.value = !mobile;
  },
  { immediate: true },
);
</script>

<style scoped>
.policy-builder-page {
  background: var(--color-surface-background, #f2f3f8);
}

.policy-app-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.12), 0 4px 5px rgba(0, 0, 0, 0.14),
    0 2px 4px -1px rgba(0, 0, 0, 0.2);
  padding: 0 16px;
}

.policy-app-bar :deep(.v-toolbar__content) {
  padding: 0;
  gap: 20px;
}

.app-bar-left {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.brand-text {
  font-size: 20px;
  line-height: 1;
  font-weight: 700;
  color: #005a9c;
}

.apps-trigger {
  min-width: 0;
  padding: 0;
  color: rgba(0, 0, 0, 0.87);
  text-transform: none;
  font-size: 14px;
  font-weight: 600;
  gap: 3px;
}

.search-field {
  width: 240px;
  max-width: 240px;
}

.search-field :deep(.v-field) {
  background: rgba(0, 0, 0, 0.04);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.search-field :deep(.v-field__overlay),
.search-field :deep(.v-field__outline) {
  display: none;
}

.search-field :deep(.v-field__input) {
  font-size: 16px;
  color: rgba(0, 0, 0, 0.6);
  min-height: 40px;
  padding-top: 8px;
  padding-bottom: 8px;
}

.search-field :deep(.v-input__details) {
  display: none;
}

.insight-btn {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 4px;
  border-color: rgba(0, 90, 156, 0.87);
  color: rgba(0, 90, 156, 0.87);
}

.app-bar-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
}

.quick-link {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  border: 0;
  background: transparent;
  color: #005a9c;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-right: 4px;
}

.top-action {
  color: #005a9c;
}

.top-divider {
  margin: 0 4px;
  opacity: 0.3;
}

.profile-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.initials-avatar {
  background: #005a9c;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
}

.profile-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.company-name {
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.company-role {
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
}

.policy-nav {
  background: var(--color-surface-left-nav, #242939) !important;
}

.policy-nav :deep(.v-navigation-drawer__content) {
  background: var(--color-surface-left-nav, #242939);
}

.policy-nav-inner {
  height: 100%;
  display: flex;
  position: relative;
}

.nav-list {
  width: 246px;
  padding-top: 16px;
  background: transparent;
}

.nav-item {
  min-height: 48px;
  padding-left: 16px;
  padding-right: 16px;
  color: #ffffff;
}

.nav-item :deep(.v-list-item__overlay) {
  opacity: 0 !important;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.nav-item-icon,
.nav-item-title,
.nav-chevron {
  color: #ffffff;
}

.nav-item-title {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}

.nav-item--active {
  background: rgba(255, 255, 255, 0.06);
}

.nav-item--highlight .nav-item-title,
.nav-item--highlight .nav-item-icon {
  color: #00a9ff;
}

.nav-scroll-track {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 100%;
  background: #ffe0b2;
  border-radius: 999px;
}

.nav-scroll-thumb {
  position: absolute;
  top: 4px;
  left: 1px;
  right: 1px;
  height: 25%;
  background: #ffc977;
  border-radius: 999px;
}

.policy-main {
  background: var(--color-surface-background, #f2f3f8);
}

.policy-main :deep(.v-main__wrap) {
  display: flex;
  justify-content: flex-start;
}

.policy-content {
  width: 100%;
  max-width: 1184px;
  padding: 16px 60px 44px;
}

.breadcrumbs-row {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.crumb-link {
  color: #005a9c;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}

.crumb-current {
  color: rgba(0, 0, 0, 0.87);
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
}

.stepper-strip {
  width: 800px;
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
}

.step-item {
  min-width: 88px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 24px 0;
}

.step-dot {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
}

.step-dot--complete,
.step-dot--active {
  background: #005a9c;
  color: #ffffff;
}

.step-dot--pending {
  background: rgba(66, 66, 66, 0.6);
  color: #eeeeee;
}

.step-label {
  color: rgba(0, 0, 0, 0.6);
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}

.step-label--active {
  color: rgba(0, 0, 0, 0.87);
}

.step-line {
  flex: 1;
  height: 1px;
  background: rgba(0, 0, 0, 0.38);
  margin-top: 56px;
}

.form-stack {
  width: 800px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  margin: 0;
  color: #000000;
  font-size: 34px;
  line-height: 40px;
  font-weight: 600;
}

.question-card {
  background: #ffffff;
  border-radius: 4px;
  padding: 8px 16px 12px;
}

.question-label {
  margin: 0;
  color: #000000;
  font-size: 18px;
  line-height: 28px;
  font-weight: 500;
}

.helper-text {
  margin: 0;
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
}

.base-field {
  margin-top: 8px;
}

.base-field :deep(.v-field) {
  background: rgba(0, 0, 0, 0.04);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.38);
}

.base-field :deep(.v-field__outline) {
  display: none;
}

.base-field :deep(.v-field__input) {
  min-height: 40px;
  padding-top: 8px;
  padding-bottom: 8px;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
}

.base-field :deep(.v-input__details) {
  display: none;
}

.day-toggle-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.day-toggle-btn {
  width: 40px;
  min-width: 40px;
  height: 40px;
  border-radius: 4px;
  border-color: rgba(0, 0, 0, 0.28);
  color: rgba(0, 0, 0, 0.42);
  text-transform: none;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  padding: 0;
  background: #f4f4f4;
}

.day-toggle-btn--active,
.day-toggle-btn--selected {
  border-color: rgba(0, 90, 156, 0.87);
  color: #005a9c;
  background: #ffffff;
}

.day-toggle-btn--weekend {
  border-color: #005a9c;
  color: #ffffff;
  background: #005a9c;
}

.radio-group {
  margin-top: 6px;
}

.radio-group :deep(.v-input__details) {
  display: none;
}

.radio-group :deep(.v-selection-control) {
  min-height: 40px;
}

.radio-group :deep(.v-label) {
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  opacity: 1;
}

.inline-form-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  padding-left: 40px;
}

.inline-text {
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}

.tiny-field {
  width: 64px;
  max-width: 64px;
  margin-top: 0;
}

.medium-field {
  width: 240px;
  max-width: 240px;
  margin-top: 0;
}

.leave-policy-box {
  margin-top: 4px;
  padding: 2px 12px 8px;
  background: #ffffff;
}

.policy-label {
  margin: 0;
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
}

.policy-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.drag-icon {
  color: rgba(0, 0, 0, 0.6);
}

.policy-index {
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  width: 16px;
}

.policy-field {
  width: 290px;
  max-width: 290px;
  margin-top: 0;
}

.policy-field :deep(.v-field__input) {
  font-weight: 400;
  color: rgba(0, 0, 0, 0.6);
}

.add-policy-btn {
  margin-top: 6px;
  margin-left: -4px;
  padding: 0;
  min-width: 0;
  color: #005a9c;
  text-transform: none;
  font-size: 18px;
  line-height: 22px;
  font-weight: 700;
}

.leave-alert {
  margin-top: 8px;
  border: 1px solid #03a9f4;
  background: #e0f4fd;
  color: rgba(0, 0, 0, 0.87);
}

.leave-alert :deep(.v-alert__content) {
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
}

.penalty-row {
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.period-field {
  width: 130px;
  max-width: 130px;
  margin-top: 0;
}

.period-field :deep(.v-chip) {
  background: #e3e3e3;
  border-radius: 999px;
  font-size: 14px;
  line-height: 16px;
  font-weight: 600;
}

.footer-actions {
  display: flex;
  gap: 12px;
  padding: 12px 0;
}

.footer-btn {
  flex: 1;
  height: 40px;
  border-radius: 4px;
  text-transform: none;
  font-size: 18px;
  line-height: 22px;
  font-weight: 700;
}

.footer-btn--secondary {
  border-color: rgba(0, 90, 156, 0.87);
  color: #005a9c;
}

.footer-btn--primary {
  color: #ffffff;
}

@media (max-width: 1264px) {
  .policy-content {
    padding: 16px 24px 32px;
  }
}

@media (max-width: 960px) {
  .policy-app-bar {
    padding: 0 12px;
  }

  .apps-trigger,
  .search-field,
  .quick-link,
  .top-action,
  .top-divider,
  .profile-meta,
  .company-avatar {
    display: none;
  }

  .policy-content {
    padding: 16px;
  }

  .stepper-strip,
  .form-stack {
    width: 100%;
  }

  .step-item {
    min-width: 64px;
    gap: 10px;
    padding: 16px 0;
  }

  .step-label {
    font-size: 14px;
    line-height: 20px;
  }

  .step-line {
    margin-top: 34px;
  }

  .question-label {
    font-size: 16px;
    line-height: 24px;
  }

  .policy-row {
    flex-wrap: wrap;
  }

  .policy-field,
  .medium-field {
    width: 100%;
    max-width: 100%;
  }

  .footer-actions {
    flex-direction: column;
  }

  .footer-btn {
    width: 100%;
    flex: none;
  }
}
</style>
