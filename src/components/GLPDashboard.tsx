import { useState } from "react";
import { Card } from "@/components/ui/card";
import { GLPFilters } from "./GLPFilters";
import { BudgetInput } from "./BudgetInput";
import { MonthlyBudgetTable } from "./MonthlyBudgetTable";
import { SegmentList } from "./SegmentList";
import { BrazilHeatMap } from "./BrazilHeatMap";

export interface GLPFilters {
  month: string;
  segment: string;
  bottleType: string;
  city: string;
}

export interface MonthlyBudget {
  month: string;
  amount: number;
  percentage: number;
}

const GLPDashboard = () => {
  const [filters, setFilters] = useState<GLPFilters>({
    month: "",
    segment: "",
    bottleType: "",
    city: ""
  });

  const [annualBudget, setAnnualBudget] = useState<number>(0);
  const [monthlyBudgets, setMonthlyBudgets] = useState<MonthlyBudget[]>([
    { month: "Jan", amount: 0, percentage: 8.33 },
    { month: "Fev", amount: 0, percentage: 8.33 },
    { month: "Mar", amount: 0, percentage: 8.33 },
    { month: "Abr", amount: 0, percentage: 8.33 },
    { month: "Mai", amount: 0, percentage: 8.33 },
    { month: "Jun", amount: 0, percentage: 8.33 },
    { month: "Jul", amount: 0, percentage: 8.33 },
    { month: "Ago", amount: 0, percentage: 8.33 },
    { month: "Set", amount: 0, percentage: 8.33 },
    { month: "Out", amount: 0, percentage: 8.33 },
    { month: "Nov", amount: 0, percentage: 8.33 },
    { month: "Dez", amount: 0, percentage: 8.33 }
  ]);

  const handleFiltersChange = (newFilters: GLPFilters) => {
    setFilters(newFilters);
  };

  const handleBudgetChange = (budget: number) => {
    setAnnualBudget(budget);
    // Update monthly amounts based on percentages
    setMonthlyBudgets(prev => 
      prev.map(month => ({
        ...month,
        amount: (budget * month.percentage) / 100
      }))
    );
  };

  const handleMonthlyBudgetChange = (monthIndex: number, percentage: number) => {
    setMonthlyBudgets(prev => {
      const newBudgets = [...prev];
      newBudgets[monthIndex] = {
        ...newBudgets[monthIndex],
        percentage,
        amount: (annualBudget * percentage) / 100
      };
      return newBudgets;
    });
  };

  const handleMonthClick = (month: string) => {
    setFilters(prev => ({ ...prev, month }));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-glp-dark mb-2">
            O mapa do tesouro
          </h1>
          <p className="text-muted-foreground">
            Dashboard de demanda de GLP no Brasil
          </p>
        </div>

        {/* Global Filters */}
        <Card className="p-6">
          <GLPFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </Card>

        {/* Budget Input */}
        <Card className="p-6">
          <BudgetInput value={annualBudget} onChange={handleBudgetChange} />
        </Card>

        {/* Monthly Budget Distribution Table */}
        <Card className="p-6">
          <MonthlyBudgetTable
            budgets={monthlyBudgets}
            onBudgetChange={handleMonthlyBudgetChange}
            onMonthClick={handleMonthClick}
            selectedMonth={filters.month}
          />
        </Card>

        {/* Bottom Section - Segments and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <SegmentList
              annualBudget={annualBudget}
              filters={filters}
            />
          </Card>
          
          <Card className="p-6">
            <BrazilHeatMap filters={filters} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GLPDashboard;