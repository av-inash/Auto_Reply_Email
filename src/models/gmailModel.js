const { google } = require("googleapis");

async function listLabels(auth, userId = "me") {
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.labels.list({
    userId,
  });
  return response.data.labels || [];
}

async function listMessages(auth, labelIds, userId = "me", q = "is:unread") {
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.list({
    userId,
    labelIds,
    q,
  });
  return response.data.messages || [];
}

async function createLabel(auth, labelName, userId = "me") {
  const gmail = google.gmail({ version: "v1", auth });
  try {
    const response = await gmail.users.labels.create({
      userId,
      requestBody: {
        name: labelName,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });
    return response.data.id;
  } catch (error) {
    if (error.code === 409) {
      const labels = await listLabels(auth, userId);
      const label = labels.find((label) => label.name === labelName);
      return label.id;
    } else {
      throw error;
    }
  }
}

async function getMessage(auth, userId = "me", messageId) {
  const gmail = google.gmail({ version: "v1", auth });
  const response = await gmail.users.messages.get({
    auth,
    userId,
    id: messageId,
  });
  return response.data;
}

async function sendReply(auth, userId = "me", raw) {
  const gmail = google.gmail({ version: "v1", auth });
  const replyMessage = {
    userId,
    resource: { raw: Buffer.from(raw).toString("base64") },
  };
  return gmail.users.messages.send(replyMessage);
}

async function modifyMessageLabels(auth, userId = "me", messageId, labelId) {
  const gmail = google.gmail({ version: "v1", auth });
  const modifyRequest = {
    auth,
    userId,
    id: messageId,
    resource: {
      addLabelIds: [labelId],
      removeLabelIds: ["INBOX"],
    },
  };
  return gmail.users.messages.modify(modifyRequest);
}

module.exports = {
  listLabels,
  listMessages,
  createLabel,
  getMessage,
  sendReply,
  modifyMessageLabels,
};
