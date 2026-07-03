import { TrendBars } from "./ExecutiveDashboardPrimitives";
import type { ExecutiveDashboardData } from "../types/executiveDashboard.types";
import { formatCurrency } from "../utils/formatters";

export default function FinancialHrCrossover({ data }: { data: ExecutiveDashboardData }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h3 className="panel-title">Financial-HR Crossover</h3>
        <button className="panel-action" type="button">Export Excel</button>
      </div>
      <div className="panel-body section-stack">
        <div className="note">
          Revenue per employee is {formatCurrency(data.financialHr.revenuePerEmployee)}. Weighted metrics are prepared for multi-branch comparison as more branches are added.
        </div>
        <div className="grid-2col">
          <div>
            <div className="eyebrow">Cost per hire trend</div>
            <TrendBars points={data.financialHr.costPerHireTrend} suffix="K" />
          </div>
          <div>
            <div className="eyebrow">L&D spend vs retention</div>
            <TrendBars points={data.financialHr.trainingRetention} suffix="%" />
          </div>
        </div>
      </div>
    </section>
  );
}
