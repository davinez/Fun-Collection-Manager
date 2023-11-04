import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";

import { AuthSlice } from "@/store/stores/AuthSlice";
import { BarSlice } from "@/store/stores/BarSlice";
import { FooSlice } from "@/store/stores/FooSlice";
import type { TCombinedStore } from "shared/types/store/store.types";

export const useStore = create<TCombinedStore>()(
	persist(
		immer(
			devtools((...api) => ({
				authSlice: AuthSlice(...api),
				barSlice: BarSlice(...api),
				fooSlice: FooSlice(...api),
			}))
		),
		{
			name: "auth",
			partialize: (state) => ({
				// Include the keys you want to persist in here.
				authSlice: {
					user: state.authSlice.user,
					accessToken: state.authSlice.accessToken,
					refreshToken: state.authSlice.refreshToken,
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
					barSlice: currentState.barSlice,
					fooSlice: currentState.fooSlice,
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
