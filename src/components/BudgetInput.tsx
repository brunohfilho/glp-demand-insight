import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

interface BudgetInputProps {
  value: number;
  onChange: (value: number) => void;
}

export const BudgetInput = ({ value, onChange }: BudgetInputProps) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleSubmit = () => {
    const numericValue = parseFloat(inputValue.replace(/[^\d,]/g, '').replace(',', '.'));
    if (!isNaN(numericValue)) {
      onChange(numericValue);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(parseInt(numericValue) || 0);
  };

  const handleInputChange = (value: string) => {
    const formatted = formatCurrency(value);
    setInputValue(formatted);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-glp-dark mb-4">Verba Anual de Mídia Paga</h3>
      
      <div className="flex items-end gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="budget">Valor anual (R$)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="budget"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="R$ 0"
              className="pl-10 text-lg font-medium"
            />
          </div>
        </div>
        
        <Button 
          onClick={handleSubmit}
          className="bg-glp-primary hover:bg-glp-primary/90 text-glp-primary-foreground"
        >
          Atualizar
        </Button>
      </div>

      {value > 0 && (
        <div className="p-4 bg-glp-neutral rounded-lg">
          <p className="text-sm text-muted-foreground">Verba anual definida</p>
          <p className="text-2xl font-bold text-glp-primary">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(value)}
          </p>
        </div>
      )}
    </div>
  );
};