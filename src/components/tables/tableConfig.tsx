import { type MRT_ColumnFiltersState, type MRT_TableOptions, MRT_ToggleFiltersButton, MRT_ShowHideColumnsButton, MRT_ToggleGlobalFilterButton } from 'material-react-table';
import { IconButton, Tooltip } from '@mui/material';
import { FilterX } from 'lucide-react';

export function getSharedTableOptions<T extends Record<string, any>>(
  columnFilters: MRT_ColumnFiltersState,
  setColumnFilters: (filters: MRT_ColumnFiltersState) => void
): Partial<MRT_TableOptions<T>> {
  return {
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableFacetedValues: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    initialState: { density: 'compact', showColumnFilters: true },
    renderToolbarInternalActions: ({ table }) => (
      <div className="flex items-center">
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ToggleFiltersButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <Tooltip title="Clear all filters">
          <IconButton
            onClick={() => setColumnFilters([])}
            size="small"
            sx={{ color: columnFilters.length > 0 ? '#22d3ee' : undefined }}
          >
            <FilterX size={18} />
          </IconButton>
        </Tooltip>
      </div>
    ),
    muiTablePaperProps: {
      elevation: 0,
      sx: { background: 'transparent', isolation: 'isolate' },
    },
    muiTableContainerProps: { sx: { maxHeight: '100%' } },
    muiTopToolbarProps: {
      sx: { position: 'sticky', top: 0, zIndex: 2, background: '#1a2744' },
    },
    muiBottomToolbarProps: {
      sx: { position: 'sticky', bottom: 0, zIndex: 2, background: '#1a2744' },
    },
    muiFilterTextFieldProps: {
      variant: 'outlined',
      size: 'small',
      sx: {
        minWidth: '100px',
        '& .MuiInputBase-input': { fontSize: '0.7rem' },
        '& .MuiSelect-select': { fontSize: '0.7rem' },
      },
      slotProps: {
        select: {
          MenuProps: {
            slotProps: {
              paper: {
                sx: {
                  maxHeight: '150px',
                  overflowY: 'auto',
                  '& .MuiMenuItem-root': {
                    fontSize: '0.7rem',
                    minHeight: '26px',
                    padding: '1px 8px',
                  },
                  '& .MuiCheckbox-root': {
                    padding: '2px',
                    '& svg': { fontSize: '0.9rem' },
                  },
                  '& .MuiListItemText-primary': {
                    fontSize: '0.7rem',
                  },
                },
              },
            },
          },
        } as any,
      },
    },
  };
}
