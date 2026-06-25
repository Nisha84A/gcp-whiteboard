import { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_ColumnFiltersState } from 'material-react-table';
import { Chip } from '@mui/material';
import { useFilteredData } from '@/shared/hooks/useFilteredData';
import { useSyncFilters } from '@/shared/hooks/useSyncFilters';
import { getSharedTableOptions } from './tableConfig';
import ClickableSubjectCell from './ClickableSubjectCell';
import { AdverseEvent } from '@/shared/types';

const severityColor: Record<string, 'error' | 'warning' | 'success'> = {
  SEVERE: 'error',
  MODERATE: 'warning',
  MILD: 'success',
};

export default function AETable() {
  const { ae } = useFilteredData();
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  useSyncFilters(columnFilters);

  const columns = useMemo<MRT_ColumnDef<AdverseEvent>[]>(
    () => [
      {
        accessorKey: 'subjid',
        header: 'Subject',
        size: 100,
        filterVariant: 'multi-select',
        Cell: ({ cell }) => <ClickableSubjectCell subjectId={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'aeterm',
        header: 'Term',
        size: 130,
        filterVariant: 'multi-select',
      },
      {
        accessorKey: 'aesev',
        header: 'Severity',
        size: 110,
        filterVariant: 'multi-select',
        Cell: ({ cell }) => {
          const val = cell.getValue<string>();
          return <Chip label={val} size="small" color={severityColor[val] || 'default'} sx={{ fontSize: '0.7rem' }} />;
        },
      },
      {
        accessorKey: 'aerel',
        header: 'Relatedness',
        size: 150,
        filterVariant: 'multi-select',
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
    ...getSharedTableOptions<AdverseEvent>(columnFilters, setColumnFilters),
  });

  return <MaterialReactTable table={table} />;
}
