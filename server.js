const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "messages.json");

app.use(express.json());
app.use(express.static("public"));

async function loadMessages() {
  try {
    const rawData = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(rawData);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function saveMessages(messages) {
  await fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2), "utf8");
}

app.get("/api/contact", async (req, res) => {
  try {
    const messages = await loadMessages();
    res.json(messages);
  } catch (error) {
    console.error("Error:", error);
  }
});

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message, subject, newsCheck } = req.body;
    if (!name || !email || !message || !subject) {
      return res
        .status(400)
        .json({ error: "Required: Name, Email, Message, Subject" });
    }

    const messages = await loadMessages();
    const maxID = messages.reduce((m, b) => Math.max(m, b.id), 0);
    const newMessage = {
      id: maxID + 1,
      name,
      email,
      message,
      subject,
      newsCheck: Boolean(newsCheck),
    };

    messages.push(newMessage);
    await saveMessages(messages);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Server Error", error);
    res.status(500).json({ error: "Failed to save message." });
  }
});

app.listen(PORT, () => {
  console.log(`Profile Server on http://localhost:${PORT}`);
});
