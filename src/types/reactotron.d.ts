import type { Reactotron } from 'reactotron-react-native';

declare global {
  // Available app-wide once src/config/reactotron.ts runs (dev only).
  interface Console {
    tron: typeof Reactotron;
  }
}

export {};
