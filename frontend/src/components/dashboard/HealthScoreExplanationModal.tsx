import { Info, X } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Loading } from "../ui/loading";
import { useBillExplanation } from "../../hooks/useBills";

interface IScoreDetails {
  onClose: () => void;
}

export const ScoreDetailsModal = ({ onClose }: IScoreDetails) => {
  const { scoreExplanation, isLoading } = useBillExplanation();

  const handleClose = () => onClose();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {isLoading ? (
        <Loading />
      ) : (
        <Card
          variant="elevated"
          className="relative w-full max-w-lg animate-scale-in"
          role="dialog"
          aria-modal="true"
          aria-label="Detalhes do score"
        >
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  <span className="truncate">
                    {scoreExplanation?.scoreExplanation.title}
                  </span>
                </CardTitle>

                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {scoreExplanation?.scoreExplanation.summary}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={handleClose}
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                Resumo dos boletos
              </h4>

              <ul className="space-y-2">
                {(scoreExplanation?.scoreExplanation.bills ?? []).map(
                  (item, idx) => (
                    <li
                      key={`${item}-${idx}`}
                      className="flex items-start gap-3 rounded-xl bg-secondary/30 px-3 py-2"
                    >
                      <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                      <span className="text-sm text-foreground">{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                Próximos passos
              </h4>

              <ol className="space-y-2">
                {(scoreExplanation?.scoreExplanation.nextSteps ?? []).map(
                  (step, idx) => (
                    <li
                      key={`${step}-${idx}`}
                      className="flex items-start gap-3 rounded-xl bg-muted/20 px-3 py-2"
                    >
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-semibold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-foreground">{step}</span>
                    </li>
                  )
                )}
              </ol>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={handleClose}>
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
