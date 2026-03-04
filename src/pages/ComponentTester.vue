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
            <select v-model="avatarSizeMode" class="tester-input">
              <option value="default">default</option>
              <option value="small">small</option>
              <option value="large">large</option>
              <option value="custom">custom</option>
            </select>
          </label>

          <label v-if="avatarSizeMode === 'custom'" class="text-label-sm tester-field">
            <span class="tester-field-label">custom size (20-100)</span>
            <input
              v-model.number="avatarCustomSizeValue"
              class="tester-input"
              type="number"
              min="20"
              max="100"
              step="1"
            />
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
            <span class="tester-field-label">range</span>
            <select v-model="progressLinear.range" class="tester-input">
              <option value="1/5">1/5</option>
              <option value="2/5">2/5</option>
              <option value="3/5">3/5</option>
              <option value="4/5">4/5</option>
              <option value="5/5">5/5</option>
            </select>
          </label>

          <template v-if="progressLinear.size === 'large'">
            <label class="text-label-sm tester-toggle">
              <input v-model="progressLinear.rounded" type="checkbox" />
              <span>rounded</span>
            </label>

            <label class="text-label-sm tester-field">
              <span class="tester-field-label">count</span>
              <input v-model="progressLinear.count" class="tester-input" type="text" />
            </label>

            <label class="text-label-sm tester-toggle">
              <input v-model="progressLinear.percentage" type="checkbox" />
              <span>percentage</span>
            </label>

            <label class="text-label-sm tester-toggle">
              <input v-model="progressLinear.currentLimit" type="checkbox" />
              <span>current + limit</span>
            </label>

            <label v-if="progressLinear.currentLimit" class="text-label-sm tester-field">
              <span class="tester-field-label">current</span>
              <input v-model="progressLinear.current" class="tester-input" type="text" />
            </label>

            <label v-if="progressLinear.currentLimit" class="text-label-sm tester-field">
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
          <label class="text-label-sm tester-toggle">
            <input v-model="radioButton.value" type="checkbox" />
            <span>backend value (selected)</span>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">backend label</span>
            <input
              v-model="radioButton.label"
              class="tester-input"
              type="text"
              placeholder="leave empty to hide label"
            />
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

      <div v-else-if="entry.name === 'text-field' && textField" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">variant</span>
            <select v-model="textField.variant" class="tester-input">
              <option value="default">default</option>
              <option value="underlined">underlined</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">size</span>
            <select v-model="textField.size" class="tester-input">
              <option value="default">default</option>
              <option value="small">small</option>
              <option value="large">large</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">placeholder (backend)</span>
            <input v-model="textField.placeholder" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">input / modelValue (backend)</span>
            <input v-model="textField.modelValue" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">prepend icon (mdi-* | flag:in | flagcdn.com/in.svg | custom image url)</span>
            <input v-model="textField.prependInnerIcon" class="tester-input" type="text" placeholder="flag:in" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">append icon (mdi-* | flag:us | https://flagcdn.com/us.svg | custom image url)</span>
            <input v-model="textField.appendInnerIcon" class="tester-input" type="text" placeholder="mdi-plus" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">prefix (backend)</span>
            <input v-model="textField.prefix" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">suffix (backend)</span>
            <input v-model="textField.suffix" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">hint (backend)</span>
            <input v-model="textField.hint" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">char-limit (backend)</span>
            <input
              v-model.number="textField.charLimit"
              class="tester-input"
              type="number"
              min="1"
              step="1"
            />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="textField.disabled" type="checkbox" />
            <span>disabled</span>
          </label>
        </div>

        <div class="tester-preview rounded-md pa-6">
          <component :is="entry.name" v-bind="propsFor(entry.name)" />
        </div>
      </div>

      <div v-else-if="entry.name === 'text-area' && textArea" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">placeholder</span>
            <input v-model="textArea.placeholder" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">input</span>
            <textarea v-model="textArea.input" class="tester-input tester-code" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">hint</span>
            <input v-model="textArea.hint" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">char-limit</span>
            <input
              v-model.number="textArea.charLimit"
              class="tester-input"
              type="number"
              min="1"
              step="1"
            />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="textArea.disabled" type="checkbox" />
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
  </div>
</template>

<script>
import {
  AVATAR_SIZE_KEYS,
  isValidExplicitSize,
} from '../composables/useAvatar';

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
    range: '1/5',
    rounded: false,
    count: 25,
    percentage: true,
    currentLimit: true,
    current: '₹0.00',
    limit: '₹50,000.00',
  },
  'progress-circular': {
    size: 'default',
    value: '1/4',
  },
  'radio-button': {
    value: false,
    label: '',
    disabled: false,
  },
  'text-field': {
    variant: 'default',
    size: 'default',
    placeholder: 'Placeholder Enter Smthng',
    modelValue: 'Input Text',
    prependInnerIcon: '',
    appendInnerIcon: '',
    prefix: '',
    suffix: '',
    hint: '',
    charLimit: null,
    disabled: false,
  },
  'text-area': {
    placeholder: 'Placeholder Enter Smthng',
    input: 'Lorem ipsum dolor sit amet consectetur.',
    hint: 'suffix',
    charLimit: null,
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
    textField() {
      return this.componentProps['text-field'] || null;
    },
    textArea() {
      return this.componentProps['text-area'] || null;
    },
    avatarSizeMode: {
      get() {
        if (!this.avatar) {
          return 'default';
        }

        return (typeof this.avatar.size === 'string' && AVATAR_SIZE_KEYS.includes(this.avatar.size))
          ? this.avatar.size
          : 'custom';
      },
      set(value) {
        if (!this.avatar) {
          return;
        }

        if (value === 'custom') {
          if (!isValidExplicitSize(this.avatar.size)) {
            this.avatar.size = 36;
          }
          return;
        }

        this.avatar.size = value;
      },
    },
    avatarCustomSizeValue: {
      get() {
        if (!this.avatar || !isValidExplicitSize(this.avatar.size)) {
          return '';
        }
        return this.avatar.size;
      },
      set(value) {
        if (!this.avatar) {
          return;
        }

        const numericValue = Number(value);
        if (isValidExplicitSize(numericValue)) {
          this.avatar.size = numericValue;
        }
      },
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

.tester-code {
  min-height: 112px;
  padding: var(--spacing-2) var(--spacing-3);
  resize: vertical;
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
