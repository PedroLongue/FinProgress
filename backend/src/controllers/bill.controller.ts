import type { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { categorizeBillAI } from "../services/billCategorizer";
import { calculateBillStatus } from "../utils/billStatusCalculator";
import { extractBillFromPdfAI } from "../services/billPdfExtractor";

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

  const [total, bills, categoryRows] = await Promise.all([
    prisma.bill.count({ where }),
    prisma.bill.findMany({
      where,
      orderBy: { dueDate: "asc" },
      skip,
      take,
    }),
    prisma.bill.findMany({
      where: { userId },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    }),
  ]);

  const userCategories = categoryRows
    .map((r) => r.category)
    .filter((c): c is string => !!c && c.trim() !== "");

  return res.json({
    page,
    pageSize: take,
    total,
    totalPages: Math.ceil(total / take),
    bills,
    userCategories,
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

export const createBillFromPdf = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });

  if (!req.file) return res.status(400).json({ errors: ["PDF não enviado"] });
  if (req.file.mimetype !== "application/pdf") {
    return res.status(400).json({ errors: ["Arquivo precisa ser PDF"] });
  }

  const pdfBase64 = req.file.buffer.toString("base64");
  const extracted = await extractBillFromPdfAI({ pdfBase64 });

  // se não conseguiu extrair o mínimo, devolve pro front revisar
  if (!extracted.amount || !extracted.dueDate) {
    return res.status(422).json({
      errors: ["Não foi possível extrair valor e/ou vencimento com segurança"],
      extracted,
    });
  }

  const normalizedBarcode = extracted.barcode
    ? String(extracted.barcode).replace(/\D/g, "")
    : null;

  if (normalizedBarcode) {
    const existing = await prisma.bill.findFirst({
      where: { userId, barcode: normalizedBarcode },
    });
    if (existing) {
      return res
        .status(409)
        .json({ errors: ["Código de barras já cadastrado para este usuário"] });
    }
  }

  const aiCategory = await categorizeBillAI({
    title: extracted.title ?? undefined,
    description: extracted.description ?? null,
    barcode: normalizedBarcode,
  });

  const dueDateObj = new Date(`${extracted.dueDate}T00:00:00.000Z`);
  const finalStatus = calculateBillStatus(dueDateObj, null);

  const bill = await prisma.bill.create({
    data: {
      title: (extracted.title ?? "Conta").trim(),
      amount: Number(extracted.amount),
      dueDate: dueDateObj,
      category: aiCategory.category,
      status: finalStatus,
      barcode: normalizedBarcode,
      description: extracted.description?.trim() || null,
      paidAt: null,
      userId,
    },
  });

  return res.status(201).json({ bill });
};

export const usersBillsDetails = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });

  const [totalBills, totalPaidNotLate, totalPaidLate, totalPending, totalLate] =
    await Promise.all([
      prisma.bill.count({ where: { userId } }),
      prisma.bill.count({ where: { userId, status: "PAID" } }),
      prisma.bill.count({ where: { userId, status: "PAID_LATE" } }),
      prisma.bill.count({
        where: { userId, status: { in: ["PENDING"] } },
      }),
      prisma.bill.count({ where: { userId, status: "OVERDUE" } }),
    ]);

  const denom = Math.max(totalBills, 1);

  const raw =
    totalPaidNotLate * 1.0 - // recompensa pagamento sem atraso
    totalPaidLate * 0.5 - // penaliza atraso, mas menos (porque foi pago)
    totalPending * 1.0 - // pendente reduz o score (ainda é risco)
    totalLate * 2.0; // vencido não pago pesa mais

  const maxScore = denom * 1.0; // melhor caso
  const minScore = denom * -2.0; // pior caso

  const normalized = (raw - minScore) / (maxScore - minScore);

  const score = Math.round(Math.max(0, Math.min(1, normalized)) * 100);

  return res.json({
    totalBills,
    totalPaidNotLate,
    totalPaidLate,
    totalPending,
    totalLate,
    score,
  });
};
