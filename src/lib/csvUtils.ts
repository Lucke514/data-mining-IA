import Papa from 'papaparse';
import type { CSVData } from './types';

export function parseCSV(file: File): Promise<CSVData[]> {
  if (!file) {
    return Promise.reject(new Error('No se ha proporcionado ningún archivo'));
  }

  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('Error al procesar el archivo CSV: ' + results.errors[0].message));
          return;
        }

        const cleanData = results.data
          .filter((row: any) => 
            row && 
            typeof row === 'object' && 
            Object.values(row).some(value => value !== null && value !== undefined && value !== '')
          )
          .map((row: any) => {
            const cleanRow: CSVData = {};
            Object.entries(row).forEach(([key, value]) => {
              cleanRow[key] = value !== null && value !== undefined ? String(value).trim() : '';
            });
            return cleanRow;
          });

        if (cleanData.length === 0) {
          reject(new Error('El archivo CSV no contiene datos válidos'));
          return;
        }

        resolve(cleanData);
      },
      error: (error) => reject(new Error('Error al leer el archivo CSV: ' + error.message))
    });
  });
}

export function prepareDataForAnalysis(data: CSVData[]): string {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('No hay datos para preparar');
  }

  return data
    .map(row => {
      if (!row || typeof row !== 'object') {
        return '';
      }
      return Object.entries(row)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '')
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
    })
    .filter(row => row !== '')
    .join('\n');
}