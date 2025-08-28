import { cn } from "@/lib/utils";
import type { GLPFilters } from "./GLPDashboard";

interface BrazilHeatMapProps {
  filters: GLPFilters;
}

// Mock data for different regions of Brazil
const brazilRegions = [
  { name: "São Paulo", demand: 95, x: 45, y: 70 },
  { name: "Rio de Janeiro", demand: 85, x: 50, y: 65 },
  { name: "Minas Gerais", demand: 75, x: 45, y: 60 },
  { name: "Bahia", demand: 65, x: 42, y: 45 },
  { name: "Paraná", demand: 60, x: 42, y: 75 },
  { name: "Rio Grande do Sul", demand: 55, x: 38, y: 85 },
  { name: "Pernambuco", demand: 50, x: 45, y: 35 },
  { name: "Ceará", demand: 45, x: 40, y: 25 },
  { name: "Pará", demand: 40, x: 25, y: 20 },
  { name: "Santa Catarina", demand: 38, x: 40, y: 80 },
  { name: "Goiás", demand: 35, x: 35, y: 55 },
  { name: "Maranhão", demand: 30, x: 30, y: 25 },
  { name: "Paraíba", demand: 28, x: 47, y: 30 },
  { name: "Espírito Santo", demand: 25, x: 48, y: 62 },
  { name: "Alagoas", demand: 22, x: 47, y: 38 },
  { name: "Mato Grosso", demand: 20, x: 25, y: 50 },
  { name: "Rio Grande do Norte", demand: 18, x: 45, y: 28 },
  { name: "Piauí", demand: 15, x: 35, y: 30 },
  { name: "Mato Grosso do Sul", demand: 12, x: 30, y: 65 },
  { name: "Sergipe", demand: 10, x: 45, y: 40 },
  { name: "Rondônia", demand: 8, x: 15, y: 45 },
  { name: "Tocantins", demand: 6, x: 30, y: 40 },
  { name: "Acre", demand: 4, x: 8, y: 45 },
  { name: "Amapá", demand: 3, x: 25, y: 10 },
  { name: "Roraima", demand: 2, x: 15, y: 8 },
  { name: "Distrito Federal", demand: 25, x: 38, y: 52 }
];

const getHeatColor = (demand: number) => {
  if (demand >= 80) return "bg-glp-danger";
  if (demand >= 60) return "bg-glp-warning";
  if (demand >= 40) return "bg-glp-accent";
  if (demand >= 20) return "bg-glp-secondary";
  return "bg-glp-primary";
};

const getHeatIntensity = (demand: number) => {
  const intensity = Math.min(demand / 100, 1);
  return intensity;
};

export const BrazilHeatMap = ({ filters }: BrazilHeatMapProps) => {
  // Filter regions based on selected city
  const filteredRegions = filters.city && filters.city !== "all"
    ? brazilRegions.filter(region => 
        region.name.toLowerCase().includes(filters.city.toLowerCase())
      )
    : brazilRegions;

  // Apply other filters to adjust demand values (mock logic)
  const adjustedRegions = filteredRegions.map(region => {
    let adjustedDemand = region.demand;
    
    // Mock adjustments based on filters
    if (filters.month && filters.month !== "all") {
      // Seasonal adjustment
      const monthNum = parseInt(filters.month);
      if (monthNum >= 6 && monthNum <= 8) adjustedDemand *= 1.2; // Winter months
      else if (monthNum >= 12 || monthNum <= 2) adjustedDemand *= 0.9; // Summer months
    }
    
    if (filters.segment === "Indústria") adjustedDemand *= 1.3;
    else if (filters.segment === "Residencial") adjustedDemand *= 0.8;
    
    if (filters.bottleType === "P13") adjustedDemand *= 1.1;
    else if (filters.bottleType === "Granel") adjustedDemand *= 1.4;
    
    return { ...region, demand: Math.min(adjustedDemand, 100) };
  });

  const maxDemand = Math.max(...adjustedRegions.map(r => r.demand));
  const avgDemand = adjustedRegions.reduce((sum, r) => sum + r.demand, 0) / adjustedRegions.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-glp-dark">Mapa de Calor - Demanda de GLP</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Máxima:</span>
            <span className="font-medium text-glp-danger">{maxDemand.toFixed(1)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Média:</span>
            <span className="font-medium text-glp-primary">{avgDemand.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Brazil Map Visualization */}
      <div className="relative bg-glp-neutral/30 rounded-lg p-4" style={{ height: "400px" }}>
        <div className="relative w-full h-full">
          {/* Brazil outline (simplified) */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
          >
            <path
              d="M 20 15 Q 25 10 35 12 Q 45 8 55 15 Q 60 20 58 30 Q 62 35 60 45 Q 65 50 60 60 Q 58 70 50 75 Q 45 80 35 85 Q 25 88 15 85 Q 10 80 8 70 Q 5 60 8 50 Q 6 40 10 30 Q 12 20 20 15 Z"
              fill="hsl(var(--glp-neutral))"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
            />
          </svg>

          {/* Heat points */}
          {adjustedRegions.map((region) => (
            <div
              key={region.name}
              className={cn(
                "absolute w-3 h-3 rounded-full cursor-pointer transition-all hover:scale-150 hover:z-10",
                getHeatColor(region.demand)
              )}
              style={{
                left: `${region.x}%`,
                top: `${region.y}%`,
                opacity: 0.3 + (getHeatIntensity(region.demand) * 0.7),
                transform: "translate(-50%, -50%)"
              }}
              title={`${region.name}: ${region.demand.toFixed(1)}% demanda`}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-glp-primary opacity-60" />
          <span>Baixa (0-20%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-glp-secondary opacity-70" />
          <span>Moderada (20-40%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-glp-accent opacity-80" />
          <span>Média (40-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-glp-warning opacity-90" />
          <span>Alta (60-80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-glp-danger" />
          <span>Muito Alta (80-100%)</span>
        </div>
      </div>

      {filteredRegions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhuma região encontrada com os filtros aplicados</p>
        </div>
      )}
    </div>
  );
};