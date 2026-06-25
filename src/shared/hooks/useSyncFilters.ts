import { useEffect, useRef } from 'react';
import { type MRT_ColumnFiltersState } from 'material-react-table';
import { useAppDispatch } from '@/shared/store';
import { setFilter, type PageFilters } from '@/shared/store/filterSlice';

const columnToFilterKey: Record<string, keyof PageFilters> = {
  id: 'subjectIds',
  subjid: 'subjectIds',
  arm: 'arms',
  site: 'sites',
  sex: 'sex',
  aesev: 'aeSeverity',
  aerel: 'aeRelatedness',
};

export function useSyncFilters(columnFilters: MRT_ColumnFiltersState) {
  const dispatch = useAppDispatch();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    for (const filter of columnFilters) {
      const storeKey = columnToFilterKey[filter.id];
      if (!storeKey) continue;

      const value = filter.value;
      if (Array.isArray(value)) {
        dispatch(setFilter({ key: storeKey, value: value as string[] } as any));
      } else if (typeof value === 'string' && value.length > 0) {
        dispatch(setFilter({ key: storeKey, value: [value] } as any));
      }
    }

    for (const [colId, storeKey] of Object.entries(columnToFilterKey)) {
      const wasActive = columnFilters.find((f) => f.id === colId);
      if (!wasActive) {
        dispatch(setFilter({ key: storeKey, value: [] } as any));
      }
    }
  }, [columnFilters, dispatch]);
}
