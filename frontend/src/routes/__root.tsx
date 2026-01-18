import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Sidebar } from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";

import Login from "../pages/Login";
import Header from "../components/layout/Header";
import { Loading } from "../components/ui/loading";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { BillCreateModal } from "../components/Modals/BillCreateModal";
import { useBillsActions } from "../hooks/useBills";
import { SnackbarHost } from "../components/ui/snackbar-host";
import { useSnackbarStore } from "../stores/snackbar.store";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  const { isLoading, isAuthenticated } = useAuth();
  const { createBill, createBillByPdf } = useBillsActions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const showSnackbar = useSnackbarStore((s) => s.show);

  useEffect(() => {
    if (!isAddModalOpen) return;
    if (createBill.isSuccess)
      showSnackbar({ severity: "success", message: "Boleto cadastrado." });
    if (createBill.isError)
      showSnackbar({
        severity: "error",
        message: "Ocorreu um erro ao cadastrar, tente novamente.",
      });
  }, [
    isAddModalOpen,
    createBill.isSuccess,
    createBill.isError,
    createBill.error,
    showSnackbar,
  ]);

  useEffect(() => {
    if (!isAddModalOpen) return;
    if (createBillByPdf.isSuccess)
      showSnackbar({
        severity: "success",
        message: "Boleto via PDF cadastrado.",
      });
    if (createBillByPdf.isError)
      showSnackbar({
        severity: "error",
        message: "Ocorreu um erro ao extrair os dados, tente novamente.",
      });
  }, [
    isAddModalOpen,
    createBillByPdf.isSuccess,
    createBillByPdf.isError,
    createBillByPdf.error,
    showSnackbar,
  ]);

  const handleCloseModal = () => {
    createBillByPdf.reset();
    createBill.reset();
    setIsAddModalOpen(false);
  };

  if (isLoading) return <Loading />;

  if (!isAuthenticated) return <Login />;

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header />
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      <Button
        variant="fab"
        size="fab"
        className="fixed right-6 bottom-24 lg:bottom-6 z-20"
        onClick={() => setIsAddModalOpen(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      <BillCreateModal
        isOpen={isAddModalOpen}
        onClose={handleCloseModal}
        onAdd={(body) => createBill.mutate(body)}
        onScan={(file) => createBillByPdf.mutate(file)}
        isScanning={createBillByPdf.isPending}
        scanComplete={createBillByPdf.isSuccess}
        isManualSaving={createBill.isPending}
        manualSaveComplete={createBill.isSuccess}
      />
      <SnackbarHost />
    </div>
  );
}
