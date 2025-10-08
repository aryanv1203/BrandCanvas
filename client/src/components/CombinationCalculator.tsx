import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface CombinationCalculatorProps {
  totalCombinations: number;
}

// Calculate combinations C(n, r) = n! / (r! * (n - r)!)
export function calculateCombinations(n: number, r: number): number {
  if (r > n) return 0;
  if (r === 0 || r === n) return 1;

  let result = 1;
  for (let i = 1; i <= r; i++) {
    result = (result * (n - i + 1)) / i;
  }
  return Math.round(result);
}

export default function CombinationCalculator({
  totalCombinations,
}: CombinationCalculatorProps) {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-primary/10">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className="text-3xl font-bold text-primary"
                data-testid="text-total-combinations"
              >
                {totalCombinations}
              </span>
              <span className="text-sm text-muted-foreground">
                unique collages will be generated
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
