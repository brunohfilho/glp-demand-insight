import { cn } from "@/lib/utils";
import type { GLPFilters } from "./GLPDashboard";

interface BrazilHeatMapProps {
  filters: GLPFilters;
}

// Mock data for Brazilian states with realistic GLP demand
const brazilStates = [
  { name: "São Paulo", code: "SP", demand: 95 },
  { name: "Rio de Janeiro", code: "RJ", demand: 85 },
  { name: "Minas Gerais", code: "MG", demand: 78 },
  { name: "Bahia", code: "BA", demand: 65 },
  { name: "Paraná", code: "PR", demand: 72 },
  { name: "Rio Grande do Sul", code: "RS", demand: 68 },
  { name: "Pernambuco", code: "PE", demand: 58 },
  { name: "Ceará", code: "CE", demand: 52 },
  { name: "Pará", code: "PA", demand: 42 },
  { name: "Santa Catarina", code: "SC", demand: 64 },
  { name: "Goiás", code: "GO", demand: 48 },
  { name: "Maranhão", code: "MA", demand: 35 },
  { name: "Paraíba", code: "PB", demand: 38 },
  { name: "Espírito Santo", code: "ES", demand: 55 },
  { name: "Alagoas", code: "AL", demand: 32 },
  { name: "Mato Grosso", code: "MT", demand: 45 },
  { name: "Rio Grande do Norte", code: "RN", demand: 40 },
  { name: "Piauí", code: "PI", demand: 28 },
  { name: "Mato Grosso do Sul", code: "MS", demand: 38 },
  { name: "Sergipe", code: "SE", demand: 25 },
  { name: "Rondônia", code: "RO", demand: 22 },
  { name: "Tocantins", code: "TO", demand: 18 },
  { name: "Acre", code: "AC", demand: 12 },
  { name: "Amapá", code: "AP", demand: 8 },
  { name: "Roraima", code: "RR", demand: 6 },
  { name: "Distrito Federal", code: "DF", demand: 60 }
];

const getHeatColor = (demand: number) => {
  if (demand >= 80) return "#ff6b35"; // orange
  if (demand >= 60) return "#4ecdc4"; // teal/green
  if (demand >= 40) return "#2c3e50"; // dark gray
  if (demand >= 20) return "#95a5a6"; // light gray
  return "#ecf0f1"; // very light gray
};

const getHeatOpacity = (demand: number) => {
  return 0.4 + (demand / 100) * 0.6; // Entre 0.4 e 1.0
};

