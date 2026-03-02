// ── Design system tokens ────────────────────────────────────────
// JS representation of all design tokens.
// Usage: import { fontWeight, display, body, label } from 'your-package-name'

// ── Font weights ────────────────────────────────────────────────
export const fontWeight = {
  regular:  400,
  medium:   500,
  semibold: 600,
  bold:     700,
}

// ── Typography ──────────────────────────────────────────────────
export const display = {
  hero: {
    fontSize:   '48px',
    lineHeight: '108.33%',
    fontWeight: fontWeight.semibold,
  },
  title: {
    fontSize:   '34px',
    lineHeight: '117.65%',
    fontWeight: fontWeight.semibold,
  },
  section: {
    fontSize:   '20px',
    lineHeight: '140%',
    fontWeight: fontWeight.semibold,
  },
  emphasis: {
    fontSize:   '18px',
    lineHeight: '155.56%',
    fontWeight: fontWeight.semibold,
  },
}

export const body = {
  lg: {
    fontSize:   '18px',
    lineHeight: '155.56%',
    fontWeight: fontWeight.medium,
  },
  base: {
    fontSize:   '16px',
    lineHeight: '150%',
    fontWeight: fontWeight.medium,
  },
  sm: {
    fontSize:   '14px',
    lineHeight: '142.86%',
    fontWeight: fontWeight.medium,
  },
  xs: {
    fontSize:   '12px',
    lineHeight: '133.33%',
    fontWeight: fontWeight.medium,
  },
}

export const label = {
  lg: {
    fontSize:   '18px',
    lineHeight: '155.56%',
    fontWeight: fontWeight.semibold,
  },
  base: {
    fontSize:   '16px',
    lineHeight: '150%',
    fontWeight: fontWeight.semibold,
  },
  sm: {
    fontSize:   '14px',
    lineHeight: '142.86%',
    fontWeight: fontWeight.semibold,
  },
  xs: {
    fontSize:   '12px',
    lineHeight: '133.33%',
    fontWeight: fontWeight.semibold,
  },
}

// ── Default export (all tokens) ─────────────────────────────────
export default {
  fontWeight,
  display,
  body,
  label,
}
