import type { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { sendEmail } from "../services/email.services";
import { expiringBills } from "../templates/expiringBills.templates";
import { addDays, formatYMDToBR, startOfDay } from "../utils/date.utils";

interface AuthRequest extends Request {
  userId?: string;
}

export const sendExpiringBillsEmails = async (_req: Request, res: Response) => {
  try {
    const today = startOfDay(new Date());

    const users = await prisma.user.findMany({
      where: { isActive: true, emailNotificationsEnabled: true },
      select: {
        id: true,
        name: true,
        email: true,
        billReminderDays: true,
      },
    });

    let sentCount = 0;

    for (const user of users) {
      const days = user.billReminderDays ?? 2;

      const targetStart = addDays(today, days);
      const targetEnd = addDays(today, days + 1);

      const bills = await prisma.bill.findMany({
        where: {
          userId: user.id,
          status: "PENDING",
          dueDate: {
            gte: targetStart,
            lt: targetEnd,
          },
        },
        select: {
          id: true,
          title: true,
          amount: true,
          dueDate: true,
          description: true,
        },
        orderBy: { dueDate: "asc" },
      });

      if (bills.length === 0) continue;

      for (const bill of bills) {
        const due = bill.dueDate.toISOString().slice(0, 10);
        const tpl = expiringBills({
          name: user.name,
          description: bill.title,
          amount: bill.amount,
          dueDate: formatYMDToBR(due),
          daysLeft: days,
          link: undefined,
        });

        await sendEmail({
          to: user.email,
          subject: tpl.subject,
          html: tpl.html,
          text: tpl.text,
        });

        sentCount += 1;
      }
    }

    return res.status(200).json({ ok: true, sentCount });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erro ao disparar emails";
    return res.status(500).json({ ok: false, error: message });
  }
};

export const updateNotificationsSettings = async (
  req: AuthRequest,
  res: Response,
) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ errors: ["Não autenticado"] });

  const {
    billReminderDays,
    emailNotificationsEnabled,
    pushNotificationsEnabled,
  } = req.body;

  if (
    billReminderDays !== undefined &&
    (typeof billReminderDays !== "number" ||
      billReminderDays < 1 ||
      billReminderDays > 7)
  ) {
    return res
      .status(400)
      .json({ errors: ["billReminderDays deve ser um número entre 1 e 7"] });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(billReminderDays !== undefined && {
        billReminderDays,
      }),
      ...(emailNotificationsEnabled !== undefined && {
        emailNotificationsEnabled,
      }),
      ...(pushNotificationsEnabled !== undefined && {
        pushNotificationsEnabled,
      }),
    },
    select: {
      billReminderDays: true,
      emailNotificationsEnabled: true,
      pushNotificationsEnabled: true,
    },
  });

  return res.status(200).json({ settings: user });
};
