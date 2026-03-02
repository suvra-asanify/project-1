<template>
  <div class="tester-root pa-8">
    <header class="tester-header mb-6">
      <h1 class="text-display-section tester-title">Component Tester</h1>
      <p class="text-body-base tester-subtitle">
        All components in <code>src/components</code> are auto-listed here.
      </p>
    </header>

    <section class="tester-card tester-filter pa-4 rounded-lg border-sm mb-6">
      <label class="text-label-sm tester-field">
        <span class="tester-field-label">component</span>
        <select v-model="selectedComponent" class="tester-input">
          <option v-for="entry in componentEntries" :key="entry.name" :value="entry.name">
            {{ entry.name }}
          </option>
        </select>
      </label>
    </section>

    <section
      v-for="entry in visibleComponentEntries"
      :key="entry.name"
      class="tester-card pa-6 rounded-lg border-sm mb-6"
    >
      <div class="tester-card-header mb-4">
        <h2 class="text-label-lg tester-card-title">{{ entry.name }}</h2>
      </div>

      <div v-if="entry.name === 'Avatar' && avatar" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">variant</span>
            <select v-model="avatar.variant" class="tester-input">
              <option value="default">default</option>
              <option value="img">img</option>
              <option value="multiple">multiple</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">size</span>
            <select v-model="avatar.size" class="tester-input">
              <option value="default">default</option>
              <option value="small">small</option>
              <option value="large">large</option>
            </select>
          </label>

          <label v-if="avatar.variant !== 'img'" class="text-label-sm tester-field">
            <span class="tester-field-label">backend label</span>
            <input v-model="avatar.label" class="tester-input" type="text" />
          </label>

          <label v-if="avatar.variant === 'img'" class="text-label-sm tester-field">
            <span class="tester-field-label">backend image url</span>
            <input
              v-model="avatar.imageSrc"
              class="tester-input"
              type="text"
              placeholder="https://..."
              @input="onAvatarImageUrlInput"
            />
          </label>

          <label v-if="avatar.variant === 'img'" class="text-label-sm tester-field">
            <span class="tester-field-label">backend image file</span>
            <input
              class="tester-input-file"
              type="file"
              accept="image/*"
              @change="onAvatarImageFileChange"
            />
          </label>

          <label v-if="avatar.variant === 'multiple'" class="text-label-sm tester-field">
            <span class="tester-field-label">count</span>
            <input v-model.number="avatar.count" class="tester-input" type="number" min="0" />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="avatar.rounded" type="checkbox" />
            <span>rounded</span>
          </label>
        </div>

        <div class="tester-preview rounded-md pa-6">
          <component :is="entry.name" v-bind="propsFor(entry.name)" />
        </div>
      </div>

      <div v-else-if="entry.name === 'progress-linear' && progressLinear" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">size</span>
            <select v-model="progressLinear.size" class="tester-input">
              <option value="default">default</option>
              <option value="large">large</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">backend value</span>
            <input
              v-model="progressLinear.value"
              class="tester-input"
              type="text"
              placeholder="e.g. 25, 80%, 1/5"
            />
          </label>

          <template v-if="progressLinear.size === 'large'">
            <label class="text-label-sm tester-toggle">
              <input v-model="progressLinear.rounded" type="checkbox" />
              <span>rounded</span>
            </label>

            <label class="text-label-sm tester-field">
              <span class="tester-field-label">current</span>
              <input v-model="progressLinear.current" class="tester-input" type="text" />
            </label>

            <label class="text-label-sm tester-field">
              <span class="tester-field-label">limit</span>
              <input v-model="progressLinear.limit" class="tester-input" type="text" />
            </label>
          </template>
        </div>

        <div class="tester-preview rounded-md pa-6">
          <component :is="entry.name" v-bind="propsFor(entry.name)" />
        </div>
      </div>

      <div v-else-if="entry.name === 'progress-circular' && progressCircular" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">size</span>
            <select v-model="progressCircular.size" class="tester-input">
              <option value="default">default</option>
              <option value="small">small</option>
              <option value="large">large</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">backend value</span>
            <input
              v-model="progressCircular.value"
              class="tester-input"
              type="text"
              placeholder="e.g. 25, 80%, 1/4"
            />
          </label>
        </div>

        <div class="tester-preview rounded-md pa-6">
          <component :is="entry.name" v-bind="propsFor(entry.name)" />
        </div>
      </div>

      <div v-else-if="entry.name === 'radio-button' && radioButton" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">state</span>
            <select v-model="radioButton.state" class="tester-input">
              <option value="default">default</option>
              <option value="hover">hover</option>
              <option value="pressed">pressed</option>
            </select>
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="radioButton.value" type="checkbox" />
            <span>backend value (selected)</span>
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="radioButton.hasLabel" type="checkbox" />
            <span>has label</span>
          </label>

          <label v-if="radioButton.hasLabel" class="text-label-sm tester-field">
            <span class="tester-field-label">backend label</span>
            <input v-model="radioButton.label" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="radioButton.disabled" type="checkbox" />
            <span>disabled</span>
          </label>
        </div>

        <div class="tester-preview rounded-md pa-6">
          <component :is="entry.name" v-bind="propsFor(entry.name)" />
        </div>
      </div>

      <div v-else class="tester-preview rounded-md pa-6">
        <component :is="entry.name" v-bind="propsFor(entry.name)" />
      </div>
    </section>

    <section v-if="!componentEntries.length" class="tester-card pa-6 rounded-lg border-sm">
      <h2 class="text-label-lg tester-card-title mb-2">No Components Found</h2>
      <p class="text-body-sm tester-subtitle">
        Add a <code>.vue</code> file to <code>src/components</code> and it will appear here.
      </p>
    </section>

    <section class="tester-card pa-6 rounded-lg border-sm">
      <h2 class="text-label-lg tester-card-title mb-2">How It Works</h2>
      <p class="text-body-sm tester-subtitle">
        This page auto-registers components from <code>src/components</code> (except itself).
      </p>
      <p class="text-body-sm tester-subtitle">
        Use default props for new components, or add custom demo props in this file when needed.
      </p>
    </section>
  </div>
