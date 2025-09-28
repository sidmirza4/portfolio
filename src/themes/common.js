import mixins from '@styles/mixins';

export default {
  borderRadius: '12px',
  borderRadiusFull: '9999px',
  borderRadiusButton: '2.375rem',
  hamburgerWidth: '3rem',
  fontFamily: {
    fontSans: 'Open Sans, -apple-system, BlinkMacSystemFont,Segoe UI, Helvetica, Arial',
    fontMono: 'Space Mono, SF Mono, Fira Code, Fira Mono, Roboto Mono, monospace',
  },
  brand: {
    primary: '#0693E3',
    secondary: '#0693E3',
    accent: '#5FC921',
    border: '#0693E326',
  },
  fontSize: {
    // Micro text - captions, timestamps, fine print
    micro: '0.75rem', // 7.5px - very small text
    xxs: '0.9rem', // 9px - existing, keep for compatibility
    xs: '1.1rem', // 11px - existing, keep for compatibility

    // Small text - labels, secondary info
    small: '1.2rem', // 12px - body text, descriptions
    sm: '1.3rem', // 13px - existing, keep for compatibility

    // Medium text - body text, buttons
    body: '1.4rem', // 14px - main body text
    md: '1.4rem', // 14px - existing, keep for compatibility

    // Large text - headings, emphasis
    large: '1.6rem', // 16px - subheadings
    lg: '1.8rem', // 18px - existing, keep for compatibility

    // Extra large text - main headings
    xl: '2.2rem', // 22px - existing, keep for compatibility
    xxl: '2.6rem', // 26px - existing, keep for compatibility

    // Display text - hero headings
    display: '3.2rem', // 32px - hero text
    hero: '4.8rem', // 48px - large hero text
  },
  // New spacing system (8pt grid)
  spacing: {
    1: '0.5rem',
    2: '1rem',
    3: '1.5rem',
    4: '2rem',
    5: '2.5rem',
    6: '3rem',
  },
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '1080px',
    xl: '1200px',
  },
  fontw: {
    light: 300,
    regular: 400,
    semibold: 600,
    bold: 700,
  },
  transitions: {
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    default: 'all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1)',
    hamBefore: 'top 0.1s ease-in 0.25s, opacity 0.1s ease-in',
    hamBeforeActive: 'top 0.1s ease-out, opacity 0.1s ease-out 0.12s',
    hamAfter: 'bottom 0.1s ease-in 0.25s, transform 0.22s cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    hamAfterActive:
      'bottom 0.1s ease-out, transform 0.22s cubic-bezier(0.215, 0.61, 0.355, 1) 0.12s',
    // New animation timings from AI
    button: 'all 0.2s ease-out',
    ripple: '0.4s',
  },
  mixins,
};
