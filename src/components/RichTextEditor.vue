<template>
  <div class="rich-text-editor-shell" :class="rootClasses">
    <div v-if="showToolbar" class="rich-text-editor-toolbar" role="toolbar" aria-label="Formatting toolbar">
      <div v-if="hasFormat('header')" class="toolbar-group">
        <v-menu
          v-model="headingMenuOpen"
          :close-on-content-click="false"
          location="bottom start"
          :offset="4"
        >
          <template #activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              class="toolbar-select heading-trigger"
              :disabled="isDisabled"
              :ripple="false"
              variant="text"
              rounded="0"
              aria-haspopup="listbox"
              :aria-expanded="headingMenuOpen ? 'true' : 'false'"
            >
              <span>{{ selectedHeadingLabel }}</span>
              <v-icon size="24">mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <div class="heading-menu" role="listbox">
            <list
              class="rte-dropdown-list heading-list"
              :items="headingListItems"
              :value="selectedHeading"
              :max-height="360"
              @update:value="selectHeading"
            >
              <template #title="{ value, label }">
                <span
                  class="heading-option-label"
                  :class="value === 'paragraph' ? 'heading-option-normal' : `heading-option-${value}`"
                >
                  {{ label }}
                </span>
              </template>
            </list>
          </div>
        </v-menu>
      </div>

      <div class="toolbar-group toolbar-group--format">
        <button
          v-for="button in visibleTextFormatButtons"
          :key="button.key"
          type="button"
          class="toolbar-btn toolbar-btn--text"
          :class="[`toolbar-btn--${button.key}`, { active: formatState[button.command] }]"
          :disabled="isDisabled"
          :aria-label="button.ariaLabel"
          @click="runCommand(button.command)"
        >
          {{ button.label }}
        </button>
      </div>

      <div v-if="hasFormat('link')" class="toolbar-group">
        <button type="button" class="toolbar-btn" :disabled="isDisabled" aria-label="Link" @click="insertLink">
          <v-icon size="24">mdi-link-variant</v-icon>
        </button>
      </div>

      <div v-if="hasFormat('font')" class="toolbar-group">
        <v-menu
          v-model="fontMenuOpen"
          :close-on-content-click="false"
          location="bottom start"
          :offset="4"
        >
          <template #activator="{ props: activatorProps }">
            <v-btn
              v-bind="activatorProps"
              class="toolbar-select font-trigger"
              :disabled="isDisabled"
              :ripple="false"
              variant="text"
              rounded="0"
              aria-haspopup="listbox"
              :aria-expanded="fontMenuOpen ? 'true' : 'false'"
            >
              <span>{{ selectedFontLabel }}</span>
              <v-icon size="24">mdi-menu-down</v-icon>
            </v-btn>
          </template>
          <div class="font-menu" role="listbox">
            <list
              class="rte-dropdown-list font-list"
              :items="fontListItems"
              :value="selectedFont"
              :max-height="240"
              @update:value="selectFont"
            />
          </div>
        </v-menu>
      </div>

      <div v-for="group in visibleIconButtonGroups" :key="group.key" class="toolbar-group">
        <button
          v-for="button in group.buttons"
          :key="button.key"
          type="button"
          class="toolbar-btn"
          :class="{ active: formatState[button.command] }"
          :disabled="isDisabled"
          :aria-label="button.ariaLabel"
          @click="runCommand(button.command)"
        >
          <v-icon :size="toolbarIconSize">{{ button.icon }}</v-icon>
        </button>
      </div>

      <div v-if="hasFormat('color') || hasFormat('background')" class="toolbar-group">
        <button
          v-if="hasFormat('color')"
          type="button"
          class="toolbar-btn toolbar-color-btn"
          :disabled="isDisabled"
          aria-label="Text color"
          @click="openColorPicker('text')"
        >
          <v-icon :size="toolbarIconSize">mdi-format-color-text</v-icon>
          <input
            ref="textColorInputRef"
            type="color"
            :disabled="isDisabled"
            tabindex="-1"
            aria-hidden="true"
            @input="applyColor($event.target.value, 'foreColor')"
          />
        </button>
        <button
          v-if="hasFormat('background')"
          type="button"
          class="toolbar-btn toolbar-color-btn"
          :disabled="isDisabled"
          aria-label="Background color"
          @click="openColorPicker('background')"
        >
          <v-icon :size="toolbarIconSize">mdi-format-color-highlight</v-icon>
          <input
            ref="backgroundColorInputRef"
            type="color"
            :disabled="isDisabled"
            tabindex="-1"
            aria-hidden="true"
            @input="applyColor($event.target.value, 'hiliteColor')"
          />
        </button>
      </div>

      <div class="toolbar-group toolbar-group--final">
        <button v-if="hasFormat('image')" type="button" class="toolbar-btn" :disabled="isDisabled" aria-label="Image" @click="insertImage">
          <v-icon :size="toolbarIconSize">mdi-image-outline</v-icon>
        </button>
        <input
          ref="imageInputRef"
          class="toolbar-file-input"
          type="file"
          accept="image/*"
          tabindex="-1"
          aria-hidden="true"
          @change="onImageFileSelected"
        />
      </div>
    </div>

    <div class="rich-text-editor-surface">
      <div
        ref="editorRef"
        class="rich-text-editor-content"
        :class="{ empty: !value }"
        :style="editorStyle"
        :contenteditable="!isDisabled"
        :data-placeholder="normalizedPlaceholder"
        :aria-label="ariaLabel || undefined"
        :aria-invalid="ariaInvalid ? 'true' : undefined"
        :aria-required="ariaRequired ? 'true' : undefined"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
      ></div>
    </div>

    <div v-if="$slots.details || showHint" class="rich-text-editor-details">
      <slot name="details" :hint="normalizedHint">
        <span v-if="showHint" class="rich-text-editor-hint">{{ normalizedHint }}</span>
      </slot>
    </div>
  </div>
