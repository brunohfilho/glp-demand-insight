import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { GLPFilters } from "./GLPDashboard";

interface SegmentListProps {
  annualBudget: number;
  filters: GLPFilters;
}

// Mock data for segment distribution
const segmentData = [
  { name: "Indústria", percentage: 35, color: "bg-glp-primary" },
  { name: "Comércio", percentage: 25, color: "bg-glp-secondary" },
  { name: "Serviços", percentage: 20, color: "bg-glp-accent" },
  { name: "Agronegócio", percentage: 12, color: "bg-glp-success" },
  { name: "Órgão Público", percentage: 5, color: "bg-glp-warning" },
  { name: "Condomínio", percentage: 3, color: "bg-glp-danger" }
];

export const SegmentList = ({ annualBudget, filters }: SegmentListProps) => {
  // Filter data based on selected segment
  const filteredData = filters.segment && filters.segment !== "all"
    ? segmentData.filter(segment => segment.name === filters.segment)
    : segmentData;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-glp-dark">Distribuição por Segmento</h3>
      
      <div className="space-y-4">
        {filteredData.map((segment) => {
          const amount = (annualBudget * segment.percentage) / 100;
          
          return (
            <div key={segment.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("w-3 h-3 rounded-full", segment.color)} />
                  <span className="font-medium text-sm">{segment.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-glp-dark">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(amount)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {segment.percentage}% da verba
                  </div>
                </div>
              </div>
              
              <Progress 
                value={segment.percentage} 
                className="h-2"
              />
            </div>
          );
        })}
      </div>
      
      {filteredData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum segmento encontrado com os filtros aplicados</p>
        </div>
      )}
      
      {annualBudget === 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          <p>Defina a verba anual para ver os valores por segmento</p>
        </div>
      )}
    </div>
  );
};