</template>

<script>
const componentFiles = require.context('../components', false, /\.vue$/);
const autoComponents = {};
const autoNames = [];

componentFiles.keys().forEach((filePath) => {
  const baseName = filePath.replace('./', '').replace('.vue', '');
  if (baseName === 'ComponentTester') {
    return;
  }

  const module = componentFiles(filePath);
  const definition = module.default || module;
  const componentName = definition.name || baseName;

  autoComponents[componentName] = definition;
  autoNames.push(componentName);
});

autoNames.sort((a, b) => a.localeCompare(b));

const defaultPropsByComponent = {
  Avatar: {
    variant: 'default',
    size: 'default',
    label: 'AA',
    imageSrc: '',
    count: 1,
    rounded: true,
  },
  'progress-linear': {
    size: 'default',
    rounded: true,
    value: '1/5',
    current: '',
    limit: '',
  },
  'progress-circular': {
    size: 'default',
    value: '1/4',
  },
  'radio-button': {
    state: 'default',
    value: false,
    hasLabel: false,
    label: 'label',
    disabled: false,
  },
};

export default {
  name: 'ComponentTester',
  components: {
    ...autoComponents,
  },
  data() {
    return {
      componentProps: JSON.parse(JSON.stringify(defaultPropsByComponent)),
      selectedComponent: autoNames[0] || '',
    };
  },
  computed: {
    componentEntries() {
      return autoNames.map((name) => ({ name }));
    },
    visibleComponentEntries() {
      return this.componentEntries.filter((entry) => entry.name === this.selectedComponent);
    },
    avatar() {
      return this.componentProps.Avatar || null;
    },
    progressLinear() {
      return this.componentProps['progress-linear'] || null;
    },
    progressCircular() {
      return this.componentProps['progress-circular'] || null;
    },
    radioButton() {
      return this.componentProps['radio-button'] || null;
    },
  },
  methods: {
    propsFor(name) {
      return this.componentProps[name] || {};
    },
    onAvatarImageFileChange(event) {
      if (!this.avatar) {
        return;
      }

      const files = event.target && event.target.files ? event.target.files : [];
      const file = files[0];
      if (!file || !file.type.startsWith('image/')) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (!this.avatar) {
          return;
        }

        this.avatar.imageSrc = typeof reader.result === 'string' ? reader.result : '';
        this.avatar.variant = 'img';
      };
      reader.readAsDataURL(file);
    },
    onAvatarImageUrlInput() {
      if (!this.avatar) {
        return;
      }

      if (String(this.avatar.imageSrc || '').trim().length > 0) {
        this.avatar.variant = 'img';
      }
    },
  },
};
</script>

<style scoped>
.tester-root {
  background: var(--color-surface-background, #f2f3f8);
  min-height: 100vh;
}

.tester-header {
  max-width: 960px;
}

.tester-filter {
  max-width: 320px;
}

.tester-title {
  color: var(--color-text-primary, rgba(0, 0, 0, 0.87));
  margin: 0;
}

.tester-subtitle {
  color: var(--color-text-secondary, rgba(0, 0, 0, 0.6));
  margin: 0;
}

.tester-card {
  background: var(--color-surface-primary, #fff);
  border-color: var(--color-border-primary, rgba(0, 0, 0, 0.12));
  border-style: solid;
  max-width: 960px;
}

.tester-card-title {
  color: var(--color-text-primary, rgba(0, 0, 0, 0.87));
  margin: 0;
}

.tester-layout {
  display: grid;
  gap: var(--spacing-6);
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
}

.tester-controls {
  display: grid;
  gap: var(--spacing-4);
}

.tester-field {
  display: grid;
  gap: var(--spacing-1);
}

.tester-field-label {
  color: var(--color-text-secondary, rgba(0, 0, 0, 0.6));
}

.tester-input {
  border: var(--border-sm) solid var(--color-border-primary, rgba(0, 0, 0, 0.12));
  border-radius: var(--rounded-md);
  color: var(--color-text-primary, rgba(0, 0, 0, 0.87));
  font: inherit;
  min-height: var(--base-40);
  padding: 0 var(--spacing-3);
}

.tester-toggle {
  align-items: center;
  color: var(--color-text-primary, rgba(0, 0, 0, 0.87));
  display: inline-flex;
  gap: var(--spacing-2);
}

.tester-input-file {
  border: var(--border-sm) dashed var(--color-border-primary, rgba(0, 0, 0, 0.12));
  border-radius: var(--rounded-md);
  color: var(--color-text-primary, rgba(0, 0, 0, 0.87));
  font: inherit;
  min-height: var(--base-40);
  padding: var(--spacing-2) var(--spacing-3);
}

.tester-preview {
  align-items: center;
  background: var(--color-surface-background, #f2f3f8);
  display: flex;
  justify-content: center;
  min-height: 200px;
}

@media (max-width: 900px) {
  .tester-layout {
    grid-template-columns: 1fr;
  }
}
</style>

