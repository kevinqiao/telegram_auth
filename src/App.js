// app.js
const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json()); // 解析 JSON 请求体

// 添加其他中间件和路由...

const PORT = 80;
// 替换为您的 Telegram Bot Token
const TELEGRAM_BOT_TOKEN = "6433300661:AAHiE1ga-G0dLW1SRQT4W_-DuKpV9iQ47Xo";
app.get("/test", (req, res) => {
  res.send("how are you");
});
app.post("/telegram-auth", (req, res) => {
  console.log("telegram-auth");
  const validData = req.body;
  const dataCheckString = validData.initDataStr;
  const encoded = decodeURIComponent(dataCheckString);

  // HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
  const secret = crypto.createHmac("sha256", "WebAppData").update(TELEGRAM_BOT_TOKEN);

  // Data-check-string is a chain of all received fields'.
  const arr = encoded.split("&");
  const hashIndex = arr.findIndex((str) => str.startsWith("hash="));
  const hash = arr.splice(hashIndex)[0].split("=")[1];
  // sorted alphabetically
  arr.sort((a, b) => a.localeCompare(b));
  // in the format key=<value> with a line feed character ('\n', 0x0A) used as separator
  // e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
  const dataCheckString = arr.join("\n");

  // The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
  const _hash = crypto.createHmac("sha256", secret.digest()).update(dataCheckString).digest("hex");

  // 比较哈希值
  if (hash === _hash) {
    // 验证成功
    res.send({ status: "success", data: validData });
  } else {
    // 验证失败
    res.status(401).send({ status: "error", message: "数据验证失败" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
