export const COLORS = {
  primary: '#00450d',           // Government Dark Green
  primaryContainer: '#1b5e20',  // Darker container green
  primaryLight: '#e8f5e9',      // Very light green badge/pill background
  primaryFixed: '#acf4a4',      // Vibrant highlight green
  primaryDim: '#91d78a',

  background: '#f7fbf1',        // Soft gov surface background
  surface: '#ffffff',           // Pure white cards
  surfaceContainer: '#ecefe6',  // Subtle grey-green card background
  surfaceVariant: '#e0e4db',
  
  textPrimary: '#191d17',       // Dark readable text
  textSecondary: '#41493e',     // Medium grey text
  textMuted: '#717a6d',         // Muted caption text
  textInverse: '#ffffff',       // White text on dark cards

  border: '#d8dbd2',            // Clean subtle card border
  borderLight: '#e6e9e0',

  // Status & Anomaly Colors
  critical: '#ba1a1a',          // High Risk / Critical Red
  criticalBg: '#ffdad6',
  criticalText: '#93000a',

  warning: '#d97706',           // Warning Amber / Orange
  warningBg: '#fef3c7',
  warningText: '#92400e',

  success: '#16a34a',           // Completed / Safe Green
  successBg: '#dcfce7',
  successText: '#14532d',

  info: '#0284c7',              // Information Blue
  infoBg: '#e0f2fe',
  infoText: '#075985',
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const RADIUS = {
  sm: 6,
  md: 12,
  lg: 16,
  full: 9999,
};
