import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Chip } from '@mui/material';
import { useFilteredData } from '@/hooks/useFilteredData';
import { ConcomitantMed } from '@/types';

export default function ConmedTable() {
  const { cm } = useFilteredData();

  const columns = useMemo<MRT_ColumnDef<ConcomitantMed>[]>(
    () => [
      {
        accessorKey: 'subjid',
        header: 'Subject',
        size: 100,
        Cell: ({ cell }) => <span className="text-cyan-400 font-mono">{cell.getValue<string>()}</span>,
      },
      {
        accessorKey: 'cmtrt',
        header: 'Medication',
        size: 140,
        filterVariant: 'select',
      },
      {
        id: 'dose',
        header: 'Dose',
        size: 100,
        accessorFn: (row) => `${row.cmdose} ${row.cmdosu}`,
      },
      {
        accessorKey: 'cmroute',
        header: 'Route',
        size: 80,
        filterVariant: 'select',
      },
      {
        accessorKey: 'cmstdy',
        header: 'Start Day',
        size: 100,
      },
      {
        accessorKey: 'cmendy',
        header: 'End Day',
        size: 100,
      },
      {
        accessorKey: 'cmongo',
        header: 'Ongoing',
        size: 90,
        filterVariant: 'select',
        Cell: ({ cell }) => {
          const val = cell.getValue<boolean>();
          return <Chip label={val ? 'Yes' : 'No'} size="small" color={val ? 'info' : 'default'} variant="outlined" sx={{ fontSize: '0.7rem' }} />;
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: cm,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    initialState: { density: 'compact', showColumnFilters: true },
    muiTablePaperProps: { elevation: 0, sx: { background: 'transparent' } },
  });

  return <MaterialReactTable table={table} />;
}
