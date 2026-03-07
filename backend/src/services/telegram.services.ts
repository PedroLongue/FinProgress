import axios from "axios";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export const sendTelegramMessage = async ({
  chatId,
  text,
}: {
  chatId: string;
  text: string;
}) => {
  try {
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text,
      },
    );
  } catch (error) {
    console.error("Erro ao enviar telegram:", error);
  }
};
