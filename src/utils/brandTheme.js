const DEFAULT_COLORS = {
  background: '#0B0E12',
  text: '#F8F9FF',
  primary: '#8B5CF6',
  secondary: '#3B82F6'
};

export const normalizeBrandTheme = (theme, overrides = {}) => {
  if (!theme) return null;
  const safeTheme = typeof theme === 'object' ? theme : {};
  const palette = Array.isArray(safeTheme.palette) ? safeTheme.palette : [];

  const backgroundColor =
    overrides.backgroundColor ??
    safeTheme.backgroundColor ??
    safeTheme.background ??
    palette[palette.length - 1] ??
    DEFAULT_COLORS.background;

  const textColor =
    overrides.textColor ??
    safeTheme.textColor ??
    safeTheme.text ??
    palette[0] ??
    DEFAULT_COLORS.text;

  const clockColor =
    overrides.clockColor ??
    safeTheme.clockColor ??
    safeTheme.primaryColor ??
    safeTheme.primary ??
    DEFAULT_COLORS.primary;

  const digitColor =
    overrides.digitColor ??
    safeTheme.digitColor ??
    safeTheme.secondaryColor ??
    safeTheme.secondary ??
    DEFAULT_COLORS.secondary;

  const accentColor =
    overrides.accentColor ??
    safeTheme.accentColor ??
    safeTheme.accent ??
    clockColor;

  const presetName = overrides.presetName ?? safeTheme.presetName ?? safeTheme.name;

  const normalized = {
    ...safeTheme,
    ...overrides,
    palette,
    presetName,
    name: safeTheme.name || presetName || 'Custom Brand Theme',
    background: backgroundColor,
    text: textColor,
    primary: safeTheme.primary ?? clockColor,
    secondary: safeTheme.secondary ?? digitColor,
    accent: safeTheme.accent ?? accentColor,
    backgroundColor,
    textColor,
    clockColor,
    digitColor,
    accentColor
  };

  normalized.colors = {
    ...safeTheme.colors,
    background: backgroundColor,
    text: textColor,
    primary: normalized.primary,
    secondary: normalized.secondary,
    accent: normalized.accent,
    palette
  };

  return normalized;
};
