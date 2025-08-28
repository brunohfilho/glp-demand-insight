import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { MonthlyBudget } from "./GLPDashboard";

interface MonthlyBudgetTableProps {
  budgets: MonthlyBudget[];
  onBudgetChange: (monthIndex: number, percentage: number) => void;
  onMonthClick: (month: string) => void;
  selectedMonth: string;
}

const monthMapping: { [key: string]: string } = {
  "Jan": "01",
  "Fev": "02", 
  "Mar": "03",
  "Abr": "04",
  "Mai": "05",
  "Jun": "06",
  "Jul": "07",
  "Ago": "08",
  "Set": "09",
  "Out": "10",
  "Nov": "11",
  "Dez": "12"
};

export const MonthlyBudgetTable = ({
  budgets,
  onBudgetChange,
  onMonthClick,
  selectedMonth
}: MonthlyBudgetTableProps) => {
  const handlePercentageChange = (monthIndex: number, value: string) => {
    const percentage = parseFloat(value) || 0;
    onBudgetChange(monthIndex, percentage);
  };

  const totalPercentage = budgets.reduce((sum, budget) => sum + budget.percentage, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-glp-dark">Distribuição de Verba por Mês</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Total:</span>
          <span className={cn(
            "text-sm font-medium px-2 py-1 rounded",
            Math.abs(totalPercentage - 100) < 0.01 
              ? "bg-glp-success/10 text-glp-success" 
              : "bg-glp-warning/10 text-glp-warning"
          )}>
            {totalPercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Header Row */}
          <thead>
            <tr>
              {budgets.map((budget, index) => (
                <th
                  key={budget.month}
                  className={cn(
                    "p-3 text-center border border-border cursor-pointer transition-colors",
                    "hover:bg-muted/50",
                    selectedMonth === monthMapping[budget.month] 
                      ? "bg-glp-primary text-glp-primary-foreground" 
                      : "bg-muted/20"
                  )}
                  onClick={() => onMonthClick(monthMapping[budget.month])}
                >
                  <div className="font-medium">{budget.month}</div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Values Row */}
          <tbody>
            <tr>
              {budgets.map((budget, index) => (
                <td 
                  key={`${budget.month}-value`}
                  className={cn(
                    "p-3 border border-border text-center",
                    selectedMonth === monthMapping[budget.month] 
                      ? "bg-glp-primary/5" 
                      : ""
                  )}
                >
                  <div className="space-y-2">
                    {/* Amount in R$ */}
                    <div className="text-sm font-medium text-glp-primary">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(budget.amount)}
                    </div>
                    
                    {/* Percentage Input */}
                    <div className="flex items-center justify-center">
                      <Input
                        type="number"
                        value={budget.percentage.toFixed(1)}
                        onChange={(e) => handlePercentageChange(index, e.target.value)}
                        className="w-16 h-8 text-xs text-center p-1"
                        step="0.1"
                        min="0"
                        max="100"
                      />
                      <span className="text-xs text-muted-foreground ml-1">%</span>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Clique em um mês para filtrar os gráficos abaixo
      </div>
    </div>
  );
};