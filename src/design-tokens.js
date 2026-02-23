// Design tokens derived from Figma variables.
// These are primitives and semantic aliases only – no components.

export const typography = {
  family: '"Quicksand", sans-serif',
  weights: {
    regular: 400, // weight/Regular
    medium: 500, // weight/Medium
    semiBold: 600, // weight/SemiBold
    bold: 700, // weight/Bold
  },
  scale: {
    xs: { fontSize: 12, lineHeight: 16 }, // xs/size, xs/line-height
    sm: { fontSize: 14, lineHeight: 20 }, // sm/size, sm/line-height
    base: { fontSize: 16, lineHeight: 24 }, // base/size, base/line-height
    xl: { fontSize: 20, lineHeight: 28 }, // xl/size, xl/line-height
    '2xl': { fontSize: 34, lineHeight: 40 }, // 2xl/size, 2xl/line-height
    '3xl': { fontSize: 48, lineHeight: 52 }, // 3xl/size, 3xl/line-height
  },
  textStyles: {
    bodyBase: {
      // body/base
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 500,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
    },
    bodySm: {
      // body/sm
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 500,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
    },
    bodyXs: {
      // body/xs
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 500,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0,
    },
    labelBase: {
      // label/base
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 600,
      fontSize: 16,
      lineHeight: 24,
      letterSpacing: 0,
    },
    labelSm: {
      // label/sm
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 600,
      fontSize: 14,
      lineHeight: 20,
      letterSpacing: 0,
    },
    labelXs: {
      // label/xs
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 600,
      fontSize: 12,
      lineHeight: 16,
      letterSpacing: 0,
    },
    displayHero: {
      // display/hero
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 600,
      fontSize: 48,
      lineHeight: 52,
      letterSpacing: 0,
    },
    displaySection: {
      // display/section
      fontFamily: '"Quicksand", sans-serif',
      fontWeight: 600,
      fontSize: 20,
      lineHeight: 28,
      letterSpacing: 0.25,
    },
  },
};

export const spacing = {
  // Base spacing scale (px)
  0: 0,
  '0_5': 2, // spacing/0․5
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28, // some nodes show 28, others 40 at 7 – we keep 28 as the direct token and use component aliases for 40px rows
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  16: 64,
  negative: {
    '0_5': -2, // spacing/n0․5
    1: -4, // spacing/n1
  },
};

export const radii = {
  // Radius primitives and aliases (px)
  none: 0, // rounded/0
  sm: 2, // rounded/sm
  md: 4, // Radius/2, rounded/md, Borders/Rounded/rounded-default
  lg: 8, // Radius/4, rounded/lg
  xl: 24, // rounded/xl
  pill: 9999, // rounded/pill, size/border-radius/br-pill
  circle: 200, // Borders/Rounded/rounded-circle (effectively fully rounded)
};

export const borders = {
  width: {
    sm: 1, // size/border-width/bw-sm
  },
  color: {
    primary: '#0000001f', // color/border/primary
    interactive: '#005a9cde', // color/border/interactive
    info: '#03a9f4', // color/border/info
    success: '#4caf50', // color/border/success
    warning: '#fb8c00', // color/border/warning
    error: '#d50000', // color/border/error
  },
};

export const colors = {
  text: {
    primary: '#000000de', // color/text/primary
    secondary: '#00000099', // color/text/secondary
    inversePrimary: '#ffffff', // color/text/inverse/primary
    interactive: '#005a9c', // color/text/interactive
    error: '#d50000', // color/text/error
  },
  icon: {
    primary: '#000000de', // color/icon/primary
    secondary: '#00000099', // color/icon/secondary
    inversePrimary: '#ffffff', // color/icon/inverse/primary
    interactive: '#005a9c', // color/icon/interactive
    info: '#03a9f4', // color/icon/info
    success: '#4caf50', // color/icon/success
    warning: '#fb8c00', // color/icon/warning
    error: '#d50000', // color/icon/error
    progress: '#388e3c', // color/icon/progress
  },
  surface: {
    primary: '#ffffff', // color/surface/primary
    background: '#f2f3f8', // color/surface/background
    leftNav: '#242939', // color/surface/left-nav
    interactive: '#005a9c', // color/surface/interactive
    interactiveSubtle: '#e6eff6', // color/surface/interactive 2
    infoLight: '#e0f4fd', // color/surface/info/light
    successLight: '#e9f5ea', // color/surface/success/light
    warningLight: '#fef1e0', // color/surface/warning/light
    errorLight: '#fae0e0', // color/surface/error/light
    progress: '#43a047', // color/surface/progress
    scrollTrack: '#ffe0b2', // color/surface/scroll
    scrollThumb: '#ffc977', // color/surface/scroll-thumb
    active: '#0000001f', // color/surface/New group/active
    darken: '#000000de', // color/surface/darken
    light: '#e0f4fd', // surface/light
    dark: '#005a9c', // surface/dark
  },
  brand: {
    primary: '#005a9c',
  },
  status: {
    info: {
      icon: '#03a9f4',
      surface: '#e0f4fd',
      border: '#03a9f4',
    },
    success: {
      icon: '#4caf50',
      surface: '#e9f5ea',
      border: '#4caf50',
    },
    warning: {
      icon: '#fb8c00',
      surface: '#fef1e0',
      border: '#fb8c00',
    },
    error: {
      icon: '#d50000',
      surface: '#fae0e0',
      border: '#d50000',
    },
    progress: {
      icon: '#388e3c',
      surface: '#43a047',
      border: '#43a047',
    },
  },
};

export const elevation = {
  // Expressed as named tokens – actual shadow values are taken from Figma definitions
  default:
    '0px 1px 5px 0px #0000001F, 0px 2px 2px 0px #00000024, 0px 1px 1px 0px #00000033',
  level2:
    '0px 1px 5px 0px #0000001F, 0px 2px 2px 0px #00000024, 0px 3px 1px -2px #00000033',
};

export const density = {
  list: {
    compact: 40,
    comfortable: 48,
  },
};

export const componentTokens = {
  button: {
    font: {
      size: 12, // btn/font/size
      lineHeight: 16, // btn/font/line-height
    },
    paddingX: 8, // btn/px
    paddingY: 6, // btn/py
    gap: 0, // btn/gap
    height: 28, // btn/size
    iconSize: 14, // btn/icon
    iconOffsetTop: 2, // btn/icon-top
    borderRadius: 4, // round / rounded/md
    loaderSize: 28, // btn/loader
  },
  iconButton: {
    size: 28, // icon-btn/size
    padding: 4, // icon-btn/padding
    iconSize: 20, // icon-btn/icon
    borderRadius: 4, // rounded/md
  },
  chip: {
    font: {
      size: 12, // or 14 depending on node; keeping 12 as base chip font
      lineHeight: 16, // chip/font/line-height
    },
    iconSize: 14, // chip/icon
    borderRadius: 4, // chip/corner
  },
  avatar: {
    size: 36, // avatar/size
    labelFontSize: 12, // avatar/label
  },
};

