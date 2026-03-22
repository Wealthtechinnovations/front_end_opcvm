import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const DataTable = ({
  columns,
  data,
  loading = false,
  emptyMessage = 'Aucune donnée disponible',
  striped = true,
  hover = true,
  responsive = true,
  onRowClick,
  className = '',
}) => {
  if (loading) return <LoadingSpinner />;

  const tableClass = `table ${striped ? 'table-striped' : ''} ${hover ? 'table-hover' : ''} ${className}`;

  const content = (
    <table className={tableClass}>
      <thead className="table-dark">
        <tr>
          {columns.map((col, i) => (
            <th key={i} style={col.style}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="text-center text-muted py-4">
              {emptyMessage}
            </td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              style={onRowClick ? { cursor: 'pointer' } : {}}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex} style={col.cellStyle}>
                  {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  return responsive ? <div className="table-responsive">{content}</div> : content;
};

export default DataTable;
