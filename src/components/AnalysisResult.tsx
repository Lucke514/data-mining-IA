import React from 'react';

interface AnalysisResultProps {
  analysis: string;
}

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  if (!analysis) return null;

  return (
    <div className="bg-purple-50 p-6 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Análisis de IA</h2>
      <p className="whitespace-pre-wrap">{analysis}</p>
    </div>
  );
}