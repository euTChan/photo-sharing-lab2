require("dotenv").config();
const mongoose = require("mongoose");
const models = require("../modelData/models");
const User = require("./userModel");
const Photo = require("./photoModel");
const SchemaInfo = require("./schemaInfo");

async function loadDatabase() {
  if (!process.env.DB_URL) throw new Error("Hay tao file .env va khai bao DB_URL.");

  try {
    await mongoose.connect(process.env.DB_URL);
    await Promise.all([
      User.deleteMany({}),
      Photo.deleteMany({}),
      SchemaInfo.deleteMany({})
    ]);

    const oldUsers = models.userListModel();
    const idMap = new Map();

    for (const oldUser of oldUsers) {
      const newUser = await User.create({
        first_name: oldUser.first_name,
        last_name: oldUser.last_name,
        location: oldUser.location,
        description: oldUser.description,
        occupation: oldUser.occupation
      });
      idMap.set(oldUser._id, newUser._id);
    }

    for (const oldUser of oldUsers) {
      const userPhotos = models.photoOfUserModel(oldUser._id);
      for (const oldPhoto of userPhotos) {
        const comments = (oldPhoto.comments || []).map((item) => ({
          comment: item.comment,
          date_time: item.date_time,
          user_id: idMap.get(item.user._id)
        }));
        await Photo.create({
          file_name: oldPhoto.file_name,
          date_time: oldPhoto.date_time,
          user_id: idMap.get(oldPhoto.user_id),
          comments
        });
      }
    }

    await SchemaInfo.create({ version: "1.0" });
    console.log("Nap du lieu mau thanh cong.");
  } finally {
    await mongoose.disconnect();
  }
}

loadDatabase().catch((error) => {
  console.error("Khong nap duoc du lieu:", error);
  process.exit(1);
});
