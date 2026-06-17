import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Chip } from '@mui/material';
import { useFilteredData } from '@/hooks/useFilteredData';
import { MedicalHistory } from '@/types';

export default function MedHistoryTable() {
  const { mh } = useFilteredData();

  const columns = useMemo<MRT_ColumnDef<MedicalHistory>[]>(
    () => [
      {
        accessorKey: 'subjid',
        header: 'Subject',
        size: 100,
        Cell: ({ cell }) => <span className="text-cyan-400 font-mono">{cell.getValue<string>()}</span>,
      },
      {
        accessorKey: 'mhdecod',
        header: 'Condition',
        size: 180,
      },
      {
        accessorKey: 'mhcat',
        header: 'Category',
        size: 140,
        filterVariant: 'select',
      },
      {
        accessorKey: 'mhstat',
        header: 'Status',
        size: 110,
        filterVariant: 'select',
        Cell: ({ cell }) => {
          const val = cell.getValue<string>();
          return (
            <Chip
              label={val}
              size="small"
              color={val === 'ONGOING' ? 'warning' : 'success'}
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: mh,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    initialState: { density: 'compact', showColumnFilters: true },
    muiTablePaperProps: { elevation: 0, sx: { background: 'transparent' } },
  });

  return <MaterialReactTable table={table} />;
}
