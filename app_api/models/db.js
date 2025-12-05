const mongoose = require("mongoose");
const readline = require("readline");
mongoose.set("strictQuery", false);

const dbURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Loc8r";

// 2. 🔥 [필수] 로그 출력 (이게 제일 중요합니다!) 🔥
console.log("========================================");
console.log("▶ process.env.NODE_ENV:", process.env.NODE_ENV);
console.log("▶ process.env.MONGODB_URI:", process.env.MONGODB_URI);
console.log("▶ 최종 결정된 dbURI:", dbURI);
console.log("========================================");

mongoose.connect(dbURI);

mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.warn("Mongoose disconnected");
});

if (process.platform === "win32") {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.on("SIGINT", () => {
    process.emit("SIGINT");
  });
}

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

process.once("SIGUSR2", () => {
  gracefulShutdown("nodemon restart", () => {
    process.kill(process.pid, "SIGUSR2");
  });
});

process.on("SIGINT", () => {
  gracefulShutdown("app termination", () => {
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  gracefulShutdown("Heroku app shutdown", () => {
    process.exit(0);
  });
});

require("./locations");

require("./user");