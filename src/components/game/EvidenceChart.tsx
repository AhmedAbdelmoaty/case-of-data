import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EvidenceData } from "@/lib/pf-case/evidence-catalog";

interface EvidenceChartProps {
  evidence: EvidenceData;
}

const COLORS = {
  primary: "hsl(var(--primary))",
  accent: "hsl(var(--accent))",
  muted: "hsl(var(--muted-foreground))",
};

export const EvidenceChart = ({ evidence }: EvidenceChartProps) => {
  return (
    <motion.div
      className="my-3 rounded-xl border border-primary/30 bg-background/70 backdrop-blur-md p-4"
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      dir="rtl"
    >
      <div className="mb-2">
        <h4 className="text-sm font-bold text-primary">{evidence.title}</h4>
        {evidence.caption && (
          <p className="text-xs text-muted-foreground mt-0.5">{evidence.caption}</p>
        )}
      </div>

      {evidence.type === "bar" && (
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={evidence.rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: COLORS.muted }} />
              <YAxis tick={{ fontSize: 10, fill: COLORS.muted }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {evidence.rows.map((_, i) => (
                  <Cell key={i} fill={i === evidence.rows.length - 1 ? COLORS.accent : COLORS.primary} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {evidence.type === "stacked_bar" && (
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={evidence.rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: COLORS.muted }} />
              <YAxis tick={{ fontSize: 10, fill: COLORS.muted }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="individuals" name="أفراد" stackId="a" fill={COLORS.primary} radius={[0, 0, 0, 0]} />
              <Bar dataKey="corporate" name="شركات" stackId="a" fill={COLORS.accent} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {evidence.type === "line" && (
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={evidence.rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: COLORS.muted }} />
              <YAxis tick={{ fontSize: 10, fill: COLORS.muted }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  fontSize: 12,
                }}
              />
              <Line type="monotone" dataKey="value" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {evidence.type === "table" && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                {evidence.headers?.map((h) => (
                  <th key={h} className="text-right py-2 px-2 text-muted-foreground font-bold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {evidence.rows.map((row, i) => (
                <tr key={i} className="border-b border-border/40">
                  {row.cells?.map((c, j) => (
                    <td key={j} className={`py-2 px-2 ${j === 0 ? "text-foreground font-bold" : "text-foreground"}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {evidence.type === "list" && (
        <ul className="space-y-1.5">
          {evidence.rows.map((row, i) => (
            <li key={i} className="text-xs text-foreground flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{row.label}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
};
