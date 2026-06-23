import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PageFilters {
  subjectIds: string[];
  arms: string[];
  sites: string[];
  sex: string[];
  aeSeverity: string[];
  aeRelatedness: string[];
  studyDayRange: [number | null, number | null];
}

const initialFilters: PageFilters = {
  subjectIds: [],
  arms: [],
  sites: [],
  sex: [],
  aeSeverity: [],
  aeRelatedness: [],
  studyDayRange: [null, null],
};

interface FilterState {
  filters: PageFilters;
}

const initialState: FilterState = {
  filters: { ...initialFilters },
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter<K extends keyof PageFilters>(
      state: FilterState,
      action: PayloadAction<{ key: K; value: PageFilters[K] }>
    ) {
      (state.filters as any)[action.payload.key] = action.payload.value;
    },
    clearFilter(state, action: PayloadAction<keyof PageFilters>) {
      (state.filters as any)[action.payload] = initialFilters[action.payload];
    },
    clearAll(state) {
      state.filters = { ...initialFilters };
    },
  },
});

export const { setFilter, clearFilter, clearAll } = filterSlice.actions;
export default filterSlice.reducer;
