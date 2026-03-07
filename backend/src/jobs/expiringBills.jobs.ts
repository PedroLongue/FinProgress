import cron from "node-cron";
import { prisma } from "../db/prisma";
import { sendEmail } from "../services/email.services";
import { sendTelegramMessage } from "../services/telegram.services";
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
          telegramNotificationsEnabled: true,
          telegramChatId: true,
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

          let notif: {
            id: string;
            title: string;
            body: string;
            emailSent: boolean;
          } | null = null;
          if (user.notificationsEnabled) {
            notif = await prisma.notification.upsert({
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
                emailSent: false,
              },
              select: { id: true, title: true, body: true, emailSent: true },
            });
          }

          if (user.emailNotificationsEnabled && notif && !notif.emailSent) {
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

            await prisma.notification.update({
              where: { id: notif.id },
              data: { emailSent: true },
            });
          }

          if (user.telegramNotificationsEnabled && user.telegramChatId) {
            await sendTelegramMessage({
              chatId: user.telegramChatId,
              text: `🔔 Boleto próximo do vencimento

              ${bill.title}
              Valor: R$ ${bill.amount}
              Vence em: ${dueBR}`,
            });
          }
        }
      }
    } catch (err) {
      console.error("[CRON] expiring-bills failed:", err);
    }
  });
};
