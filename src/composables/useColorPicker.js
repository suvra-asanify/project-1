import { computed, ref, watch } from 'vue';
import { clamp, normalizeText } from '../shared/sharedHelpers';
import { toIconConfig } from '../shared/iconHelpers';

export const COLOR_PICKER_STATES = Object.freeze(['default', 'hover', 'pressed']);

export const COLOR_PICKER_DEFAULT_PLACEHOLDER = 'Enter or Pick Color';
export const COLOR_PICKER_DEFAULT_VALUE = '';
export const COLOR_PICKER_DEFAULT_HINT = '';

function normalizeState(value) {
  const normalized = normalizeText(value, 'default').trim();
  if (COLOR_PICKER_STATES.includes(normalized)) return normalized;
  return 'default';
}

function round(value, precision = 0) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function hexToRgb(input) {
  const token = normalizeText(input, '').trim().replace('#', '');
  if (!token) return null;

  let hex = token;
  if (![3, 4, 6, 8].includes(hex.length)) return null;

  if (hex.length === 3 || hex.length === 4) {
    hex = hex.split('').map((ch) => `${ch}${ch}`).join('');
  }

  const value = Number.parseInt(hex, 16);
  if (!Number.isFinite(value)) return null;

  if (hex.length === 6) {
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255,
      a: 1,
    };
  }

  return {
    r: (value >> 24) & 255,
    g: (value >> 16) & 255,
    b: (value >> 8) & 255,
    a: round((value & 255) / 255, 2),
  };
}

function rgbToHex({ r, g, b }, alpha = 1, includeAlpha = false) {
  const toHex = (value) => Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0').toUpperCase();
  const base = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  if (!includeAlpha) return base;
  return `${base}${toHex(alpha * 255)}`;
}

function rgbToHsl({ r, g, b }) {
  const rr = clamp(r, 0, 255) / 255;
  const gg = clamp(g, 0, 255) / 255;
  const bb = clamp(b, 0, 255) / 255;

  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rr) h = ((gg - bb) / delta) % 6;
    else if (max === gg) h = (bb - rr) / delta + 2;
    else h = (rr - gg) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs((2 * l) - 1));

  return {
    h: round(h),
    s: round(s * 100),
    l: round(l * 100),
  };
}

function hslToRgb({ h, s, l }) {
  const hh = ((Number(h) % 360) + 360) % 360;
  const ss = clamp(Number(s), 0, 100) / 100;
  const ll = clamp(Number(l), 0, 100) / 100;

  const chroma = (1 - Math.abs((2 * ll) - 1)) * ss;
  const x = chroma * (1 - Math.abs(((hh / 60) % 2) - 1));
  const match = ll - (chroma / 2);

  let rr = 0;
  let gg = 0;
  let bb = 0;

  if (hh < 60) {
    rr = chroma;
    gg = x;
  } else if (hh < 120) {
    rr = x;
    gg = chroma;
  } else if (hh < 180) {
    gg = chroma;
    bb = x;
  } else if (hh < 240) {
    gg = x;
    bb = chroma;
  } else if (hh < 300) {
    rr = x;
    bb = chroma;
  } else {
    rr = chroma;
    bb = x;
  }

  return {
    r: round((rr + match) * 255),
    g: round((gg + match) * 255),
    b: round((bb + match) * 255),
  };
}

function rgbToHsv({ r, g, b }) {
  const rr = clamp(r, 0, 255) / 255;
  const gg = clamp(g, 0, 255) / 255;
  const bb = clamp(b, 0, 255) / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rr) h = ((gg - bb) / delta) % 6;
    else if (max === gg) h = (bb - rr) / delta + 2;
    else h = (rr - gg) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return {
    h: round(h),
    s: round(s * 100),
    v: round(v * 100),
  };
}

function hsvToRgb({ h, s, v }) {
  const hh = ((Number(h) % 360) + 360) % 360;
  const ss = clamp(Number(s), 0, 100) / 100;
  const vv = clamp(Number(v), 0, 100) / 100;
  const chroma = vv * ss;
  const x = chroma * (1 - Math.abs(((hh / 60) % 2) - 1));
  const match = vv - chroma;

  let rr = 0;
  let gg = 0;
  let bb = 0;

  if (hh < 60) {
    rr = chroma;
    gg = x;
  } else if (hh < 120) {
    rr = x;
    gg = chroma;
  } else if (hh < 180) {
    gg = chroma;
    bb = x;
  } else if (hh < 240) {
    gg = x;
    bb = chroma;
  } else if (hh < 300) {
    rr = x;
    bb = chroma;
  } else {
    rr = chroma;
    bb = x;
  }

  return {
    r: round((rr + match) * 255),
    g: round((gg + match) * 255),
    b: round((bb + match) * 255),
  };
}

