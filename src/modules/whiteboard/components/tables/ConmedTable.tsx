import { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_ColumnFiltersState } from 'material-react-table';
import { Chip } from '@mui/material';
import { useFilteredData } from '@/shared/hooks/useFilteredData';
import { useSyncFilters } from '@/shared/hooks/useSyncFilters';
import { getSharedTableOptions } from './tableConfig';
import ClickableSubjectCell from './ClickableSubjectCell';
import { ConcomitantMed } from '@/shared/types';

export default function ConmedTable() {
  const { cm } = useFilteredData();
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  useSyncFilters(columnFilters);

  const columns = useMemo<MRT_ColumnDef<ConcomitantMed>[]>(
    () => [
      {
        accessorKey: 'subjid',
        header: 'Subject',
        size: 100,
        filterVariant: 'multi-select',
        Cell: ({ cell }) => <ClickableSubjectCell subjectId={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'cmtrt',
        header: 'Medication',
        size: 140,
        filterVariant: 'multi-select',
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
        filterVariant: 'multi-select',
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
        id: 'cmongo',
        header: 'Ongoing',
        size: 90,
        accessorFn: (row) => (row.cmongo ? 'Yes' : 'No'),
        filterVariant: 'multi-select',
        Cell: ({ cell }) => {
          const val = cell.getValue<string>();
          return <Chip label={val} size="small" color={val === 'Yes' ? 'info' : 'default'} variant="outlined" sx={{ fontSize: '0.7rem' }} />;
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: cm,
    ...getSharedTableOptions<ConcomitantMed>(columnFilters, setColumnFilters),
  });

  return <MaterialReactTable table={table} />;
}
