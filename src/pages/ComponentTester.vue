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

      <div v-if="entry.name === 'avatar' && avatar" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">variant</span>
            <select v-model="avatar.variant" class="tester-input">
              <option v-for="v in AVATAR_VARIANTS" :key="v" :value="v">{{ v }}</option>
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
              <option v-for="s in PROGRESS_LINEAR_SIZES" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">backend count (% | 1/5)</span>
            <input
              v-model="progressLinear.count"
              class="tester-input"
              type="text"
              placeholder="e.g. 75% or 1/5"
            />
          </label>

          <template v-if="progressLinear.size === 'large'">
            <label class="text-label-sm tester-toggle">
              <input v-model="progressLinear.rounded" type="checkbox" />
              <span>rounded</span>
            </label>

            <label class="text-label-sm tester-field">
              <span class="tester-field-label">current (backend)</span>
              <input v-model="progressLinear.current" class="tester-input" type="text" />
            </label>

            <label class="text-label-sm tester-field">
              <span class="tester-field-label">limit (backend)</span>
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
              <option v-for="s in PROGRESS_CIRCULAR_SIZES" :key="s" :value="s">{{ s }}</option>
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

      <div v-else-if="entry.name === 'chip' && chip" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">variant</span>
            <select v-model="chip.variant" class="tester-input">
              <option v-for="v in CHIP_VARIANTS" :key="v" :value="v">{{ v }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">color</span>
            <select v-model="chip.color" class="tester-input">
              <option v-for="c in CHIP_COLORS" :key="c" :value="c">{{ c }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">size</span>
            <select v-model="chip.size" class="tester-input">
              <option v-for="s in CHIP_SIZE_KEYS" :key="s" :value="s">{{ s }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">label (backend)</span>
            <input
              v-model="chip.label"
              class="tester-input"
              type="text"
              placeholder="leave empty for icon-only"
            />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="chip.closable" type="checkbox" />
            <span>closable</span>
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="chip.rounded" type="checkbox" />
            <span>rounded</span>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">prepend-icon (mdi-* | flag:in | image url)</span>
            <input v-model="chip.prependIcon" class="tester-input" type="text" placeholder="leave empty to hide" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">append-icon (mdi-* | flag:us | image url)</span>
            <input v-model="chip.appendIcon" class="tester-input" type="text" placeholder="ignored when closable" />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="chip.disabled" type="checkbox" />
            <span>disabled</span>
          </label>

        </div>

        <div class="tester-preview rounded-md pa-6">
          <component :is="entry.name" v-bind="propsFor(entry.name)" />
        </div>
      </div>

      <div v-else-if="entry.name === 'combo-box' && comboBox" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">variant</span>
            <select v-model="comboBox.variant" class="tester-input">
              <option v-for="v in COMBO_BOX_VARIANTS" :key="v" :value="v">{{ v }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-toggle">
            <input
              v-model="comboBox.multiSelect"
              type="checkbox"
              @change="onComboBoxMultiSelectChange"
            />
            <span>multi-select</span>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">placeholder (backend)</span>
            <input v-model="comboBox.placeholder" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">icon (mdi-* | flag:in | image url)</span>
            <input
              v-model="comboBox.icon"
              class="tester-input"
              type="text"
              placeholder="leave empty to hide"
            />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">hint</span>
            <input
              v-model="comboBox.hint"
              class="tester-input"
              type="text"
              placeholder="leave empty to hide"
            />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">items (comma separated backend)</span>
            <input
              v-model="comboBox.itemsCsv"
              class="tester-input"
              type="text"
              placeholder="Option A, Option B, Option C"
              @input="onComboBoxItemsCsvInput"
            />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">model-value (backend)</span>
            <input
              v-if="comboBox.multiSelect"
              :value="Array.isArray(comboBox.modelValue) ? comboBox.modelValue.join(', ') : ''"
              class="tester-input"
              type="text"
              placeholder="comma separated values"
              @input="onComboBoxModelInput"
            />
            <input
              v-else
              v-model="comboBox.modelValue"
              class="tester-input"
              type="text"
              placeholder="single selected value"
            />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="comboBox.disabled" type="checkbox" />
            <span>disabled</span>
          </label>
        </div>

        <div class="tester-preview rounded-md pa-6">
          <component
            :is="entry.name"
            v-bind="propsFor(entry.name)"
            @update:modelValue="onComboBoxModelValueUpdate"
          />
        </div>
      </div>

      <div v-else-if="entry.name === 'list' && list" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">max-height</span>
            <input
              v-model.number="list.maxHeight"
              class="tester-input"
              type="number"
              min="48"
              step="1"
            />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">items-count (backend)</span>
            <input
              v-model.number="list.itemsCount"
              class="tester-input"
              type="number"
              min="0"
              step="1"
              @input="onListItemsCountInput"
            />
          </label>
        </div>

        <div class="tester-preview tester-preview-list rounded-md pa-6">
          <component
            :is="entry.name"
            v-bind="propsFor(entry.name)"
            @update:modelValue="onListModelValueUpdate"
          />
        </div>
      </div>

      <div v-else-if="entry.name === 'list-item' && listItem" class="tester-layout">
        <div class="tester-controls">
          <label class="text-label-sm tester-field">
            <span class="tester-field-label">size</span>
            <select v-model="listItem.size" class="tester-input">
              <option value="default">default</option>
              <option value="small">small</option>
              <option value="large">large</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">label</span>
            <input v-model="listItem.label" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">subtext</span>
            <input v-model="listItem.subtext" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">append-text</span>
            <input v-model="listItem.appendText" class="tester-input" type="text" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">prepend-icon (mdi-* | flag:in | image url)</span>
            <input v-model="listItem.prependIcon" class="tester-input" type="text" placeholder="leave empty to hide" />
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">append-icon (mdi-* | flag:us | image url)</span>
            <input v-model="listItem.appendIcon" class="tester-input" type="text" placeholder="leave empty to hide" />
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="listItem.selected" type="checkbox" />
            <span>selected</span>
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="listItem.checkbox" type="checkbox" />
            <span>checkbox</span>
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="listItem.avatar" type="checkbox" />
            <span>avatar</span>
          </label>

          <label class="text-label-sm tester-toggle">
            <input v-model="listItem.disabled" type="checkbox" />
            <span>disabled</span>
          </label>
        </div>

        <div class="tester-preview tester-preview-list-item rounded-md pa-6">
          <component
            :is="entry.name"
            v-bind="propsFor(entry.name)"
            @update:selected="onListItemSelectedUpdate"
          />
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
              <option v-for="v in TEXT_FIELD_VARIANTS" :key="v" :value="v">{{ v }}</option>
            </select>
          </label>

          <label class="text-label-sm tester-field">
            <span class="tester-field-label">size</span>
            <select v-model="textField.size" class="tester-input">
              <option v-for="s in TEXT_FIELD_SIZE_KEYS" :key="s" :value="s">{{ s }}</option>
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
            <input v-model="textArea.autoGrow" type="checkbox" />
            <span>auto-grow</span>
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
  AVATAR_VARIANTS,
  isValidExplicitSize,
} from '../composables/useAvatar';
import { CHIP_COLORS, CHIP_SIZE_KEYS, CHIP_VARIANTS } from '../composables/useChip';
import {
  COMBO_BOX_DEFAULT_ITEMS,
  COMBO_BOX_VARIANTS,
} from '../composables/useComboBox';
import { PROGRESS_CIRCULAR_SIZES } from '../composables/useProgressCircular';
import { PROGRESS_LINEAR_SIZES } from '../composables/useProgressLinear';
import { TEXT_FIELD_SIZE_KEYS, TEXT_FIELD_VARIANTS } from '../composables/useTextField';

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

function buildListTesterItems(count = 6) {
  return Array.from({ length: count }, (_, index) => ({
    value: index + 1,
    label: 'Title',
  }));
}

function buildComboBoxTesterItems() {
  return COMBO_BOX_DEFAULT_ITEMS.map((item) => ({ ...item }));
}

function buildComboBoxItemsCsv(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return '';
  }

  return items
    .map((item) => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        return String(item.title ?? item.label ?? item.value ?? '').trim();
      }
      return String(item ?? '').trim();
    })
    .filter((token) => token.length > 0)
    .join(', ');
}

