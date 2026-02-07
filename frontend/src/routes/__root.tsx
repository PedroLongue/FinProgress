import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Sidebar } from "../components/layout/Sidebar";
import { useAuth } from "../hooks/useAuth";

import Login from "../pages/Login";
import Header from "../components/layout/Header";
import { Loading } from "../components/ui/loading";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { BillCreateModal } from "../components/Modals/BillCreateModal";
import { useBillsActions } from "../hooks/useBills";

const RootLayout = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const { createBill, createBillByPdf } = useBillsActions();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
    </div>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
});
