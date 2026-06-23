import { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_ColumnFiltersState } from 'material-react-table';
import { Chip } from '@mui/material';
import { useFilteredData } from '@/hooks/useFilteredData';
import { useSyncFilters } from '@/hooks/useSyncFilters';
import { getSharedTableOptions } from './tableConfig';
import ClickableSubjectCell from './ClickableSubjectCell';
import { Subject } from '@/types';

export default function SubjectTable() {
  const { subjects } = useFilteredData();
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  useSyncFilters(columnFilters);

  const columns = useMemo<MRT_ColumnDef<Subject>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Subject',
        size: 110,
        filterVariant: 'multi-select',
        Cell: ({ cell }) => <ClickableSubjectCell subjectId={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'arm',
        header: 'Arm',
        size: 140,
        filterVariant: 'multi-select',
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
        filterVariant: 'multi-select',
      },
      {
        accessorKey: 'site',
        header: 'Site',
        size: 100,
        filterVariant: 'multi-select',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 130,
        filterVariant: 'multi-select',
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
        filterVariant: 'multi-select',
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
    ...getSharedTableOptions<Subject>(columnFilters, setColumnFilters),
  });

  return <MaterialReactTable table={table} />;
}
