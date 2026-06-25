export const colors = {
  green: '#046307',
  greenDark: '#034705',
  lime: '#7BCF63',
  limeTint: '#EDF7E7',
  limeLine: '#DCEDD0',
  bg: '#FBFAF6',
  card: '#FFFFFF',
  ink: '#1C2118',
  sub: '#6B7263',
  faint: '#A8AC9F',
  line: '#ECEAE2',
  field: '#F1F0E9',
  amber: '#E8960C',
  amberInk: '#A66400',
  amberTint: '#FDF3E0',
  red: '#D43B2A',
  whatsapp: '#1FAF38',
  white: '#FFFFFF',
  black: '#000000',
};

export const fonts = {
  display: 'Montserrat',
  body: 'Poppins',
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const shadows = {
  card: {
    shadowColor: '#1C2118',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 28,
    elevation: 10,
  },
};

export const theme = { colors, fonts, radius, spacing, shadows };
export default theme;