const defaultPropsByComponent = {
  avatar: {
    variant: 'default',
    size: 'default',
    label: 'AA',
    imageSrc: '',
    count: 1,
    rounded: true,
  },
  'progress-linear': {
    size: 'default',
    count: '1/5',
    rounded: false,
    current: null,
    limit: null,
  },
  'progress-circular': {
    size: 'default',
    value: '1/4',
  },
  chip: {
    variant: 'flat',
    color: 'default',
    closable: false,
    rounded: false,
    size: 'default',
    label: 'label',
    prependIcon: '',
    appendIcon: '',
    disabled: false,
  },
  'combo-box': {
    variant: 'default',
    multiSelect: false,
    placeholder: 'Placeholder Select Something',
    icon: '',
    hint: '',
    disabled: false,
    modelValue: null,
    items: buildComboBoxTesterItems(),
    itemsCsv: buildComboBoxItemsCsv(buildComboBoxTesterItems()),
  },
  list: {
    maxHeight: 304,
    modelValue: 2,
    itemsCount: 6,
    items: buildListTesterItems(6),
  },
  'list-item': {
    size: 'default',
    selected: false,
    label: 'Title',
    checkbox: false,
    avatar: false,
    prependIcon: '',
    appendIcon: '',
    subtext: '',
    appendText: '',
    disabled: false,
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
    autoGrow: false,
    disabled: false,
  },
};

