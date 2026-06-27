import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

// Single Reactotron instance. Configured for development only — in release
// builds `__DEV__` is false, so we never `.connect()` and the store never
// attaches the enhancer (see src/store/index.ts), keeping production clean.
//
// Physical device note: pass `host: '<your-machine-ip>'` to `.configure()`.
// On the emulator the auto-detected localhost works; if it can't reach the
// desktop app, run `adb reverse tcp:9090 tcp:9090`.
Reactotron.configure({ name: 'FarmSquare' })
  .useReactNative({ networking: true, asyncStorage: true })
  .use(reactotronRedux());

if (__DEV__) {
  Reactotron.connect();
  Reactotron.clear();
  // Make the structured logger available app-wide via `console.tron`.
  console.tron = Reactotron;
}

export default Reactotron;
