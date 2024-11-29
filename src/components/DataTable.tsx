import React from 'react';
import type { CSVData } from '../lib/types';

interface DataTableProps {
  data: CSVData[];
}

export function DataTable({ data }: DataTableProps) {
  if (!data.length) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Datos CSV</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              {Object.keys(data[0]).map((header) => (
                <th key={header} className="px-4 py-2 border-b bg-gray-50">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-2 border-b">{String(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}