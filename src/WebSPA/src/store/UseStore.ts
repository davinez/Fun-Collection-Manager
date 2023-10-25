import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { AuthSlice } from '@/store/stores/AuthSlice';
import { BarSlice } from '@/store/stores/BarSlice';
import { FooSlice } from '@/store/stores/FooSlice';
import type { TCombinedStore } from 'shared/types/store/store.types';

export const useStore = create<TCombinedStore>()(
    immer((...api) => ({
      authSlice: AuthSlice(...api),
      barSlice: BarSlice(...api),
      fooSlice: FooSlice(...api),
    }))
);
