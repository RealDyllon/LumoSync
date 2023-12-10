import {create} from "zustand";
import {Routes} from "../navigation";

interface NavigationState {
  currentRoute: Routes | null;
  setCurrentRoute: (currentScreen: NavigationState['currentRoute']) => void;
}

export const useNavigationStore = create<NavigationState>()(
  set => ({
    currentRoute: null,
    setCurrentRoute: (currentRoute: NavigationState['currentRoute']) => set({currentRoute}),
  }),
);
