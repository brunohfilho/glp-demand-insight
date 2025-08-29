import { useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { GLPFilters } from "./GLPDashboard";
import statesGeoJSON from "@/data/br-states.json";

interface BrazilHeatMapProps {
  filters: GLPFilters;
}

// Mapeamento de cidades para estados (UF)
const cityToStateMap: Record<string, string> = {
  "São Paulo": "SP",
  "Rio de Janeiro": "RJ", 
  "Belo Horizonte": "MG",
  "Salvador": "BA",
  "Brasília": "DF",
  "Fortaleza": "CE",
  "Manaus": "AM",
  "Curitiba": "PR",
  "Recife": "PE",
  "Porto Alegre": "RS"
};

// Mock de demanda por estado
const statesDemand = [
  { uf: "SP", name: "São Paulo", demand: 85 },
  { uf: "RJ", name: "Rio de Janeiro", demand: 78 },
  { uf: "MG", name: "Minas Gerais", demand: 72 },
  { uf: "BA", name: "Bahia", demand: 65 },
  { uf: "PR", name: "Paraná", demand: 68 },
  { uf: "RS", name: "Rio Grande do Sul", demand: 70 },
  { uf: "PE", name: "Pernambuco", demand: 58 },
  { uf: "CE", name: "Ceará", demand: 52 },
  { uf: "GO", name: "Goiás", demand: 60 },
  { uf: "SC", name: "Santa Catarina", demand: 65 },
  { uf: "AM", name: "Amazonas", demand: 45 },
  { uf: "PB", name: "Paraíba", demand: 40 },
  { uf: "ES", name: "Espírito Santo", demand: 58 },
  { uf: "PI", name: "Piauí", demand: 35 },
  { uf: "AL", name: "Alagoas", demand: 42 },
  { uf: "RN", name: "Rio Grande do Norte", demand: 38 },
  { uf: "MT", name: "Mato Grosso", demand: 55 },
  { uf: "MS", name: "Mato Grosso do Sul", demand: 50 },
  { uf: "DF", name: "Distrito Federal", demand: 75 },
  { uf: "SE", name: "Sergipe", demand: 40 },
  { uf: "TO", name: "Tocantins", demand: 30 },
  { uf: "AC", name: "Acre", demand: 25 },
  { uf: "RO", name: "Rondônia", demand: 35 },
  { uf: "RR", name: "Roraima", demand: 20 },
  { uf: "AP", name: "Amapá", demand: 18 },
  { uf: "MA", name: "Maranhão", demand: 45 },
  { uf: "PA", name: "Pará", demand: 48 }
];

const getHeatColor = (demand: number) => {
  if (demand >= 70) return "#ff6b35"; // orange
  if (demand >= 55) return "#4ecdc4"; // teal/green
  if (demand >= 40) return "#2c3e50"; // dark gray
  if (demand >= 25) return "#95a5a6"; // gray
  return "#ecf0f1"; // light gray
};

const BrazilHeatMap = ({ filters }: BrazilHeatMapProps) => {
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    content: string;
  }>({ show: false, x: 0, y: 0, content: "" });

  // Aplicar filtros aos dados
  const adjustedStates = statesDemand.map(state => {
    let adjustedDemand = state.demand;

    // Ajuste por mês
    if (filters.month && filters.month !== "all") {
      const monthNumber = parseInt(filters.month);
      const seasonalFactor = monthNumber <= 6 ? 0.9 : 1.1; // Inverno/Verão
      adjustedDemand *= seasonalFactor;
    }

    // Ajuste por segmento
    if (filters.segment && filters.segment !== "all") {
      const segmentFactors: Record<string, number> = {
        "Residencial": 1.0,
        "Comercial": 0.8,
        "Industrial": 1.2,
        "Automotivo": 0.6
      };
      adjustedDemand *= segmentFactors[filters.segment] || 1.0;
    }

    // Ajuste por tipo de botijão
    if (filters.bottleType && filters.bottleType !== "all") {
      const bottleFactors: Record<string, number> = {
        "P13": 1.0,
        "P20": 0.7,
        "P45": 0.3
      };
      adjustedDemand *= bottleFactors[filters.bottleType] || 1.0;
    }

    // Ajuste especial para cidade selecionada
    if (filters.city && filters.city !== "all") {
      const selectedStateUF = cityToStateMap[filters.city];
      if (selectedStateUF === state.uf) {
        adjustedDemand *= 1.3; // Boost para o estado da cidade selecionada
      }
    }

    return {
      ...state,
      adjustedDemand: Math.max(0, adjustedDemand)
    };
  });

  // Calcular estatísticas
  const maxDemand = Math.max(...adjustedStates.map(s => s.adjustedDemand));
  const avgDemand = adjustedStates.reduce((sum, s) => sum + s.adjustedDemand, 0) / adjustedStates.length;

  // Configuração da projeção
  const width = 800;
  const height = 600;
  const projection = geoMercator()
    .fitSize([width, height], statesGeoJSON as any)
    .scale(1000)
    .center([-55, -15]);
  
  const pathGenerator = geoPath().projection(projection);

  const handleMouseEnter = (event: React.MouseEvent, stateName: string, demand: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      show: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      content: `${stateName}: ${demand.toFixed(1)} unidades`
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, content: "" });
  };

  return (
    <div className="w-full bg-card rounded-lg p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Demanda de GLP por Estado</h3>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Máxima: {maxDemand.toFixed(1)} unidades</span>
          <span>Média: {avgDemand.toFixed(1)} unidades</span>
        </div>
      </div>

      <div className="relative">
        <svg
          width="100%"
          height="500"
          viewBox={`0 0 ${width} ${height}`}
          className="border border-border rounded"
        >
          {statesGeoJSON.features.map((feature: any) => {
            const stateData = adjustedStates.find(s => s.uf === feature.properties.sigla);
            const demand = stateData?.adjustedDemand || 0;
            const color = getHeatColor(demand);
            const pathData = pathGenerator(feature);

            if (!pathData) return null;

            return (
              <path
                key={feature.properties.sigla}
                d={pathData}
                fill={color}
                stroke="#ffffff"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onMouseEnter={(e) => handleMouseEnter(e, feature.properties.name, demand)}
                onMouseLeave={handleMouseLeave}
              />
            );
          })}
        </svg>

        {/* Tooltip */}
        {tooltip.show && (
          <div
            className="absolute bg-popover text-popover-foreground text-sm p-2 rounded shadow-lg border pointer-events-none z-10"
            style={{
              left: tooltip.x + 10,
              top: tooltip.y - 10,
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>

      {/* Legenda */}
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Legenda</h4>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ff6b35" }}></div>
            <span>≥70 (Alto)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#4ecdc4" }}></div>
            <span>55-69 (Médio-Alto)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#2c3e50" }}></div>
            <span>40-54 (Médio)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#95a5a6" }}></div>
            <span>25-39 (Baixo)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ecf0f1" }}></div>
            <span>&lt;25 (Muito Baixo)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrazilHeatMap;