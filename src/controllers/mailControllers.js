const { listMessages, getMessage, sendReply, modifyMessageLabels } = require("../models/gmailModel");

const labelName = "Auto-Reply on Vacation";

async function processUnrepliedMessages(auth) {
  const labelId = await createLabel(auth, labelName);

  setInterval(async () => {
    const messages = await listMessages(auth, ["INBOX"], "me", "is:unread");

    if (messages && messages.length > 0) {
      for (const message of messages) {
        const email = await getMessage(auth, "me", message.id);
        const hasReplied = email.payload.headers.some(
          (header) => header.name === "In-Reply-To"
        );

        if (!hasReplied) {
          const replyMessage = `
            To: ${email.payload.headers.find((header) => header.name === "From").value}\r\n
            Subject: Re: ${email.payload.headers.find((header) => header.name === "Subject").value}\r\n
            Content-Type: text/plain; charset="UTF-8"\r\n
            Content-Transfer-Encoding: 7bit\r\n\r\n
            Thank you for your email. I'm currently on vacation and will reply to you when I return.\r\n
          `;

          await sendReply(auth, "me", replyMessage);
          await modifyMessageLabels(auth, "me", message.id, labelId);
        }
      }
    }
  }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000);
}

module.exports = { processUnrepliedMessages };
