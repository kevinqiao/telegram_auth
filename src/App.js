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
  console.log(validData);
  const strs = dataCheckString.split("&");
  const sdata = strs.sort().join("&");
  console.log(sdata);

  //   // 检查哈希是否存在
  //   if (!userData.hash) {
  //     return res.status(400).send("缺少哈希值");
  //   }

  //   // 生成数据检查字符串
  //   const dataCheckString = Object.keys(userData)
  //     .filter((key) => key !== "hash")
  //     .sort()
  //     .map((key) => `${key}=${userData[key]}`)
  //     // .map((key) => {
  //     //   const value = userData[key];
  //     //   return `${key}=${typeof value === "object" ? JSON.stringify(value) : value}`;
  //     // })
  //     .join("\n");
  //   console.log(dataCheckString);
  //   const lines = dataCheckString.split("\n");
  //   console.log(lines);
  //   const keyValueRegex = /^[a-zA-Z_]+=[^\s]+$/; // 简单的正则表达式示例

  //   for (const line of lines) {
  //     if (!keyValueRegex.test(line)) {
  //       console.error(`格式错误的行: ${line}`);
  //     }
  //   }

  // 使用 Bot Token 生成哈希值的密钥
  const secretKey = crypto.createHash("sha256", "WebAppData").update(TELEGRAM_BOT_TOKEN).digest();

  // 使用密钥生成哈希值
  const hash = crypto.createHmac("sha256", secretKey).update(sdata).digest("hex");
  console.log(validData.initDataObj.hash + ":" + hash);
  // 比较哈希值
  if (hash === validData.initDataObj.hash) {
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
