import { Hotel, Car, UtensilsCrossed, Wallet2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatINR } from "@/lib/utils";
import type { CostEstimate } from "@/types";

interface BudgetBreakdownProps {
  cost: CostEstimate;
}

export function BudgetBreakdown({ cost }: BudgetBreakdownProps) {
  const budgetLeft = cost.budget_provided - cost.total_estimated;
  const leftover = Math.abs(budgetLeft);

  const lines = [
    { icon: <Hotel size={16} />, label: "Accommodation", amount: cost.hotel, color: "bg-info" },
    { icon: <Car size={16} />, label: "Transport", amount: cost.transport, color: "bg-accent" },
    { icon: <UtensilsCrossed size={16} />, label: "Food & dining", amount: cost.food, color: "bg-warning" },
  ];

  return (
    <Card className="space-y-4">
      <h3 className="text-base font-bold text-ink">Budget breakdown</h3>

      <div className="space-y-3">
        {lines.map((line) => {
          const pct = Math.round((line.amount / cost.total_estimated) * 100);
          return (
            <div key={line.label}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-medium text-body">
                  <span className={`flex size-7 items-center justify-center rounded-full text-white ${line.color}`}>
                    {line.icon}
                  </span>
                  {line.label}
                </span>
                <span className="font-bold text-ink">{formatINR(line.amount)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-pill bg-line">
                <div
                  className={`h-full rounded-pill ${line.color} transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-line/60 p-3">
        <span className="flex items-center gap-2 text-sm font-bold text-ink">
          <Wallet2 size={16} className="text-primary" /> Total estimated
        </span>
        <span className="text-base font-extrabold text-ink">{formatINR(cost.total_estimated)}</span>
      </div>

      <div
        className={`flex items-center justify-between rounded-2xl p-3 ${
          cost.within_budget ? "bg-success-light" : "bg-warning-light"
        }`}
      >
        <span className={`text-sm font-bold ${cost.within_budget ? "text-success" : "text-warning"}`}>
          {cost.within_budget ? "Budget remaining" : "Over budget by"}
        </span>
        <span className={`text-base font-extrabold ${cost.within_budget ? "text-success" : "text-warning"}`}>
          {formatINR(leftover)}
        </span>
      </div>
    </Card>
  );
}
