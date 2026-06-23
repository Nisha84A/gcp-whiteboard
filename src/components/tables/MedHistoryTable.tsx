import { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_ColumnFiltersState } from 'material-react-table';
import { Chip } from '@mui/material';
import { useFilteredData } from '@/hooks/useFilteredData';
import { useSyncFilters } from '@/hooks/useSyncFilters';
import { getSharedTableOptions } from './tableConfig';
import ClickableSubjectCell from './ClickableSubjectCell';
import { MedicalHistory } from '@/types';

export default function MedHistoryTable() {
  const { mh } = useFilteredData();
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  useSyncFilters(columnFilters);

  const columns = useMemo<MRT_ColumnDef<MedicalHistory>[]>(
    () => [
      {
        accessorKey: 'subjid',
        header: 'Subject',
        size: 100,
        filterVariant: 'multi-select',
        Cell: ({ cell }) => <ClickableSubjectCell subjectId={cell.getValue<string>()} />,
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
        filterVariant: 'multi-select',
      },
      {
        accessorKey: 'mhstat',
        header: 'Status',
        size: 110,
        filterVariant: 'multi-select',
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
    ...getSharedTableOptions<MedicalHistory>(columnFilters, setColumnFilters),
  });

  return <MaterialReactTable table={table} />;
}
