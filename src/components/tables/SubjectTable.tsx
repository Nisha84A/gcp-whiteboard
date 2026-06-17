import { useMemo } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table';
import { Chip } from '@mui/material';
import { useFilteredData } from '@/hooks/useFilteredData';
import { Subject } from '@/types';

export default function SubjectTable() {
  const { subjects } = useFilteredData();

  const columns = useMemo<MRT_ColumnDef<Subject>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Subject',
        size: 110,
        Cell: ({ cell }) => <span className="text-cyan-400 font-mono font-semibold">{cell.getValue<string>()}</span>,
      },
      {
        accessorKey: 'arm',
        header: 'Arm',
        size: 140,
        filterVariant: 'select',
      },
      {
        accessorKey: 'age',
        header: 'Age',
        size: 80,
        filterVariant: 'range',
      },
      {
        accessorKey: 'sex',
        header: 'Sex',
        size: 70,
        filterVariant: 'select',
      },
      {
        accessorKey: 'site',
        header: 'Site',
        size: 100,
        filterVariant: 'select',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 130,
        filterVariant: 'select',
        Cell: ({ cell }) => {
          const val = cell.getValue<string>();
          return (
            <Chip
              label={val}
              size="small"
              color={val === 'Completed' ? 'success' : 'warning'}
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          );
        },
      },
      {
        accessorKey: 'vital',
        header: 'Vital',
        size: 90,
        filterVariant: 'select',
        Cell: ({ cell }) => {
          const val = cell.getValue<string>();
          return (
            <span className={val === 'ALIVE' ? 'text-green-400' : 'text-red-400'}>
              {val === 'ALIVE' ? '●' : '✖'} {val}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: subjects,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    initialState: { density: 'compact', showColumnFilters: true },
    muiTablePaperProps: { elevation: 0, sx: { background: 'transparent' } },
    muiTableContainerProps: { sx: { maxHeight: '100%' } },
  });

  return <MaterialReactTable table={table} />;
}
