import type { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { categorizeBillAI } from "../services/billCategorizer";
import { calculateBillStatus } from "../utils/billStatusCalculator";

interface AuthRequest extends Request {
  userId?: string;
}

const PAGE_SIZE = 10;

export const createBill = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });

  const {
    title,
    amount,
    dueDate,
    category,
    status,
    barcode,
    description,
    paidAt,
  } = req.body as {
    title: string;
    amount: number;
    dueDate: string; // ISO
    category: string;
    status?: "PENDING" | "PAID" | "PAID_LATE" | "OVERDUE";
    barcode?: string | null;
    description?: string | null;
    paidAt?: string | null;
  };

  const normalizedBarcode = barcode ? String(barcode).replace(/\D/g, "") : null;

  if (normalizedBarcode && normalizedBarcode.trim() !== "") {
    const existingBillWithBarcode = await prisma.bill.findFirst({
      where: {
        userId,
        barcode: normalizedBarcode,
      },
    });

    if (existingBillWithBarcode) {
      return res.status(409).json({
        errors: [`Código de barras já cadastrado para este usuário`],
      });
    }
  }

  let finalCategory = category?.trim();

  if (!finalCategory) {
    const ai = await categorizeBillAI({
      title,
      description,
      barcode: normalizedBarcode,
    });
    finalCategory = ai.category;
  }

  const dueDateObj = new Date(dueDate);
  const paidAtObj = paidAt ? new Date(paidAt) : null;
  const finalStatus = calculateBillStatus(dueDateObj, paidAtObj);

  const bill = await prisma.bill.create({
    data: {
      title: String(title).trim(),
      amount: Number(amount),
      dueDate: new Date(dueDate),
      category: finalCategory,
      status: finalStatus,
      barcode: barcode?.trim() || null,
      description: description?.trim() || null,
      paidAt: paidAt ? new Date(paidAt) : null,
      userId,
    },
  });

  return res.status(201).json({ bill });
};

export const listBills = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });

  const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
  const take = PAGE_SIZE;
  const skip = (page - 1) * take;

  const status = req.query.status as
    | "PENDING"
    | "PAID"
    | "PAID_LATE"
    | "OVERDUE"
    | "UNPAID";

  const category = req.query.category ? String(req.query.category) : undefined;

  const where: any = {
    userId,
  };

  if (status === "UNPAID") {
    where.status = {
      in: ["PENDING", "OVERDUE"],
    };
  } else if (status) {
    where.status = status;
  }

  if (category) {
    where.category = category;
  }

  const [total, bills] = await Promise.all([
    prisma.bill.count({ where }),
    prisma.bill.findMany({
      where,
      orderBy: { dueDate: "asc" },
      skip,
      take,
    }),
  ]);

  return res.json({
    page,
    pageSize: take,
    total,
    totalPages: Math.ceil(total / take),
    bills,
  });
};

export const getBillById = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });

  const { id } = req.params;

  const bill = await prisma.bill.findFirst({
    where: { id, userId }, // garante que só pega do dono
  });

  if (!bill) return res.status(404).json({ errors: ["Boleta não encontrada"] });

  return res.json({ bill });
};

export const updateBill = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });

  const { id } = req.params;

  // garante propriedade antes de atualizar (evita update em item de outro usuário)
  const existing = await prisma.bill.findFirst({ where: { id, userId } });
  if (!existing)
    return res.status(404).json({ errors: ["Boleta não encontrada"] });

  const { title, category, status, barcode, description, paidAt } =
    req.body as {
      title?: string;
      category?: string;
      status?: "PENDING" | "PAID" | "OVERDUE";
      barcode?: string | null;
      description?: string | null;
      paidAt?: string | null;
    };

  const updateData = await prisma.bill.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title: title.trim() } : {}),
      ...(category !== undefined ? { category: category.trim() } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(barcode !== undefined
        ? { barcode: barcode ? barcode.trim() : null }
        : {}),
      ...(description !== undefined
        ? { description: description ? description.trim() : null }
        : {}),
      ...(paidAt !== undefined
        ? { paidAt: paidAt ? new Date(paidAt) : null }
        : {}),
    },
  });

  const newDueDate = existing.dueDate;
  const newPaidAt = updateData.paidAt ? updateData.paidAt : existing.paidAt;

  const newStatus = calculateBillStatus(newDueDate, newPaidAt);

  updateData.status = newStatus;

  const bill = await prisma.bill.update({
    where: { id },
    data: updateData,
  });

  return res.json({ bill });
};

export const deleteBill = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });

  const { id } = req.params;

  const existing = await prisma.bill.findFirst({ where: { id, userId } });
  if (!existing)
    return res.status(404).json({ errors: ["Boleta não encontrada"] });

  await prisma.bill.delete({ where: { id } });

  return res.status(204).send();
};
