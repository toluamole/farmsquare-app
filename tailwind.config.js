/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Ported from src/theme/index.ts (keep in sync).
      colors: {
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

        // Semantic aliases (react-native-reusables convention) -> brand palette.
        background: '#FBFAF6',
        foreground: '#1C2118',
        'card-foreground': '#1C2118',
        primary: { DEFAULT: '#046307', foreground: '#FFFFFF' },
        secondary: { DEFAULT: '#F1F0E9', foreground: '#1C2118' },
        muted: { DEFAULT: '#F1F0E9', foreground: '#6B7263' },
        accent: { DEFAULT: '#7BCF63', foreground: '#0A3D0C' },
        destructive: { DEFAULT: '#D43B2A', foreground: '#FFFFFF' },
        border: '#ECEAE2',
        input: '#ECEAE2',
        ring: '#046307',
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '22px',
      },
      fontFamily: {
        // Montserrat (display)
        'm-regular': ['Montserrat_400Regular'],
        'm-medium': ['Montserrat_500Medium'],
        'm-semibold': ['Montserrat_600SemiBold'],
        'm-bold': ['Montserrat_700Bold'],
        'm-extrabold': ['Montserrat_800ExtraBold'],
        // Poppins (body)
        'p-regular': ['Poppins_400Regular'],
        'p-medium': ['Poppins_500Medium'],
        'p-semibold': ['Poppins_600SemiBold'],
        'p-bold': ['Poppins_700Bold'],
      },
    },
  },
  plugins: [],
};
