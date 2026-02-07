import cron from "node-cron";
import { prisma } from "../db/prisma";
import { sendEmail } from "../services/email.services";
import { expiringBills } from "../templates/expiringBills.templates";
import { addDays, formatYMDToBR, startOfDay } from "../utils/date.utils";

export const registerExpiringBillsJob = () => {
  cron.schedule("0 9 * * *", async () => {
    const today = startOfDay(new Date());

    const users = await prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, email: true, billReminderDays: true },
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
        select: { title: true, amount: true, dueDate: true },
      });

      for (const bill of bills) {
        const due = bill.dueDate.toISOString().slice(0, 10);
        const tpl = expiringBills({
          name: user.name,
          description: bill.title,
          amount: bill.amount,
          dueDate: formatYMDToBR(due),
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
  });
};
