import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <Card className="flex flex-col items-center gap-1 p-3 text-center">
      <div className="flex size-8 items-center justify-center rounded-full bg-primary-light text-primary">
        {icon}
      </div>
      <p className="truncate text-sm font-extrabold text-ink">{value}</p>
      <p className="text-[11px] text-muted">{label}</p>
    </Card>
  );
}