</template>

<script>
import {
  RICH_TEXT_EDITOR_DEFAULT_FORMATS,
  RICH_TEXT_EDITOR_DEFAULT_HINT,
  RICH_TEXT_EDITOR_DEFAULT_PLACEHOLDER,
  RICH_TEXT_EDITOR_DEFAULT_VALUE,
  useRichTextEditor,
} from '../composables/useRichTextEditor';
import List from './List.vue';

const TOOLBAR_ICON_SIZE = 24;
const TEXT_FORMAT_BUTTONS = Object.freeze([
  { key: 'bold', command: 'bold', label: 'B', ariaLabel: 'Bold' },
  { key: 'italic', command: 'italic', label: 'I', ariaLabel: 'Italic' },
  { key: 'underline', command: 'underline', label: 'U', ariaLabel: 'Underline' },
  { key: 'strike', command: 'strikeThrough', label: 'S', ariaLabel: 'Strike' },
]);
const LIST_BUTTONS = Object.freeze([
  { key: 'ordered', command: 'insertOrderedList', icon: 'mdi-format-list-numbered', ariaLabel: 'Ordered list' },
  { key: 'bullet', command: 'insertUnorderedList', icon: 'mdi-format-list-bulleted', ariaLabel: 'Bullet list' },
]);
const ALIGN_BUTTONS = Object.freeze([
  { key: 'left', command: 'justifyLeft', icon: 'mdi-format-align-left', ariaLabel: 'Align left' },
  { key: 'center', command: 'justifyCenter', icon: 'mdi-format-align-center', ariaLabel: 'Align center' },
  { key: 'right', command: 'justifyRight', icon: 'mdi-format-align-right', ariaLabel: 'Align right' },
  { key: 'justify', command: 'justifyFull', icon: 'mdi-format-align-justify', ariaLabel: 'Justify' },
]);
const ICON_BUTTON_GROUPS = Object.freeze([
  { key: 'list', format: 'list', buttons: LIST_BUTTONS },
  { key: 'align', format: 'align', buttons: ALIGN_BUTTONS },
]);
const HEADING_LIST_ITEMS = Object.freeze([
  { value: '1', label: 'Heading 1' },
  { value: '2', label: 'Heading 2' },
  { value: '3', label: 'Heading 3' },
  { value: '4', label: 'Heading 4' },
  { value: '5', label: 'Heading 5' },
  { value: '6', label: 'Heading 6' },
  { value: 'paragraph', label: 'Normal' },
]);
const FONT_LIST_ITEMS = Object.freeze([
  { value: 'sans-serif', label: 'Sans Serif' },
  { value: 'Quicksand', label: 'Quicksand' },
  { value: 'serif', label: 'Serif' },
  { value: 'monospace', label: 'Monospace' },
]);

