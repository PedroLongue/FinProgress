import cron from "node-cron";
import { prisma } from "../db/prisma";
import { sendEmail } from "../services/email.services";
import { expiringBills } from "../templates/expiringBills.templates";
import { addDays, formatYMDToBR, startOfDay } from "../utils/date.utils";

export const registerExpiringBillsJob = () => {
  cron.schedule("0 9 * * *", async () => {
    try {
      const today = startOfDay(new Date());

      const users = await prisma.user.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          email: true,
          billReminderDays: true,
          notificationsEnabled: true,
          emailNotificationsEnabled: true,
        },
      });

      for (const user of users) {
        const days = user.billReminderDays ?? 2;
        const targetStart = addDays(today, days);
        const targetEnd = addDays(today, days + 1);

        const bills = await prisma.bill.findMany({
          where: {
            userId: user.id,
            status: "PENDING",
            dueDate: { gte: targetStart, lt: targetEnd },
          },
          select: { id: true, title: true, amount: true, dueDate: true },
        });

        if (bills.length === 0) continue;

        for (const bill of bills) {
          const dueYMD = bill.dueDate.toISOString().slice(0, 10);
          const dueBR = formatYMDToBR(dueYMD);

          if (user.notificationsEnabled) {
            await prisma.notification.upsert({
              where: {
                userId_type_billId_dueDate: {
                  userId: user.id,
                  type: "BILL_EXPIRING",
                  billId: bill.id,
                  dueDate: dueYMD,
                },
              },
              update: {},
              create: {
                userId: user.id,
                type: "BILL_EXPIRING",
                title: "Boleto perto do vencimento",
                body: `${bill.title} vence em ${dueBR}.`,
                billId: bill.id,
                dueDate: dueYMD,
              },
              select: { id: true, title: true, body: true },
            });
          }

          if (user.emailNotificationsEnabled) {
            const tpl = expiringBills({
              name: user.name,
              description: bill.title,
              amount: bill.amount,
              dueDate: dueBR,
              daysLeft: days,
            });

            await sendEmail({
              to: user.email,
              subject: tpl.subject,
              html: tpl.html,
              text: tpl.text,
            });
          }
        }
      }
    } catch (err) {
      console.error("[CRON] expiring-bills failed:", err);
    }
  });
};
