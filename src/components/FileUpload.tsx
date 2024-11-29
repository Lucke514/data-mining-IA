import React, { useState, useCallback } from 'react';
import type { CSVData } from '../lib/types';
import { parseCSV, prepareDataForAnalysis } from '../lib/csvUtils';
import { DataTable } from './DataTable';
import { AnalysisResult } from './AnalysisResult';

export function FileUpload() {
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const analyzeCSVData = async (preparedData: string) => {
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ csvData: preparedData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al analizar los datos');
      }

      const data = await response.json();
      return data.analysis;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Error al analizar los datos');
    }
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setError('Por favor, selecciona un archivo CSV');
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Por favor, selecciona un archivo CSV válido');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setAnalysis('');
      setCsvData([]);
      
      const parsedData = await parseCSV(file);
      if (!parsedData || parsedData.length === 0) {
        throw new Error('No se encontraron datos válidos en el archivo CSV');
      }
      
      setCsvData(parsedData);
      
      const preparedData = prepareDataForAnalysis(parsedData);
      const analysisResult = await analyzeCSVData(preparedData);
      setAnalysis(analysisResult);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar el archivo';
      setError(errorMessage);
      console.error('Error:', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setError('');
    setAnalysis('');
    setCsvData([]);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <label className="block text-lg font-medium mb-2">Subir archivo CSV</label>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-50 file:text-purple-700
              hover:file:bg-purple-100"
          />
          {(csvData.length > 0 || error || analysis) && (
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-2">Analizando datos...</p>
        </div>
      )}

      <DataTable data={csvData} />
      <AnalysisResult analysis={analysis} />
    </div>
  );
}