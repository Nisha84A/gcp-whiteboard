import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFilteredData } from '@/hooks/useFilteredData';

export default function AESummaryChart() {
  const { ae } = useFilteredData();

  const data = useMemo(() => {
    const termCounts: Record<string, { term: string; MILD: number; MODERATE: number; SEVERE: number }> = {};
    ae.forEach((event) => {
      if (!termCounts[event.aeterm]) {
        termCounts[event.aeterm] = { term: event.aeterm, MILD: 0, MODERATE: 0, SEVERE: 0 };
      }
      const sev = event.aesev as 'MILD' | 'MODERATE' | 'SEVERE';
      if (termCounts[event.aeterm][sev] !== undefined) {
        termCounts[event.aeterm][sev]++;
      }
    });
    return Object.values(termCounts).sort((a, b) => (b.MILD + b.MODERATE + b.SEVERE) - (a.MILD + a.MODERATE + a.SEVERE));
  }, [ae]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 30, right: 20, left: 10, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          type="number"
          stroke="#94a3b8"
          fontSize={10}
          tickMargin={4}
          allowDecimals={false}
          label={{ value: 'Count', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 10 }}
        />
        <YAxis dataKey="term" type="category" stroke="#94a3b8" fontSize={10} width={80} tickMargin={4} />
        <Tooltip
          contentStyle={{ background: '#1a2744', border: '1px solid #334155', borderRadius: 6 }}
          labelStyle={{ color: '#f1f5f9' }}
        />
        <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: 10, paddingBottom: 8 }} />
        <Bar dataKey="MILD" stackId="a" fill="#10b981" />
        <Bar dataKey="MODERATE" stackId="a" fill="#f59e0b" />
        <Bar dataKey="SEVERE" stackId="a" fill="#ef4444" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