function toRgbaString({ r, g, b }, alpha = 1) {
  return `rgba(${Math.round(clamp(r, 0, 255))}, ${Math.round(clamp(g, 0, 255))}, ${Math.round(clamp(b, 0, 255))}, ${clamp(alpha, 0, 1)})`;
}

export function useColorPicker(props, emit) {
  const canvasRef = ref(null);
  const internalValue = ref(COLOR_PICKER_DEFAULT_VALUE);
  const menuOpen = ref(false);
  const hoverActive = ref(false);

  const hue = ref(0);
  const saturation = ref(0);
  const lightness = ref(100);
  const alpha = ref(1);
  const valueSaturation = ref(0);
  const valueBrightness = ref(100);

  function syncChannelsFromString(nextValue) {
    const parsed = hexToRgb(nextValue);
    if (!parsed) {
      return;
    }

    const hsl = rgbToHsl(parsed);
    const hsv = rgbToHsv(parsed);

    hue.value = hsl.h;
    saturation.value = hsl.s;
    lightness.value = hsl.l;
    alpha.value = round(parsed.a, 2);
    valueSaturation.value = hsv.s;
    valueBrightness.value = hsv.v;
  }

  watch(() => props.value, (nextValue) => {
    const normalized = normalizeText(nextValue, COLOR_PICKER_DEFAULT_VALUE).trim();
    internalValue.value = normalized;
    syncChannelsFromString(normalized);
  }, { immediate: true });

  const normalizedState = computed(() => normalizeState(props.state));
  const normalizedPlaceholder = computed(() =>
    normalizeText(props.placeholder, COLOR_PICKER_DEFAULT_PLACEHOLDER)
  );
  const normalizedHint = computed(() => normalizeText(props.hint, COLOR_PICKER_DEFAULT_HINT));
  const iconConfig = computed(() => toIconConfig(normalizeText(props.icon, 'mdi-plus').trim() || 'mdi-plus'));
  const showLeadingIcon = computed(() => props.hasIcon === true && iconConfig.value.type !== 'none');
  const showHint = computed(() => props.hasHint === true && normalizedHint.value.trim().length > 0);

  const menuValue = computed({
    get() {
      return props.disabled ? false : (normalizedState.value === 'pressed' || menuOpen.value);
    },
    set(nextValue) {
      if (props.disabled) return;
      menuOpen.value = nextValue === true;
      emit('update:menu', menuOpen.value);
    },
  });

  const hasSelection = computed(() => internalValue.value.trim().length > 0);

  const inputValue = computed({
    get() {
      return internalValue.value;
    },
    set(nextValue) {
      const normalized = String(nextValue ?? '').trim();
      internalValue.value = normalized;
      syncChannelsFromString(normalized);
      emit('update:value', normalized);
    },
  });

  const currentRgb = computed(() => hslToRgb({ h: hue.value, s: saturation.value, l: lightness.value }));

  const previewColor = computed(() => toRgbaString(currentRgb.value, alpha.value));

  const effectiveValue = computed(() => {
    const parsed = hexToRgb(internalValue.value);
    if (parsed) {
      return rgbToHex(parsed, parsed.a, parsed.a < 1);
    }
    return rgbToHex(currentRgb.value, alpha.value, alpha.value < 1);
  });

  const effectiveState = computed(() => {
    if (props.disabled) return 'default';
    if (normalizedState.value !== 'default') return normalizedState.value;
    if (menuValue.value) return 'pressed';
    if (hoverActive.value) return 'hover';
    return 'default';
  });

  const rootClasses = computed(() => [
    `state-${effectiveState.value}`,
    props.disabled && 'disabled',
    showLeadingIcon.value && 'has-leading-icon',
    showHint.value && 'has-hint',
    hasSelection.value && 'has-selection',
  ].filter(Boolean));

  const hueTrackStyle = computed(() => ({
    background: 'linear-gradient(90deg, #f00 0%, #ff0 16.66%, #0f0 33.33%, #0ff 50%, #00f 66.66%, #f0f 83.33%, #f00 100%)',
  }));

  const alphaTrackOverlayStyle = computed(() => {
    const rgb = currentRgb.value;
    return {
      background: `linear-gradient(90deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1) 100%)`,
    };
  });

  const canvasStyle = computed(() => ({
    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgb(0,0,0) 100%), linear-gradient(90deg, rgb(255,255,255) 0%, hsl(${hue.value}, 100%, 50%) 100%)`,
  }));

  const dotStyle = computed(() => ({
    left: `${clamp(valueSaturation.value, 0, 100)}%`,
    top: `${100 - clamp(valueBrightness.value, 0, 100)}%`,
  }));

  const hslFields = computed(() => [
    { key: 'h', label: 'H', value: Math.round(hue.value) },
    { key: 's', label: 'S', value: Math.round(saturation.value) },
    { key: 'l', label: 'L', value: Math.round(lightness.value) },
    { key: 'a', label: 'A', value: Math.round(alpha.value * 100) },
  ]);

  function syncStringFromChannels() {
    const hex = rgbToHex(currentRgb.value, alpha.value, alpha.value < 1);
    internalValue.value = hex;
    emit('update:value', hex);
  }

  function updateFromCanvasEvent(event) {
    const target = canvasRef.value;
    if (!target) return;
    const rect = target.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const nextX = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    const nextY = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);

    valueSaturation.value = round(nextX);
    valueBrightness.value = round(100 - nextY);

    const nextRgb = hsvToRgb({
      h: hue.value,
      s: valueSaturation.value,
      v: valueBrightness.value,
    });
    const nextHsl = rgbToHsl(nextRgb);
    saturation.value = nextHsl.s;
    lightness.value = nextHsl.l;
    syncStringFromChannels();
  }

  function onCanvasPointerDown(event) {
    updateFromCanvasEvent(event);

    const handleMove = (moveEvent) => updateFromCanvasEvent(moveEvent);
    const stop = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', stop);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', stop);
  }

  function onHueChange(nextHue) {
    hue.value = round(clamp(Number(nextHue), 0, 360));

    const nextRgb = hsvToRgb({
      h: hue.value,
      s: valueSaturation.value,
      v: valueBrightness.value,
    });
    const nextHsl = rgbToHsl(nextRgb);

    saturation.value = nextHsl.s;
    lightness.value = nextHsl.l;
    syncStringFromChannels();
  }

  function onAlphaChange(nextAlpha) {
    alpha.value = round(clamp(Number(nextAlpha), 0, 1), 2);
    syncStringFromChannels();
  }

  function onFieldChannelInput(channel, rawValue) {
    const numericValue = Number(rawValue);
    if (!Number.isFinite(numericValue)) return;

    if (channel === 'h') hue.value = round(clamp(numericValue, 0, 360));
    if (channel === 's') saturation.value = round(clamp(numericValue, 0, 100));
    if (channel === 'l') lightness.value = round(clamp(numericValue, 0, 100));
    if (channel === 'a') alpha.value = round(clamp(numericValue, 0, 100) / 100, 2);

    const rgb = hslToRgb({ h: hue.value, s: saturation.value, l: lightness.value });
    const hsv = rgbToHsv(rgb);
    valueSaturation.value = hsv.s;
    valueBrightness.value = hsv.v;

    syncStringFromChannels();
  }

  function setHoverState(nextValue) {
    if (props.disabled || normalizedState.value !== 'default') return;
    hoverActive.value = nextValue === true;
  }

  function toggleMenu() {
    if (props.disabled || normalizedState.value === 'pressed') return;
    menuValue.value = !menuValue.value;
  }

  function closeMenu() {
    if (normalizedState.value === 'pressed') return;
    menuValue.value = false;
  }

  return {
    canvasRef,
    menuValue,
    normalizedPlaceholder,
    normalizedHint,
    iconConfig,
    showLeadingIcon,
    showHint,
    rootClasses,
    hasSelection,
    inputValue,
    effectiveValue,
    previewColor,
    hue,
    alpha,
    hslFields,
    hueTrackStyle,
    alphaTrackOverlayStyle,
    canvasStyle,
    dotStyle,
    onCanvasPointerDown,
    onHueChange,
    onAlphaChange,
    onFieldChannelInput,
    setHoverState,
    toggleMenu,
    closeMenu,
  };
}
