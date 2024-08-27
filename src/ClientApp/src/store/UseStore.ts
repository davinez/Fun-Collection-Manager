import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";

import { AuthSlice } from "@/store/stores/AuthSlice";
import { BarSlice } from "@/store/stores/BarSlice";
import { FooSlice } from "@/store/stores/FooSlice";
import { ManagerSlice } from "@/store/stores/ManagerSlice";
import type { TCombinedStore } from "shared/types/store/store.types";

export const useStore = create<TCombinedStore>()(
  persist(
    immer(
      devtools((...args) =>
      (
        {
          authSlice: AuthSlice(...args),
          barSlice: BarSlice(...args),
          fooSlice: FooSlice(...args),
          managerSlice: ManagerSlice(...args),
        }
      )
      )
    ),
    {
      name: "auth",
      partialize: (state) => ({
        // Include the keys you want to persist in here.
        authSlice: {          
          accountIdentifiers: state.authSlice.accountIdentifiers,
          userDisplayName: state.authSlice.userDisplayName,
          userEmail: state.authSlice.userEmail,
          userRoles: state.authSlice.userRoles,
          accessToken: state.authSlice.accessToken,
        },
      }),
      merge: (persistedState, currentState) => {
        // persistedState is unknown, so we need to cast it to CombinedState | undefined
        const typedPersistedState = persistedState as
          | TCombinedStore
          | undefined;

        return {
          authSlice: {
            // We need to do a deep merge here because the default merge strategy is a
            // shallow merge. Without doing this, our actions would not be included in
            // our merged state, resulting in unexpected behavior.
            ...currentState.authSlice,
            ...typedPersistedState?.authSlice,
          },
          managerSlice: {
            // We need to do a deep merge here because the default merge strategy is a
            // shallow merge. Without doing this, our actions would not be included in
            // our merged state, resulting in unexpected behavior.
            ...currentState.managerSlice,
            ...typedPersistedState?.managerSlice,
          },
          barSlice: currentState.barSlice,
          fooSlice: currentState.fooSlice
        };
      },
      onRehydrateStorage: () => {
        console.log("hydration starts");

        // optional
        return (state, error): void => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            console.log("hydration finished");
            state?.authSlice.setHasHydrated(true);
          }
        };
      },
    }
  )
);

// const useBoundStore = create(
//   persist(
//     (set, get) => ({
//       // ...
//       _hasHydrated: false,
//       setHasHydrated: (state) => {
//         set({
//           _hasHydrated: state
//         });
//       }
//     }),
//     {
//       // ...
//       onRehydrateStorage: () => (state) => {
//         state.setHasHydrated(true)
//       }
//     }
//   )
// );
