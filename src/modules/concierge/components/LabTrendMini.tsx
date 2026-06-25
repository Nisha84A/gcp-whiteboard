import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer } from 'recharts';

interface DataPoint {
  day: string;
  value: number;
}

interface Props {
  data: DataPoint[];
  uln: number;
  title: string;
}

function CustomDot(props: any) {
  const { cx, cy, payload } = props;
  const isAboveUln = payload.value > props.uln;
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill={isAboveUln ? '#dc2626' : '#b45309'} stroke="#1a2744" strokeWidth={2} />
      <text x={cx} y={cy - 12} textAnchor="middle" fill={isAboveUln ? '#fca5a5' : '#fcd34d'} fontSize={10} fontWeight="bold">
        {payload.value}
      </text>
    </g>
  );
}

export default function LabTrendMini({ data, uln, title }: Props) {
  const maxValue = Math.max(...data.map((d) => d.value), uln + 20);

  return (
    <div>
      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-2">{title}</p>
      <div className="h-28 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
            <XAxis
              dataKey="day"
              stroke="#64748b"
              fontSize={9}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              hide
              domain={[0, maxValue]}
            />
            <ReferenceLine
              y={uln}
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={1}
              label={{ value: 'ULN', fill: '#ef4444', fontSize: 8, position: 'right' }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#ef4444"
              strokeWidth={2}
              dot={<CustomDot uln={uln} />}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