export const BrazilHeatMap = ({ filters }: BrazilHeatMapProps) => {
  // Filter states based on selected city
  const filteredStates = filters.city && filters.city !== "all"
    ? brazilStates.filter(state => 
        state.name.toLowerCase().includes(filters.city.toLowerCase())
      )
    : brazilStates;

  // Apply other filters to adjust demand values (mock logic)
  const adjustedStates = filteredStates.map(state => {
    let adjustedDemand = state.demand;
    
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
    
    return { ...state, demand: Math.min(adjustedDemand, 100) };
  });

  const maxDemand = Math.max(...adjustedStates.map(s => s.demand));
  const avgDemand = adjustedStates.reduce((sum, s) => sum + s.demand, 0) / adjustedStates.length;

  // Create a map for quick lookup of state demand values
  const stateDataMap = new Map(adjustedStates.map(state => [state.code, state]));

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
      <div className="relative bg-glp-neutral/30 rounded-lg p-4" style={{ height: "500px" }}>
        <div className="relative w-full h-full">
          <svg
            viewBox="0 0 1000 700"
            className="absolute inset-0 w-full h-full"
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
          >
            {/* Roraima */}
            <path
              d="M250 50 L280 40 L320 60 L310 90 L280 100 L250 85 Z"
              fill={getHeatColor(stateDataMap.get("RR")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("RR")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />
            
            {/* Amapá */}
            <path
              d="M350 80 L380 70 L400 90 L390 120 L360 125 L340 110 Z"
              fill={getHeatColor(stateDataMap.get("AP")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("AP")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Amazonas */}
            <path
              d="M80 120 L250 110 L280 140 L270 200 L220 220 L150 240 L80 200 Z"
              fill={getHeatColor(stateDataMap.get("AM")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("AM")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Pará */}
            <path
              d="M280 140 L400 130 L420 180 L400 220 L350 240 L280 220 L270 200 Z"
              fill={getHeatColor(stateDataMap.get("PA")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("PA")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Acre */}
            <path
              d="M80 220 L150 240 L140 280 L100 290 L80 260 Z"
              fill={getHeatColor(stateDataMap.get("AC")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("AC")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Rondônia */}
            <path
              d="M150 240 L220 220 L240 260 L200 280 L150 270 Z"
              fill={getHeatColor(stateDataMap.get("RO")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("RO")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Mato Grosso */}
            <path
              d="M240 260 L350 240 L380 280 L360 340 L300 350 L240 320 Z"
              fill={getHeatColor(stateDataMap.get("MT")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("MT")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Tocantins */}
            <path
              d="M380 280 L450 270 L470 320 L450 360 L420 370 L380 340 Z"
              fill={getHeatColor(stateDataMap.get("TO")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("TO")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Maranhão */}
            <path
              d="M420 220 L500 210 L520 250 L500 280 L470 290 L450 270 L420 240 Z"
              fill={getHeatColor(stateDataMap.get("MA")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("MA")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Piauí */}
            <path
              d="M470 290 L520 280 L540 320 L520 350 L490 360 L470 340 Z"
              fill={getHeatColor(stateDataMap.get("PI")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("PI")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Ceará */}
            <path
              d="M520 250 L580 240 L600 270 L580 300 L550 310 L520 290 Z"
              fill={getHeatColor(stateDataMap.get("CE")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("CE")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Rio Grande do Norte */}
            <path
              d="M580 270 L620 260 L640 290 L620 310 L590 315 L580 300 Z"
              fill={getHeatColor(stateDataMap.get("RN")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("RN")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Paraíba */}
            <path
              d="M620 310 L640 330 L620 350 L600 355 L590 340 L600 320 Z"
              fill={getHeatColor(stateDataMap.get("PB")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("PB")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Pernambuco */}
            <path
              d="M540 320 L600 320 L620 360 L580 380 L540 370 L520 350 Z"
              fill={getHeatColor(stateDataMap.get("PE")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("PE")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Alagoas */}
            <path
              d="M580 380 L610 390 L600 410 L580 415 L570 400 Z"
              fill={getHeatColor(stateDataMap.get("AL")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("AL")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Sergipe */}
            <path
              d="M570 400 L590 420 L580 440 L560 435 L555 415 Z"
              fill={getHeatColor(stateDataMap.get("SE")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("SE")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Bahia */}
            <path
              d="M490 360 L580 350 L600 420 L580 480 L520 500 L480 480 L460 420 Z"
              fill={getHeatColor(stateDataMap.get("BA")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("BA")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Goiás */}
            <path
              d="M420 370 L490 360 L510 420 L480 460 L430 470 L400 440 Z"
              fill={getHeatColor(stateDataMap.get("GO")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("GO")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Distrito Federal */}
            <path
              d="M450 430 L470 425 L475 440 L465 450 L450 445 Z"
              fill={getHeatColor(stateDataMap.get("DF")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("DF")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Minas Gerais */}
            <path
              d="M480 460 L580 450 L620 500 L580 540 L520 550 L480 530 L450 490 Z"
              fill={getHeatColor(stateDataMap.get("MG")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("MG")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Espírito Santo */}
            <path
              d="M620 500 L650 495 L655 520 L640 535 L620 530 Z"
              fill={getHeatColor(stateDataMap.get("ES")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("ES")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Rio de Janeiro */}
            <path
              d="M580 540 L620 530 L640 550 L620 570 L580 575 L560 560 Z"
              fill={getHeatColor(stateDataMap.get("RJ")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("RJ")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* São Paulo */}
            <path
              d="M480 530 L580 520 L600 560 L560 590 L500 600 L460 580 L440 550 Z"
              fill={getHeatColor(stateDataMap.get("SP")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("SP")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Mato Grosso do Sul */}
            <path
              d="M360 470 L430 460 L450 510 L420 540 L380 550 L340 530 Z"
              fill={getHeatColor(stateDataMap.get("MS")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("MS")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Paraná */}
            <path
              d="M420 540 L500 530 L520 570 L480 600 L420 610 L380 590 L360 560 Z"
              fill={getHeatColor(stateDataMap.get("PR")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("PR")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Santa Catarina */}
            <path
              d="M420 610 L500 600 L520 630 L480 650 L420 655 L380 640 Z"
              fill={getHeatColor(stateDataMap.get("SC")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("SC")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"  
              className="hover:stroke-2 cursor-pointer transition-all"
            />

            {/* Rio Grande do Sul */}
            <path
              d="M380 640 L480 630 L500 670 L450 690 L380 695 L340 680 L320 650 Z"
              fill={getHeatColor(stateDataMap.get("RS")?.demand || 0)}
              fillOpacity={getHeatOpacity(stateDataMap.get("RS")?.demand || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="hover:stroke-2 cursor-pointer transition-all"
            />
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#2563eb" }} />
          <span>Baixa (0-20%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#16a34a" }} />
          <span>Moderada (20-40%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#eab308" }} />
          <span>Média (40-60%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ea580c" }} />
          <span>Alta (60-80%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#dc2626" }} />
          <span>Muito Alta (80-100%)</span>
        </div>
      </div>

      {filteredStates.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum estado encontrado com os filtros aplicados</p>
        </div>
      )}
    </div>
  );
};