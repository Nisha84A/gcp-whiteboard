import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Chip } from '@mui/material';
import { useFilteredData } from '@/hooks/useFilteredData';
import { AdverseEvent } from '@/types';

const severityColor: Record<string, 'error' | 'warning' | 'success'> = {
  SEVERE: 'error',
  MODERATE: 'warning',
  MILD: 'success',
};

export default function AETable() {
  const { ae } = useFilteredData();

  const columns = useMemo<MRT_ColumnDef<AdverseEvent>[]>(
    () => [
      {
        accessorKey: 'subjid',
        header: 'Subject',
        size: 100,
        Cell: ({ cell }) => <span className="text-cyan-400 font-mono">{cell.getValue<string>()}</span>,
      },
      {
        accessorKey: 'aeterm',
        header: 'Term',
        size: 130,
        filterVariant: 'select',
      },
      {
        accessorKey: 'aesev',
        header: 'Severity',
        size: 110,
        filterVariant: 'select',
        Cell: ({ cell }) => {
          const val = cell.getValue<string>();
          return <Chip label={val} size="small" color={severityColor[val] || 'default'} sx={{ fontSize: '0.7rem' }} />;
        },
      },
      {
        accessorKey: 'aerel',
        header: 'Relatedness',
        size: 150,
        filterVariant: 'select',
      },
      {
        accessorKey: 'aestdy',
        header: 'Start Day',
        size: 100,
        filterVariant: 'range',
      },
      {
        accessorKey: 'aeendy',
        header: 'End Day',
        size: 100,
        filterVariant: 'range',
      },
      {
        id: 'duration',
        header: 'Duration',
        size: 90,
        accessorFn: (row) => row.aeendy - row.aestdy,
        Cell: ({ cell }) => <span>{cell.getValue<number>()} days</span>,
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: ae,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    initialState: { density: 'compact', showColumnFilters: true },
    muiTablePaperProps: { elevation: 0, sx: { background: 'transparent' } },
  });

  return <MaterialReactTable table={table} />;
}
