import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Chip } from '@mui/material';
import { useFilteredData } from '@/hooks/useFilteredData';
import { Exposure } from '@/types';

export default function ExposureTable() {
  const { ex } = useFilteredData();

  const columns = useMemo<MRT_ColumnDef<Exposure>[]>(
    () => [
      {
        accessorKey: 'subjid',
        header: 'Subject',
        size: 100,
        Cell: ({ cell }) => <span className="text-cyan-400 font-mono">{cell.getValue<string>()}</span>,
      },
      {
        accessorKey: 'extrt',
        header: 'Treatment',
        size: 130,
        filterVariant: 'select',
      },
      {
        id: 'dose',
        header: 'Dose',
        size: 100,
        accessorFn: (row) => `${row.exdose} ${row.exdosu}`,
      },
      {
        accessorKey: 'exroute',
        header: 'Route',
        size: 80,
        filterVariant: 'select',
      },
      {
        accessorKey: 'exdosfrq',
        header: 'Frequency',
        size: 80,
        filterVariant: 'select',
      },
      {
        accessorKey: 'exstdy',
        header: 'Start Day',
        size: 90,
      },
      {
        accessorKey: 'exendy',
        header: 'End Day',
        size: 90,
      },
      {
        id: 'duration',
        header: 'Duration',
        size: 90,
        accessorFn: (row) => row.exendy - row.exstdy,
        Cell: ({ cell }) => <span>{cell.getValue<number>()} days</span>,
      },
      {
        accessorKey: 'excomp',
        header: 'Completed',
        size: 100,
        filterVariant: 'select',
        Cell: ({ cell }) => {
          const val = cell.getValue<boolean>();
          return <Chip label={val ? 'Yes' : 'No'} size="small" color={val ? 'success' : 'error'} variant="outlined" sx={{ fontSize: '0.7rem' }} />;
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: ex,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    initialState: { density: 'compact', showColumnFilters: true },
    muiTablePaperProps: { elevation: 0, sx: { background: 'transparent' } },
  });

  return <MaterialReactTable table={table} />;
}
