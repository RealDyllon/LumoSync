import {create} from 'zustand';

interface LogsState {
  logs: string[];
  addLog: (log: string) => void;
  clearLogs: () => void;
}

export const useLogsStore = create<LogsState>(set => ({
  logs: [],
  addLog: (log: string) => set(state => ({logs: [...state.logs, log]})),
  clearLogs: () => set({logs: []}),
}));
