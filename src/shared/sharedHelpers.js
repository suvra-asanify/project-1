export function normalizeText(value, fallback = '') {
  return typeof value === 'string' ? value : fallback;
}

export function normalizePositiveInteger(value, fallback = 1) {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function clampTextByLimit(value, maxlength) {
  if (!maxlength) return value;
  return value.slice(0, maxlength);
}

export function areValuesEqual(left, right) {
  return String(left) === String(right);
}

// Extracts ListItem-compatible props from a raw item object.
// Handles items that carry a nested `props` key (e.g. from ComboBox slot items).
// `fallbackLabel` is used when no label field is present on the raw item.
export function extractListItemProps(rawItem, fallbackLabel = '') {
  if (!rawItem || typeof rawItem !== 'object' || Array.isArray(rawItem)) {
    return { label: fallbackLabel };
  }

  const nestedProps = rawItem.props && typeof rawItem.props === 'object'
    ? rawItem.props
    : {};

  const label = normalizeText(
    nestedProps.label ?? rawItem.label ?? rawItem.title ?? rawItem.text,
    fallbackLabel
  ).trim() || fallbackLabel;

  const disabled = nestedProps.disabled !== undefined
    ? nestedProps.disabled
    : rawItem.disabled;

  return {
    label,
    size: nestedProps.size ?? rawItem.size,
    checkbox: nestedProps.checkbox ?? rawItem.checkbox,
    avatar: nestedProps.avatar ?? rawItem.avatar,
    prependIcon: nestedProps.prependIcon ?? rawItem.prependIcon,
    appendIcon: nestedProps.appendIcon ?? rawItem.appendIcon,
    subtext: nestedProps.subtext ?? rawItem.subtext,
    appendText: nestedProps.appendText ?? rawItem.appendText,
    disabled: disabled === true,
  };
}
