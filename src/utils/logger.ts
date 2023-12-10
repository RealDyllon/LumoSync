// this file logs to console and to the logs store

import {useLogsStore} from "../state/logs";

export const logMsg = (message: string, additional?: string) => {
  useLogsStore.getState().addLog(`LOG: ${message} -- ${additional}`);
    console.log(`${message}${additional ? ` - ${additional}` : ""}`);
}

export const logError = (text: string, error: Error, extra?: any) => {
  useLogsStore.getState().addLog(`ERROR: ${text} -- ${error.message} -- ${extra ?? ""}`);
    console.error(text, error);
}
