import cron from "node-cron";
import { prisma } from "../db/prisma";
import { sendEmail } from "../services/email.services";
import { expiringBills } from "../templates/expiringBills.templates";
import { addDays, formatYMDToBR, startOfDay } from "../utils/date.utils";
import { sendWebPush } from "../services/push.services";

export const registerExpiringBillsJob = () => {
  cron.schedule("50 11 * * *", async () => {
    try {
      const today = startOfDay(new Date());

      const users = await prisma.user.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          email: true,
          billReminderDays: true,
          emailNotificationsEnabled: true,
          pushNotificationsEnabled: true,
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

        const subs = user.pushNotificationsEnabled
          ? await prisma.pushSubscription.findMany({
              where: { userId: user.id },
              select: { endpoint: true, p256dh: true, auth: true },
            })
          : [];

        for (const bill of bills) {
          const dueYMD = bill.dueDate.toISOString().slice(0, 10);
          const dueBR = formatYMDToBR(dueYMD);

          const notif = await prisma.pushNotification.upsert({
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

          if (user.pushNotificationsEnabled && subs.length > 0) {
            for (const s of subs) {
              try {
                await sendWebPush(
                  {
                    endpoint: s.endpoint,
                    keys: { p256dh: s.p256dh, auth: s.auth },
                  },
                  {
                    title: notif.title,
                    body: notif.body,
                    notificationId: notif.id,
                  },
                );
              } catch {
                await prisma.pushSubscription.deleteMany({
                  where: { endpoint: s.endpoint },
                });
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("[CRON] expiring-bills failed:", err);
    }
  });
};
