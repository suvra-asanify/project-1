import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { normalizePositiveInteger, normalizeText } from '../shared/sharedHelpers';

export const RICH_TEXT_EDITOR_DEFAULT_VALUE = '';
export const RICH_TEXT_EDITOR_DEFAULT_PLACEHOLDER = 'Compose an epic...';
export const RICH_TEXT_EDITOR_DEFAULT_HINT = '';
export const RICH_TEXT_EDITOR_DEFAULT_FORMATS = Object.freeze([
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'script',
  'blockquote',
  'code-block',
  'list',
  'indent',
  'align',
  'direction',
  'color',
  'background',
  'link',
  'image',
  'video',
  'formula',
  'clean',
]);

function normalizeModules(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return { toolbar: true, history: true };
  }

  return {
    toolbar: value.toolbar !== false,
    history: value.history !== false,
  };
}

function toSafeHtml(value) {
  const html = normalizeText(value, '');
  return (html === '<p><br></p>' || html === '<br>' || !html.trim()) ? '' : html;
}

export function useRichTextEditor(props, emit) {
  const editorRef = ref(null);
  const imageInputRef = ref(null);
  const textColorInputRef = ref(null);
  const backgroundColorInputRef = ref(null);
  const isFocused = ref(false);
  const headingMenuOpen = ref(false);
  const fontMenuOpen = ref(false);
  const selectedHeading = ref('paragraph');
  const selectedFont = ref('sans-serif');
  const formatState = ref({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    subscript: false,
    superscript: false,
    justifyLeft: true,
    justifyCenter: false,
    justifyRight: false,
    justifyFull: false,
  });

  const normalizedPlaceholder = computed(() =>
    normalizeText(props.placeholder, RICH_TEXT_EDITOR_DEFAULT_PLACEHOLDER)
  );
  const normalizedHint = computed(() =>
    normalizeText(props.hint, RICH_TEXT_EDITOR_DEFAULT_HINT).trim()
  );
  const normalizedFormats = computed(() => {
    if (!Array.isArray(props.formats) || props.formats.length === 0) {
      return [...RICH_TEXT_EDITOR_DEFAULT_FORMATS];
    }
    return props.formats.map((entry) => String(entry).trim()).filter(Boolean);
  });
  const normalizedModules = computed(() => normalizeModules(props.modules));

  const showHint = computed(() => normalizedHint.value.length > 0);
  const showToolbar = computed(() => normalizedModules.value.toolbar && props.readonly !== true);
  const minHeight = computed(() => normalizePositiveInteger(props.minHeight, 160));
  const maxHeight = computed(() => normalizePositiveInteger(props.maxHeight, null));

  const rootClasses = computed(() => [
    props.disabled && 'disabled',
    props.readonly && 'readonly',
    isFocused.value && 'is-focused',
    showHint.value && 'has-hint',
  ].filter(Boolean));

  function hasFormat(format) {
    return normalizedFormats.value.includes(format);
  }

  function setEditorHtml(nextHtml) {
    const editor = editorRef.value;
    if (!editor) return;
    if (editor.innerHTML !== nextHtml) {
      editor.innerHTML = nextHtml;
    }
  }

  function emitValue() {
    const editor = editorRef.value;
    if (!editor) return;
    emit('update:value', toSafeHtml(editor.innerHTML));
  }

  function refreshFormatState() {
    const editor = editorRef.value;
    if (!editor?.contains(document.activeElement)) return;

    const justifyLeft = document.queryCommandState('justifyLeft');
    const justifyCenter = document.queryCommandState('justifyCenter');
    const justifyRight = document.queryCommandState('justifyRight');
    const justifyFull = document.queryCommandState('justifyFull');
    const hasExplicitAlignment = justifyLeft || justifyCenter || justifyRight || justifyFull;

    formatState.value = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      strikeThrough: document.queryCommandState('strikeThrough'),
      subscript: document.queryCommandState('subscript'),
      superscript: document.queryCommandState('superscript'),
      justifyLeft: hasExplicitAlignment ? justifyLeft : true,
      justifyCenter,
      justifyRight,
      justifyFull,
    };
  }

  function focusEditor() {
    const editor = editorRef.value;
    if (!editor || props.disabled || props.readonly) return;
    editor.focus();
  }

  function runCommand(command, value = null) {
    if (props.disabled || props.readonly) return;
    if (!command) return;
    focusEditor();
    document.execCommand(command, false, value);
    emitValue();
    refreshFormatState();
  }

  function selectHeading(level) {
    selectedHeading.value = level === 'paragraph' ? 'paragraph' : String(level);
    runCommand('formatBlock', level === 'paragraph' ? 'P' : `H${level}`);
    headingMenuOpen.value = false;
  }

  function selectFont(font) {
    selectedFont.value = String(font || 'sans-serif');
    runCommand('fontName', font);
    fontMenuOpen.value = false;
  }

  function applyColor(color, commandName) {
    const normalized = String(color || '').trim();
    if (!normalized) return;
    runCommand(commandName, normalized);
  }

  function openColorPicker(kind) {
    if (props.disabled || props.readonly) return;
    if (kind === 'background') {
      backgroundColorInputRef.value?.click();
      return;
    }
    textColorInputRef.value?.click();
  }

  function insertLink() {
    const url = prompt('Enter URL');
    if (!url) return;
    runCommand('createLink', url);
  }

  function insertImage() {
    if (props.disabled || props.readonly) return;
    imageInputRef.value?.click();
  }

  function onImageFileSelected(event) {
    if (props.disabled || props.readonly) return;
    const input = event?.target;
    const file = input?.files?.[0];
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const source = String(reader.result || '');
      if (!source) return;
      runCommand('insertImage', source);
      if (input) input.value = '';
    };
    reader.onerror = () => {
      if (input) input.value = '';
    };
    reader.readAsDataURL(file);
  }

  function onInput() {
    emitValue();
    refreshFormatState();
  }

  function onFocus() {
    isFocused.value = true;
    refreshFormatState();
  }

  function onBlur() {
    isFocused.value = false;
    headingMenuOpen.value = false;
    fontMenuOpen.value = false;
  }

  onMounted(() => {
    setEditorHtml(toSafeHtml(props.value));
    document.addEventListener('selectionchange', refreshFormatState);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('selectionchange', refreshFormatState);
  });

  watch(() => props.value, (nextValue) => {
    const normalized = toSafeHtml(nextValue);
    setEditorHtml(normalized);
  }, { immediate: true });

  const isDisabled = computed(() => props.disabled || props.readonly);
  const editorStyle = computed(() => ({
    minHeight: `${minHeight.value}px`,
    maxHeight: maxHeight.value ? `${maxHeight.value}px` : undefined,
  }));

  return {
    editorRef,
    imageInputRef,
    textColorInputRef,
    backgroundColorInputRef,
    formatState,
    headingMenuOpen,
    fontMenuOpen,
    selectedHeading,
    selectedFont,
    normalizedPlaceholder,
    normalizedHint,
    showHint,
    showToolbar,
    rootClasses,
    isDisabled,
    editorStyle,
    hasFormat,
    runCommand,
    selectHeading,
    selectFont,
    applyColor,
    openColorPicker,
    insertLink,
    insertImage,
    onImageFileSelected,
    onInput,
    onFocus,
    onBlur,
  };
}
