import { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_ColumnFiltersState } from 'material-react-table';
import { Chip } from '@mui/material';
import { useFilteredData } from '@/hooks/useFilteredData';
import { useSyncFilters } from '@/hooks/useSyncFilters';
import { getSharedTableOptions } from './tableConfig';
import ClickableSubjectCell from './ClickableSubjectCell';
import { Exposure } from '@/types';

export default function ExposureTable() {
  const { ex } = useFilteredData();
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  useSyncFilters(columnFilters);

  const columns = useMemo<MRT_ColumnDef<Exposure>[]>(
    () => [
      {
        accessorKey: 'subjid',
        header: 'Subject',
        size: 100,
        filterVariant: 'multi-select',
        Cell: ({ cell }) => <ClickableSubjectCell subjectId={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'extrt',
        header: 'Treatment',
        size: 130,
        filterVariant: 'multi-select',
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
        filterVariant: 'multi-select',
      },
      {
        accessorKey: 'exdosfrq',
        header: 'Frequency',
        size: 80,
        filterVariant: 'multi-select',
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
        id: 'excomp',
        header: 'Completed',
        size: 100,
        accessorFn: (row) => (row.excomp ? 'Yes' : 'No'),
        filterVariant: 'multi-select',
        Cell: ({ cell }) => {
          const val = cell.getValue<string>();
          return <Chip label={val} size="small" color={val === 'Yes' ? 'success' : 'error'} variant="outlined" sx={{ fontSize: '0.7rem' }} />;
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: ex,
    ...getSharedTableOptions<Exposure>(columnFilters, setColumnFilters),
  });

  return <MaterialReactTable table={table} />;
}
