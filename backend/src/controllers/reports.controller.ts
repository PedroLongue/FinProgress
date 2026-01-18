import type { Request, Response } from "express";
import { prisma } from "../db/prisma";
import {
  addMonths,
  buildMonthBuckets,
  formatMonthKey,
  parseISODate,
  startOfMonth,
} from "../utils/date";
import { parseReportRange } from "../utils/report";
import type { Prisma } from "../../generated/prisma/client";

interface AuthRequest extends Request {
  userId?: string;
}

type MonthRow = { month: string; total: number; count: number };

export const getSpendingReport = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });

  const range = parseReportRange(req.query.range); // 3 | 6 | 12

  const now = new Date();
  const currentMonthStart = startOfMonth(now);
  const nextMonthStart = addMonths(currentMonthStart, 1);
  const windowStart = addMonths(currentMonthStart, -(range - 1));

  const paidWhere: Prisma.BillWhereInput = {
    userId,
    status: { in: ["PAID", "PAID_LATE"] },
    paidAt: { not: null },
  };

  const currentMonthWhere: Prisma.BillWhereInput = {
    ...paidWhere,
    paidAt: { not: null, gte: currentMonthStart, lt: nextMonthStart },
  };

  const windowWhere: Prisma.BillWhereInput = {
    ...paidWhere,
    paidAt: { not: null, gte: windowStart, lt: nextMonthStart },
  };

  const [currentMonthAgg, rows] = await Promise.all([
    prisma.bill.aggregate({
      where: currentMonthWhere,
      _sum: { amount: true },
      _count: { _all: true },
    }),
    prisma.bill.findMany({
      where: windowWhere,
      select: { amount: true, paidAt: true },
      orderBy: { paidAt: "asc" },
    }),
  ]);

  const monthKeys = buildMonthBuckets(currentMonthStart, range);

  const byMonthMap = new Map<string, MonthRow>(
    monthKeys.map((m) => [m, { month: m, total: 0, count: 0 }]),
  );

  for (const r of rows) {
    if (!r.paidAt) continue;
    const key = formatMonthKey(r.paidAt);
    const bucket = byMonthMap.get(key);
    if (!bucket) continue;

    bucket.total += Number(r.amount);
    bucket.count += 1;
  }

  const byMonth = monthKeys.map((k) => byMonthMap.get(k)!);
  const totalInRange = byMonth.reduce((acc, m) => acc + m.total, 0);

  return res.json({
    rangeMonths: range,
    currentMonth: {
      month: formatMonthKey(currentMonthStart),
      total: Number(currentMonthAgg._sum.amount ?? 0),
      count: Number(currentMonthAgg._count._all ?? 0),
    },
    totals: {
      totalInRange,
      monthsCount: byMonth.length,
    },
    byMonth,
  });
};

export const getSpendingByCategoryReport = async (
  req: AuthRequest,
  res: Response,
) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });

  const startParam = parseISODate(req.query.start);
  const endParam = parseISODate(req.query.end);

  const now = new Date();
  const defaultStart = startOfMonth(now);
  const defaultEnd = addMonths(defaultStart, 1);

  const start = startParam ?? defaultStart;
  const end = endParam ?? defaultEnd;

  if (start >= end) {
    return res
      .status(400)
      .json({ errors: ["Intervalo inválido: start deve ser menor que end"] });
  }

  const where: Prisma.BillWhereInput = {
    userId,
    dueDate: { gte: start, lt: end },
  };

  const rows = await prisma.bill.groupBy({
    by: ["category"],
    where,
    _sum: { amount: true },
    _count: { _all: true },
    orderBy: {
      _sum: { amount: "desc" },
    },
  });

  const categories = rows.map((r) => ({
    category: r.category ?? "Sem categoria",
    total: Number(r._sum.amount ?? 0),
    count: Number(r._count._all ?? 0),
  }));

  const totalInRange = categories.reduce((acc, c) => acc + c.total, 0);

  return res.json({
    range: {
      start: start.toISOString(),
      end: end.toISOString(),
    },
    totals: {
      totalInRange,
      categoriesCount: categories.length,
    },
    byCategory: categories,
  });
};
