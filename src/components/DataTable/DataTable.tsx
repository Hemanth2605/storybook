import { useMemo, useState, type ReactNode } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export interface Column<Row> {
  /** Unique key; also used as the sort field when the row value is primitive. */
  id: keyof Row & string;
  label: string;
  align?: 'left' | 'right' | 'center';
  /** Custom cell renderer; defaults to the raw row value. */
  render?: (row: Row) => ReactNode;
  /** Enable click-to-sort on this column. Default true. */
  sortable?: boolean;
}

export interface DataTableProps<Row> {
  columns: Column<Row>[];
  rows: Row[];
  /** Field to extract a stable React key from each row. */
  getRowId: (row: Row) => string | number;
  /** Called when a row is clicked. */
  onRowClick?: (row: Row) => void;
  /** Message shown when there are no rows. */
  emptyMessage?: string;
  /** Renders a compact (denser) table. */
  dense?: boolean;
}

type Order = 'asc' | 'desc';

/**
 * Generic, client-sorted data table built on MUI v7 Table primitives.
 * Accepts a column config and an array of rows of any shape.
 */
export function DataTable<Row>({
  columns,
  rows,
  getRowId,
  onRowClick,
  emptyMessage = 'No data to display.',
  dense = false,
}: DataTableProps<Row>) {
  const [orderBy, setOrderBy] = useState<keyof Row | null>(null);
  const [order, setOrder] = useState<Order>('asc');

  const handleSort = (id: keyof Row) => {
    if (orderBy === id) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setOrderBy(id);
      setOrder('asc');
    }
  };

  const sortedRows = useMemo(() => {
    if (!orderBy) return rows;
    const factor = order === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = a[orderBy];
      const bv = b[orderBy];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return -1 * factor;
      if (av > bv) return 1 * factor;
      return 0;
    });
  }, [rows, orderBy, order]);

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size={dense ? 'small' : 'medium'}>
        <TableHead>
          <TableRow>
            {columns.map((col) => {
              const sortable = col.sortable !== false;
              return (
                <TableCell
                  key={col.id}
                  align={col.align ?? 'left'}
                  sortDirection={orderBy === col.id ? order : false}
                  sx={{ fontWeight: 600, bgcolor: 'action.hover' }}
                >
                  {sortable ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : 'asc'}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                  {emptyMessage}
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            sortedRows.map((row) => (
              <TableRow
                key={getRowId(row)}
                hover={!!onRowClick}
                onClick={() => onRowClick?.(row)}
                sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col) => (
                  <TableCell key={col.id} align={col.align ?? 'left'}>
                    {col.render ? col.render(row) : (row[col.id] as ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataTable;
