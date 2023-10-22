import React from 'react';
import type {ReactElement} from 'react';
// @ts-ignore
import {SENTRY_DSN} from '@env';

import * as Sentry from '@sentry/react-native';
import {RootNavigation} from './src/navigation';
import BLE from './src/components/BLE';
import {
  MD3LightTheme as DefaultTheme,
  MD3Theme,
  PaperProvider,
} from 'react-native-paper';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import GroupProgramMode from './src/components/GroupProgramMode';
import {NotifierWrapper} from 'react-native-notifier';

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
});

const theme: MD3Theme = {
  ...DefaultTheme,
  dark: false, // disable dark mode
};

function App(): ReactElement {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{flex: 1}}>
      <PaperProvider theme={theme}>
        <NotifierWrapper translucentStatusBar={true}>
          <RootNavigation />
          <BLE />
          <GroupProgramMode />
        </NotifierWrapper>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(App);
