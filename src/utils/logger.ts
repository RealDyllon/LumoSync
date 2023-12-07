// this file logs to console and sentry

import * as Sentry from '@sentry/react-native';
import {useLogsStore} from "../state/logs";

export const logMsg = (message: string, additional?: string) => {
  useLogsStore.getState().addLog(`LOG: ${message} -- ${additional}`);
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
  useLogsStore.getState().addLog(`ERROR: ${text} -- ${error.message} -- ${extra ?? ""}`);
  // if (__DEV__) {
    console.error(text, error);
  // } else {
    Sentry.captureException(error, {
      extra: {
        text,
        extra
      },
    });
  // }
}