export default {
  name: 'ComponentTester',
  components: {
    ...autoComponents,
  },
  setup() {
    return {
      AVATAR_VARIANTS,
      CHIP_COLORS,
      CHIP_SIZE_KEYS,
      CHIP_VARIANTS,
      COMBO_BOX_VARIANTS,
      PROGRESS_CIRCULAR_SIZES,
      PROGRESS_LINEAR_SIZES,
      TEXT_FIELD_SIZE_KEYS,
      TEXT_FIELD_VARIANTS,
    };
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
      return this.componentProps.avatar || null;
    },
    progressLinear() {
      return this.componentProps['progress-linear'] || null;
    },
    progressCircular() {
      return this.componentProps['progress-circular'] || null;
    },
    chip() {
      return this.componentProps.chip || null;
    },
    comboBox() {
      return this.componentProps['combo-box'] || null;
    },
    list() {
      return this.componentProps.list || null;
    },
    listItem() {
      return this.componentProps['list-item'] || null;
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
      const props = this.componentProps[name] || {};
      if (name === 'list') {
        return {
          maxHeight: props.maxHeight,
          modelValue: props.modelValue,
          items: Array.isArray(props.items) ? props.items : [],
        };
      }
      if (name === 'combo-box') {
        return {
          variant: props.variant,
          multiSelect: props.multiSelect,
          placeholder: props.placeholder,
          icon: props.icon,
          hint: props.hint,
          disabled: props.disabled,
          modelValue: props.modelValue,
          items: Array.isArray(props.items) ? props.items : [],
        };
      }
      return props;
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
    onComboBoxModelValueUpdate(nextValue) {
      if (!this.comboBox) {
        return;
      }

      this.comboBox.modelValue = nextValue;
    },
    onComboBoxItemsCsvInput() {
      if (!this.comboBox) {
        return;
      }

      const values = String(this.comboBox.itemsCsv || '')
        .split(',')
        .map((token) => token.trim())
        .filter((token) => token.length > 0);

      this.comboBox.items = values.map((value) => ({
        title: value,
        value,
      }));

      if (this.comboBox.multiSelect === true) {
        const current = Array.isArray(this.comboBox.modelValue)
          ? this.comboBox.modelValue
          : [];

        this.comboBox.modelValue = current.filter((entry) =>
          values.includes(String(entry))
        );
        return;
      }

      if (Array.isArray(this.comboBox.modelValue)) {
        this.comboBox.modelValue = this.comboBox.modelValue[0] ?? null;
      }

      if (this.comboBox.modelValue == null || this.comboBox.modelValue === '') {
        return;
      }

      if (!values.includes(String(this.comboBox.modelValue))) {
        this.comboBox.modelValue = null;
      }
    },
    onComboBoxMultiSelectChange() {
      if (!this.comboBox) {
        return;
      }

      if (this.comboBox.multiSelect === true) {
        if (!Array.isArray(this.comboBox.modelValue)) {
          const singleValue = this.comboBox.modelValue;
          this.comboBox.modelValue = singleValue == null || singleValue === ''
            ? []
            : [singleValue];
        }
        return;
      }

      if (Array.isArray(this.comboBox.modelValue)) {
        this.comboBox.modelValue = this.comboBox.modelValue[0] ?? null;
      }
    },
    onComboBoxModelInput(event) {
      if (!this.comboBox || this.comboBox.multiSelect !== true) {
        return;
      }

      const nextText = event && event.target ? event.target.value : '';
      this.comboBox.modelValue = String(nextText || '')
        .split(',')
        .map((token) => token.trim())
        .filter((token) => token.length > 0);
    },
    onListItemsCountInput() {
      if (!this.list) {
        return;
      }

      const parsed = Number(this.list.itemsCount);
      const normalizedCount = Number.isFinite(parsed)
        ? Math.max(0, Math.floor(parsed))
        : 0;

      this.list.itemsCount = normalizedCount;
      this.list.items = buildListTesterItems(normalizedCount);

      if (normalizedCount === 0) {
        this.list.modelValue = null;
        return;
      }

      const numericModel = Number(this.list.modelValue);
      if (!Number.isFinite(numericModel) || numericModel < 1 || numericModel > normalizedCount) {
        this.list.modelValue = Math.min(2, normalizedCount);
      }
    },
    onListModelValueUpdate(nextValue) {
      if (!this.list) {
        return;
      }

      this.list.modelValue = nextValue;
    },
    onListItemSelectedUpdate(nextValue) {
      if (!this.listItem) {
        return;
      }

      this.listItem.selected = nextValue === true;
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

.tester-preview-list,
.tester-preview-list-item {
  justify-content: flex-start;
}

.tester-preview-list {
  align-items: flex-start;
}

@media (max-width: 900px) {
  .tester-layout {
    grid-template-columns: 1fr;
  }
}
</style>
