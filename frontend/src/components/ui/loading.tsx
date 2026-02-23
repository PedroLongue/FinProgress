import { Loader2 } from "lucide-react";

export const Loading = () => {
  return (
    <div
      className="flex items-center justify-center h-screen bg-zinc-950"
      data-testid="loading-state"
    >
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
        <p className="text-zinc-400">Carregando...</p>
      </div>
    </div>
  );
};
