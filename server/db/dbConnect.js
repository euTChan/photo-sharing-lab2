const mongoose = require("mongoose");
require("dotenv").config();

async function connectDatabase() {
  if (!process.env.DB_URL) {
    throw new Error("Chua cau hinh DB_URL trong file .env");
  }
  await mongoose.connect(process.env.DB_URL);
  console.log("Da ket noi MongoDB.");
}

module.exports = connectDatabase;
