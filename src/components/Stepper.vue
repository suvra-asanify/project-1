<template>
  <div class="stepper-container">
    <div
      v-for="(step, index) in steps"
      :key="step.id"
      class="stepper-item"
    >
      <!-- Step Circle -->
      <div
        class="stepper-circle"
        :class="{ active: step.active, completed: step.completed }"
      >
        <span v-if="!step.completed" class="step-number">{{ index + 1 }}</span>
        <v-icon v-else icon="mdi-check" class="step-check" />
      </div>

      <!-- Step Label -->
      <div class="step-label">{{ step.label }}</div>

      <!-- Connector Line -->
      <div
        v-if="index < steps.length - 1"
        class="connector-line"
        :class="{ active: steps[index + 1].completed }"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Stepper',
  props: {
    activeStep: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      steps: [
        { id: 1, label: 'Basic', active: true, completed: true },
        { id: 2, label: 'Shift', active: true, completed: false },
        { id: 3, label: 'Deviation', active: false, completed: false },
        { id: 4, label: 'Summary', active: false, completed: false },
      ],
    };
  },
};
</script>

<style scoped>
.stepper-container {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.stepper-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.stepper-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  margin-bottom: 8px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.87);
}

.stepper-circle.active {
  border-color: var(--vt-c-primary);
  color: var(--vt-c-primary);
}

.stepper-circle.completed {
  background: var(--vt-c-primary);
  border-color: var(--vt-c-primary);
  color: white;
}

.step-check {
  font-size: 24px;
}

.step-label {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: rgba(0, 0, 0, 0.87);
}

.connector-line {
  position: absolute;
  top: 30px;
  left: 100%;
  width: 120px;
  height: 2px;
  background: rgba(0, 0, 0, 0.12);
  margin: 0 12px;
}

.connector-line.active {
  background: var(--vt-c-primary);
}
</style>