export default {
  name: 'rich-text-editor',
  components: { List },
  emits: ['update:value'],
  props: {
    value: {
      type: String,
      default: RICH_TEXT_EDITOR_DEFAULT_VALUE,
    },
    placeholder: {
      type: String,
      default: RICH_TEXT_EDITOR_DEFAULT_PLACEHOLDER,
    },
    hint: {
      type: String,
      default: RICH_TEXT_EDITOR_DEFAULT_HINT,
    },
    minHeight: {
      type: Number,
      default: 160,
    },
    maxHeight: {
      type: Number,
      default: null,
    },
    formats: {
      type: Array,
      default: () => [...RICH_TEXT_EDITOR_DEFAULT_FORMATS, 'history'],
    },
    modules: {
      type: Object,
      default: () => ({
        toolbar: true,
        history: true,
      }),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
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
  setup(props, { emit }) {
    return {
      ...useRichTextEditor(props, emit),
      toolbarIconSize: TOOLBAR_ICON_SIZE,
      headingListItems: HEADING_LIST_ITEMS,
      fontListItems: FONT_LIST_ITEMS,
      iconButtonGroups: ICON_BUTTON_GROUPS,
    };
  },
  computed: {
    selectedHeadingLabel() {
      return this.findLabel(HEADING_LIST_ITEMS, this.selectedHeading, 'Normal');
    },
    selectedFontLabel() {
      return this.findLabel(FONT_LIST_ITEMS, this.selectedFont, 'Sans Serif');
    },
    visibleTextFormatButtons() {
      return TEXT_FORMAT_BUTTONS.filter((button) => this.hasFormat(button.key));
    },
    visibleIconButtonGroups() {
      return this.iconButtonGroups.filter((group) => this.hasFormat(group.format));
    },
  },
  methods: {
    findLabel(items, value, fallback) {
      return items.find((item) => item.value === value)?.label ?? fallback;
    },
  },
};
</script>

<style scoped>
.rich-text-editor-shell {
  background: var(--black-04, rgba(0, 0, 0, 0.04));
  border: var(--border-sm) solid rgba(0, 0, 0, 0.2);
  border-radius: var(--rounded-md) var(--rounded-md) 0 0;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.38);
  display: inline-flex;
  flex-direction: column;
  position: relative;
  transition: box-shadow 120ms ease;
  width: 100%;
}

.rich-text-editor-toolbar {
  align-items: center;
  background: transparent;
  border-bottom: var(--border-sm) solid rgba(0, 0, 0, 0.24);
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-content: flex-start;
  overflow: visible;
  padding: 8px 10px 4px;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
  white-space: normal;
}

.toolbar-group {
  align-items: center;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 4px;
  min-height: 28px;
  padding-right: 4px;
}

.toolbar-group:last-child {
  padding-right: 0;
}

.toolbar-btn,
.toolbar-select {
  background: transparent;
  border: 0;
  border-radius: var(--base-2);
  color: rgba(0, 0, 0, 0.72);
  cursor: pointer;
  min-height: 24px;
  min-width: 24px;
}

.toolbar-btn {
  align-items: center;
  display: inline-flex;
  justify-content: center;
}

.toolbar-select {
  border: 0;
  color: var(--black-87, rgba(0, 0, 0, 0.87));
  font-size: var(--label-base-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--label-base-lh);
  min-width: 96px;
  padding: 0 6px;
  width: auto;
}

.toolbar-select.v-btn {
  height: 24px;
  letter-spacing: normal;
  min-width: 96px;
  padding: 0 6px !important;
  text-transform: none;
}

.toolbar-select.v-btn :deep(.v-btn__overlay),
.toolbar-select.v-btn :deep(.v-ripple__container) {
  display: none;
}

.heading-trigger,
.font-trigger {
  align-items: center;
  display: inline-flex;
  justify-content: space-between;
}

.heading-trigger {
  min-width: 112px;
}

.heading-menu,
.font-menu {
  padding-top: 2px;
}

.font-trigger {
  min-width: 120px;
}

.rte-dropdown-list {
  --list-width: 260px;
  --list-item-title-size: var(--label-base-size);
  --list-item-title-lh: var(--label-base-lh);
}

.heading-list {
  --list-width: 332px;
  max-width: calc(100vw - 32px);
}

.heading-option-label {
  display: block;
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.heading-option-1 {
  font-size: 58px;
  line-height: 1.2;
}

.heading-option-2 {
  font-size: 44px;
  line-height: 1.2;
}

.heading-option-3 {
  font-size: 34px;
  line-height: 1.25;
}

.heading-option-4 {
  font-size: 28px;
  line-height: 1.3;
}

.heading-option-5 {
  font-size: 22px;
  line-height: 1.35;
}

.heading-option-6 {
  font-size: 16px;
  line-height: 1.4;
}

.heading-option-normal {
  font-size: 22px;
  line-height: 1.35;
}

.toolbar-btn--text {
  font-size: var(--display-emphasis-size);
  line-height: 1;
}

.toolbar-btn--bold {
  font-weight: var(--font-weight-bold);
}

.toolbar-btn--italic {
  font-style: italic;
  font-weight: var(--font-weight-semibold);
}

.toolbar-btn--underline {
  text-decoration: underline;
}

.toolbar-btn--strike {
  text-decoration: line-through;
}

.toolbar-btn:hover,
.toolbar-select:hover {
  background: transparent;
  color: var(--primary, #005a9c);
}

.toolbar-btn.active {
  color: var(--primary, #005a9c);
  background: transparent;
}

.toolbar-btn:focus-visible,
.toolbar-select:focus-visible {
  color: var(--primary, #005a9c);
  outline: var(--border-sm) solid rgba(0, 90, 156, 0.24);
  outline-offset: 1px;
}

.toolbar-btn:disabled,
.toolbar-select:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.toolbar-color-btn {
  align-items: center;
  color: rgba(0, 0, 0, 0.72);
  display: inline-flex;
  min-height: var(--base-34);
  min-width: var(--base-34);
  position: relative;
}

.toolbar-color-btn input {
  border: 0;
  bottom: 0;
  cursor: pointer;
  height: 100%;
  left: 0;
  opacity: 0;
  position: absolute;
  width: 100%;
}

.toolbar-file-input {
  display: none;
}

.toolbar-color-btn:hover,
.toolbar-color-btn:focus-visible {
  color: var(--primary, #005a9c);
}

.toolbar-btn :deep(.v-icon),
.toolbar-color-btn :deep(.v-icon) {
  color: currentColor;
}

.rich-text-editor-surface {
  background: transparent;
  border-bottom: 0;
  border-radius: 0;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;
  width: 100%;
}

.rich-text-editor-content {
  color: var(--black-87, rgba(0, 0, 0, 0.87));
  font-size: var(--display-sm-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-base-lh);
  overflow-y: auto;
  padding: var(--base-20) var(--base-16);
}

.rich-text-editor-content:focus {
  outline: none;
}

.rich-text-editor-shell.is-focused .rich-text-editor-toolbar {
  background: transparent;
  border-bottom-color: rgba(0, 0, 0, 0.24);
}

.rich-text-editor-shell.is-focused .rich-text-editor-surface {
  background: transparent;
  border-bottom-color: transparent;
}

.rich-text-editor-content.empty::before {
  color: var(--black-60, rgba(0, 0, 0, 0.6));
  content: attr(data-placeholder);
  font-size: var(--display-sm-size);
  font-style: italic;
  pointer-events: none;
}

.rich-text-editor-content :deep(h1),
.rich-text-editor-content :deep(h2),
.rich-text-editor-content :deep(h3),
.rich-text-editor-content :deep(p),
.rich-text-editor-content :deep(pre),
.rich-text-editor-content :deep(blockquote) {
  margin: 0 0 var(--base-8);
}

.rich-text-editor-content :deep(blockquote) {
  border-left: var(--base-4) solid var(--primary, #005a9c);
  padding-left: var(--base-8);
}

.rich-text-editor-content :deep(pre) {
  background: rgba(0, 0, 0, 0.06);
  border-radius: var(--base-4);
  padding: var(--base-8);
}

.rich-text-editor-content :deep(a) {
  color: var(--primary, #005a9c);
  text-decoration: underline;
}

.rich-text-editor-shell.disabled .rich-text-editor-toolbar,
.rich-text-editor-shell.disabled .rich-text-editor-surface,
.rich-text-editor-shell.readonly .rich-text-editor-toolbar,
.rich-text-editor-shell.readonly .rich-text-editor-surface {
  background: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.45);
}

.rich-text-editor-shell.disabled .rich-text-editor-content,
.rich-text-editor-shell.readonly .rich-text-editor-content {
  cursor: not-allowed;
  opacity: 0.8;
}

.rich-text-editor-details {
  min-height: var(--base-16);
  padding-top: var(--base-4);
}

.rich-text-editor-hint {
  color: var(--black-60, rgba(0, 0, 0, 0.6));
  font-size: var(--body-xs-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--body-xs-lh);
}

.rich-text-editor-shell.is-focused {
  box-shadow: inset 0 -2px 0 var(--primary, #005a9c);
}

@media (max-width: 1200px) {
  .heading-trigger {
    min-width: 96px;
  }

  .font-trigger {
    min-width: 104px;
  }
}
</style>
