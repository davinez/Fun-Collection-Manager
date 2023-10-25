import type { TStateSlice } from 'shared/types/store/store.types';

export type TAuthSliceDefinition = {
  accessToken: string;
  refreshToken: string;
  storage: string;
}

export type TAuthSliceActions = {
  setAccessToken: (token: string) => void;
}

export type TAuthSlice = TAuthSliceDefinition & TAuthSliceActions;

const initialAuthSliceState: TAuthSliceDefinition = {
  accessToken: "A",
  refreshToken: "A",
  storage: "A",
};


export const AuthSlice: TStateSlice<TAuthSlice> = (set) => ({
  ...initialAuthSliceState,
  setAccessToken: (token): void =>
    {
    set((state) => {
      state.authSlice.accessToken = token;
    });
  }
});

// Check how use createJSONStorage

// import { create, type StateCreator } from 'zustand';
// import { createJSONStorage, persist, type PersistOptions } from 'zustand/middleware';

// type AuthStore = {
//   accessToken: string | null;
//   setAccessToken: (token: string) => void;
// }

// type MyPersist = (
//   config: StateCreator<AuthStore>,
//   options: PersistOptions<AuthStore>
// ) => StateCreator<AuthStore>

// export const AuthSlice = create<AuthStore, []>(
//   (persist as MyPersist)(
//     (set): AuthStore => ({
//       accessToken: null,
//       setAccessToken: (token: string): void => { set(() => ({ accessToken: token })); },
//     }),
//     {
//       name: 'auth',
//       storage: createJSONStorage(() => localStorage),
//     },
//   ),
// );


