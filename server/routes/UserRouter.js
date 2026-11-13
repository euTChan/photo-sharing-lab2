const express = require("express");
const mongoose = require("mongoose");
const User = require("../db/userModel");

const router = express.Router();

router.get("/list", async (req, res) => {
  try {
    const userList = await User.find({})
      .select("_id first_name last_name")
      .lean();
    res.status(200).json(userList);
  } catch (error) {
    console.error("Loi lay danh sach nguoi dung:", error);
    res.status(500).json({ message: "Khong the lay danh sach nguoi dung." });
  }
});

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  if (!/^[a-fA-F0-9]{24}$/.test(userId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Ma nguoi dung khong hop le." });
  }

  try {
    const user = await User.findById(userId)
      .select("_id first_name last_name location description occupation")
      .lean();

    if (!user) {
      return res.status(400).json({ message: "Khong tim thay nguoi dung." });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Loi lay thong tin nguoi dung:", error);
    res.status(500).json({ message: "Khong the lay thong tin nguoi dung." });
  }
});

module.exports = router;
