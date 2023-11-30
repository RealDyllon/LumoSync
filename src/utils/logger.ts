// this file logs to console and sentry

import * as Sentry from '@sentry/react-native';

export const logMsg = (message: string, additional?: string) => {
  if (__DEV__) {
    console.log(`${message}${additional ? ` - ${additional}` : ""}`);
  } else {
    Sentry.captureMessage(message, {
      extra: {
        additional,
      },
    });
  }
}

export const logError = (text: string, error: Error, extra?: any) => {
  if (__DEV__) {
    console.error(text, error);
  } else {
    Sentry.captureException(error, {
      extra: {
        text,
        extra
      },
    });
  }
}
