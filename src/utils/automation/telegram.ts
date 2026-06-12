/**
 * Utility to send messages to the owner's Telegram chat.
 */
export async function sendTelegramMessage(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("[Telegram] Missing BOT_TOKEN or CHAT_ID in environment");
    return { success: false, error: "Missing config" };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML"
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("[Telegram] API error:", data);
      return { success: false, error: data.description };
    }

    return { success: true };
  } catch (error) {
    console.error("[Telegram] Fetch error:", error);
    return { success: false, error: String(error) };
  }
}
