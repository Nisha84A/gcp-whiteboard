import { useMemo, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef, type MRT_ColumnFiltersState } from 'material-react-table';
import { useFilteredData } from '@/hooks/useFilteredData';
import { useSyncFilters } from '@/hooks/useSyncFilters';
import { getSharedTableOptions } from './tableConfig';
import ClickableSubjectCell from './ClickableSubjectCell';
import { LabTest } from '@/types';

export default function LabTable() {
  const { labs } = useFilteredData();
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  useSyncFilters(columnFilters);

  const columns = useMemo<MRT_ColumnDef<LabTest>[]>(
    () => [
      {
        accessorKey: 'subjid',
        header: 'Subject',
        size: 100,
        filterVariant: 'multi-select',
        Cell: ({ cell }) => <ClickableSubjectCell subjectId={cell.getValue<string>()} />,
      },
      {
        accessorKey: 'lbtest',
        header: 'Test',
        size: 110,
        filterVariant: 'multi-select',
      },
      {
        accessorKey: 'lbstresn',
        header: 'Value',
        size: 80,
        filterVariant: 'range',
        Cell: ({ row }) => {
          const val = row.original.lbstresn;
          const hi = row.original.lbnrhi;
          const lo = row.original.lbnrlo;
          const abnormal = val > hi || val < lo;
          return <span className={abnormal ? 'text-amber-400 font-bold' : ''}>{val}</span>;
        },
      },
      {
        accessorKey: 'lbstresu',
        header: 'Unit',
        size: 70,
        enableColumnFilter: false,
      },
      {
        accessorKey: 'lbdy',
        header: 'Study Day',
        size: 100,
        filterVariant: 'range',
      },
      {
        id: 'normalRange',
        header: 'Normal Range',
        size: 120,
        enableColumnFilter: false,
        Cell: ({ row }) => (
          <span className="text-slate-400">
            {row.original.lbnrlo} – {row.original.lbnrhi}
          </span>
        ),
      },
      {
        id: 'flag',
        header: 'Flag',
        size: 80,
        filterVariant: 'multi-select',
        accessorFn: (row) => {
          if (row.lbstresn > row.lbnrhi) return 'HIGH';
          if (row.lbstresn < row.lbnrlo) return 'LOW';
          return 'NORMAL';
        },
        Cell: ({ cell }) => {
          const flag = cell.getValue<string>();
          if (flag === 'NORMAL') return <span className="text-slate-500">—</span>;
          return (
            <span className={flag === 'HIGH' ? 'text-red-400 font-semibold' : 'text-blue-400 font-semibold'}>
              {flag}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: labs,
    ...getSharedTableOptions<LabTest>(columnFilters, setColumnFilters),
  });

  return <MaterialReactTable table={table} />;
}
