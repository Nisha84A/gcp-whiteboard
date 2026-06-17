import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useFilteredData } from '@/hooks/useFilteredData';

const SUBJECT_COLORS = ['#22d3ee', '#14b8a6', '#a78bfa', '#fb923c', '#f472b6', '#34d399', '#fbbf24', '#60a5fa'];

export default function LabTrendChart() {
  const { labs } = useFilteredData();

  const { chartData, subjects, refHi, refLo } = useMemo(() => {
    const altLabs = labs.filter((l) => l.lbtest === 'ALT');
    const subjects = Array.from(new Set(altLabs.map((l) => l.subjid)));
    const days = Array.from(new Set(altLabs.map((l) => l.lbdy))).sort((a, b) => a - b);

    const refHi = altLabs[0]?.lbnrhi || 40;
    const refLo = altLabs[0]?.lbnrlo || 10;

    const chartData = days.map((day) => {
      const point: Record<string, number> = { day };
      subjects.forEach((subj) => {
        const match = altLabs.find((l) => l.subjid === subj && l.lbdy === day);
        if (match) point[subj] = match.lbstresn;
      });
      return point;
    });

    return { chartData, subjects, refHi, refLo };
  }, [labs]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 30, right: 20, left: 45, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="day"
          stroke="#94a3b8"
          fontSize={10}
          tickMargin={4}
          label={{ value: 'Study Day', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 10 }}
        />
        <YAxis
          stroke="#94a3b8"
          fontSize={10}
          tickMargin={4}
          label={{ value: 'ALT (U/L)', angle: -90, position: 'insideLeft', offset: -30, fill: '#94a3b8', fontSize: 10 }}
        />
        <Tooltip
          contentStyle={{ background: '#1a2744', border: '1px solid #334155', borderRadius: 6 }}
          labelStyle={{ color: '#f1f5f9' }}
          labelFormatter={(val) => `Day ${val}`}
        />
        <Legend verticalAlign="top" align="center" wrapperStyle={{ fontSize: 10, paddingBottom: 8 }} />
        <ReferenceLine y={refHi} stroke="#ef4444" strokeDasharray="5 5" label={{ value: 'ULN', fill: '#ef4444', fontSize: 9, position: 'right' }} />
        <ReferenceLine y={refLo} stroke="#64748b" strokeDasharray="5 5" label={{ value: 'LLN', fill: '#64748b', fontSize: 9, position: 'right' }} />
        {subjects.map((subj, idx) => (
          <Line
            key={subj}
            type="monotone"
            dataKey={subj}
            stroke={SUBJECT_COLORS[idx % SUBJECT_COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
            connectNulls
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
