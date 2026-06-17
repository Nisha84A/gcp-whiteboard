import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useFilteredData } from '@/hooks/useFilteredData';

const SEVERITY_COLORS: Record<string, string> = {
  MILD: '#f59e0b',
  MODERATE: '#f97316',
  SEVERE: '#ef4444',
};

export default function AETimelineChart() {
  const { ae } = useFilteredData();

  const data = useMemo(() => {
    return ae.map((event, idx) => ({
      id: idx,
      subject: event.subjid,
      start: event.aestdy,
      duration: event.aeendy - event.aestdy,
      severity: event.aesev,
      term: event.aeterm,
    }));
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
          label={{ value: 'Study Day', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 10 }}
        />
        <YAxis dataKey="subject" type="category" stroke="#94a3b8" fontSize={9} width={70} tickMargin={4} />
        <Tooltip
          contentStyle={{ background: '#1a2744', border: '1px solid #334155', borderRadius: 6 }}
          labelStyle={{ color: '#f1f5f9' }}
          formatter={(value: number, name: string, props: any) => {
            if (name === 'duration') return [`${value} days (${props.payload.term})`, 'Duration'];
            return [value, name];
          }}
        />
        <Legend
          verticalAlign="top"
          align="center"
          wrapperStyle={{ fontSize: 10, paddingBottom: 8 }}
          payload={[
            { value: 'MILD', type: 'square', color: SEVERITY_COLORS.MILD },
            { value: 'MODERATE', type: 'square', color: SEVERITY_COLORS.MODERATE },
            { value: 'SEVERE', type: 'square', color: SEVERITY_COLORS.SEVERE },
          ]}
        />
        <Bar dataKey="start" stackId="a" fill="transparent" />
        <Bar dataKey="duration" stackId="a" radius={[0, 4, 4, 0]}>
          {data.map((entry, index) => (
            <Cell key={index} fill={SEVERITY_COLORS[entry.severity] || '#64748b'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
