import { useCallback, useEffect, useState } from "react";
import type { CreateBillBody } from "../../../types/bills.type";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import {
  Barcode,
  Calendar,
  Camera,
  DollarSign,
  FileText,
  Loader2,
  Tag,
  Upload,
  X,
} from "lucide-react";
import { Input } from "../../ui/input";
import { cn } from "../../../lib/utils";
import { Badge } from "../../ui/badge";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { billSchema, type BillFormValues } from "./validator";

interface ICreateBill {
  isOpen: boolean;
  onClose: () => void;

  onAdd: (bill: CreateBillBody) => void;
  onScan: (file: File) => void;

  isScanning: boolean;
  scanComplete: boolean;

  isManualSaving: boolean;
  manualSaveComplete: boolean;
}

type Mode = "upload" | "manual";

export const BillCreateModal = ({
  isOpen,
  onClose,
  onAdd,
  onScan,
  isScanning,
  scanComplete,
  isManualSaving,
  manualSaveComplete,
}: ICreateBill) => {
  const [mode, setMode] = useState<Mode>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(billSchema),
    defaultValues: {
      title: "",
      amount: undefined,
      dueDate: "",
      barcode: "",
      description: "",
    },
    mode: "onSubmit",
  });

  const handleClose = () => {
    setScanError(null);
    reset();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    if (scanComplete && !isScanning) handleClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, scanComplete, isScanning]);

  useEffect(() => {
    if (!isOpen) return;
    if (manualSaveComplete && !isManualSaving) handleClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, manualSaveComplete, isManualSaving]);

  const onScanFile = useCallback(
    (file: File) => {
      setScanError(null);

      if (file.type !== "application/pdf") {
        setScanError("Envie um arquivo PDF.");
        return;
      }

      const MAX = 10 * 1024 * 1024;
      if (file.size > MAX) {
        setScanError("PDF muito grande (máx. 10MB).");
        return;
      }

      onScan(file);
    },
    [onScan],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (isScanning) return;

      const file = e.dataTransfer.files?.[0];
      if (file) onScanFile(file);
    },
    [isScanning, onScanFile],
  );

  const onSubmitManual = (values: BillFormValues) => {
    const body: CreateBillBody = {
      title: values.title,
      amount: Number(values.amount),
      dueDate: values.dueDate,
      barcode: values.barcode,
      description: values.description,
    };
    onAdd(body);
  };

  if (!isOpen) return null;

  const disableUpload = isScanning;
  const disableManual = isManualSaving;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p4"
      data-testid="bill-create-modal"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
        data-testid="bill-create-modal-backdrop"
      />

      <Card
        variant="elevated"
        className="relative w-full max-w-lg animate-scale-in"
      >
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Cadastrar Boleto</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              data-testid="bill-create-close-button"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              variant={mode === "upload" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("upload")}
              className="flex-1"
              disabled={isManualSaving || isScanning}
              data-testid="bill-create-mode-button"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload IA
            </Button>
            <Button
              variant={mode === "manual" ? "default" : "outline"}
              size="sm"
              onClick={() => setMode("manual")}
              className="flex-1"
              disabled={isManualSaving || isScanning}
              data-testid="bill-create-mode-manual"
            >
              <FileText className="w-4 h-4 mr-2" />
              Manual
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {mode === "upload" ? (
            <>
              <input
                id="bill-pdf-input"
                data-testid="bill-pdf-input"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onScanFile(file);
                  e.currentTarget.value = "";
                }}
                disabled={disableUpload}
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                  if (disableUpload) return;
                  document.getElementById("bill-pdf-input")?.click();
                }}
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/30",
                  disableUpload && "pointer-events-none",
                )}
                data-testid="bill-upload-dropzone"
              >
                {isScanning ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        Escaneando documento...
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        A IA está extraindo as informações do boleto
                      </p>
                    </div>
                    <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-primary animate-shimmer"
                        style={{ width: "70%" }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Camera className="w-8 h-8 text-primary" />
                    </div>
                    <p className="font-medium text-foreground mb-1">
                      Arraste seu PDF aqui
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ou clique para selecionar o arquivo
                    </p>
                    <Badge variant="default" className="mt-4">
                      Powered by IA
                    </Badge>
                  </>
                )}
              </div>

              {scanError && (
                <p
                  className="mt-3 text-sm text-destructive"
                  data-testid="bill-scan-error"
                >
                  {scanError}
                </p>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                  disabled={disableUpload}
                  data-testid="bill-upload-cancel-button"
                >
                  Cancelar
                </Button>
              </div>
            </>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmitManual)}
              className="space-y-4"
              data-testid="bill-manual-form"
            >
              <fieldset disabled={disableManual} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Título*
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      {...register("title")}
                      placeholder="Ex: Conta de Luz"
                      className={cn(
                        "pl-10",
                        errors.title
                          ? "border-red-500! focus-visible:ring-red-500"
                          : "",
                      )}
                      data-testid="bill-title-input"
                    />
                  </div>
                  {errors.title?.message && (
                    <p
                      className="text-sm text-destructive"
                      data-testid="bill-title-error"
                    >
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Valor*
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        className={cn(
                          "pl-10",
                          errors.amount
                            ? "border-red-500! focus-visible:ring-red-500"
                            : "",
                        )}
                        {...register("amount")}
                        data-testid="bill-amount-input"
                      />
                    </div>
                    {errors.amount?.message && (
                      <p
                        className="text-sm text-destructive"
                        data-testid="bill-amount-error"
                      >
                        {errors.amount.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Vencimento*
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="date"
                        {...register("dueDate")}
                        className={cn(
                          "pl-10",
                          errors.dueDate
                            ? "border-red-500! focus-visible:ring-red-500"
                            : "",
                        )}
                        data-testid="bill-dueDate-input"
                      />
                    </div>
                    {errors.dueDate?.message && (
                      <p
                        className="text-sm text-destructive"
                        data-testid="bill-dueDate-error"
                      >
                        {errors.dueDate.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Código de Barras
                  </label>
                  <div className="relative">
                    <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      {...register("barcode")}
                      placeholder="Apenas dígitos"
                      className="pl-10 font-mono text-xs"
                      inputMode="numeric"
                      data-testid="bill-barcode-input"
                    />
                  </div>
                  {errors.barcode?.message && (
                    <p
                      className="text-sm text-destructive"
                      data-testid="bill-barcode-error"
                    >
                      {errors.barcode.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Descrição
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      {...register("description")}
                      placeholder="Ex: Referente a Dez/2025"
                      className="pl-10"
                      data-testid="bill-description-input"
                    />
                  </div>
                  {errors.description?.message && (
                    <p
                      className="text-sm text-destructive"
                      data-testid="bill-description-error"
                    >
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </fieldset>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
                  disabled={disableManual}
                  data-testid="bill-manual-cancel-button"
                >
                  Cancelar
                </Button>

                <Button
                  type="submit"
                  variant="premium"
                  className="flex-1"
                  disabled={disableManual}
                  data-testid="bill-manual-submit-button"
                >
                  {isManualSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar Boleto"
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
