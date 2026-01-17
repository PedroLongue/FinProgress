import type { Request, Response } from "express";
import { prisma } from "../db/prisma";
import {
  addMonths,
  buildMonthBuckets,
  formatMonthKey,
  nextMonth,
  parseMonthYYYYMM,
  startOfMonth,
} from "../utils/date";
import { parseReportRange } from "../utils/report";
import type { Prisma } from "../../generated/prisma/client";

interface AuthRequest extends Request {
  userId?: string;
}

export const getMonthlyGoalSummary = async (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });

  const monthParam =
    typeof req.query.month === "string" ? req.query.month : undefined;

  const monthStart = monthParam
    ? parseMonthYYYYMM(monthParam)
    : startOfMonth(new Date());

  if (monthParam && !monthStart) {
    return res
      .status(400)
      .json({ errors: ["Query 'month' inválida. Use YYYY-MM."] });
  }

  const nextMonthStart = monthParam
    ? new Date(
        Date.UTC(
          monthStart!.getUTCFullYear(),
          monthStart!.getUTCMonth() + 1,
          1,
          0,
          0,
          0
        )
      )
    : nextMonth(new Date());

  const [goal, billsAgg] = await Promise.all([
    prisma.monthlySpendingGoal.findUnique({
      where: {
        userId_month: { userId, month: monthStart! },
      },
      select: { amount: true, month: true, updatedAt: true },
    }),
    prisma.bill.aggregate({
      where: {
        userId,
        dueDate: { gte: monthStart!, lt: nextMonthStart },
      },
      _sum: { amount: true },
      _count: { _all: true },
    }),
  ]);

  const goalAmount = goal?.amount ?? null;
  const totalDue = billsAgg._sum.amount ?? 0;

  const remaining =
    goalAmount === null ? null : Math.max(goalAmount - totalDue, 0);
  const percentUsed =
    goalAmount && goalAmount > 0
      ? Math.round((totalDue / goalAmount) * 100 * 100) / 100
      : null;

  return res.json({
    month: formatMonthKey(monthStart!),
    goalAmount,
    totalDue,
    billsCount: billsAgg._count._all,
    remaining,
    percentUsed,
    goalUpdatedAt: goal?.updatedAt ?? null,
  });
};

export const upsertMonthlyGoal = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });

  const { amount, month } = req.body as { amount: number; month?: string };

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount < 0) {
    return res.status(400).json({ errors: ["Campo 'amount' inválido."] });
  }

  const monthStart = month ? parseMonthYYYYMM(month) : startOfMonth(new Date());
  if (month && !monthStart) {
    return res
      .status(400)
      .json({ errors: ["Body 'month' inválido. Use YYYY-MM."] });
  }

  const saved = await prisma.monthlySpendingGoal.upsert({
    where: {
      userId_month: { userId, month: monthStart! },
    },
    create: {
      userId,
      month: monthStart!,
      amount: Math.round(amount),
    },
    update: {
      amount: Math.round(amount),
    },
    select: { month: true, amount: true, updatedAt: true },
  });

  return res.status(200).json({
    month: formatMonthKey(saved.month),
    goalAmount: saved.amount,
    goalUpdatedAt: saved.updatedAt,
  });
};
