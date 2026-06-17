import { create } from 'zustand';

export interface PageFilters {
  subjectIds: string[];
  arms: string[];
  sites: string[];
  sex: string[];
  aeSeverity: string[];
  aeRelatedness: string[];
  studyDayRange: [number | null, number | null];
}

const emptyFilters: PageFilters = {
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
  setFilter: <K extends keyof PageFilters>(key: K, value: PageFilters[K]) => void;
  clearFilter: (key: keyof PageFilters) => void;
  clearAll: () => void;
  activeFilterCount: () => number;
}

export const useFilterStore = create<FilterState>()((set, get) => ({
  filters: { ...emptyFilters },

  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),

  clearFilter: (key) =>
    set((state) => ({ filters: { ...state.filters, [key]: emptyFilters[key] } })),

  clearAll: () => set({ filters: { ...emptyFilters } }),

  activeFilterCount: () => {
    const f = get().filters;
    let count = 0;
    if (f.subjectIds.length) count++;
    if (f.arms.length) count++;
    if (f.sites.length) count++;
    if (f.sex.length) count++;
    if (f.aeSeverity.length) count++;
    if (f.aeRelatedness.length) count++;
    if (f.studyDayRange[0] !== null || f.studyDayRange[1] !== null) count++;
    return count;
  },
}));
