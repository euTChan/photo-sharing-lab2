const express = require("express");
const mongoose = require("mongoose");
const Photo = require("../db/photoModel");
const User = require("../db/userModel");

const router = express.Router();

router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  if (!/^[a-fA-F0-9]{24}$/.test(userId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Ma nguoi dung khong hop le." });
  }

  try {
    const userExists = await User.exists({ _id: userId });
    if (!userExists) {
      return res.status(400).json({ message: "Khong tim thay nguoi dung." });
    }

    const photos = await Photo.find({ user_id: userId })
      .select("_id user_id comments file_name date_time")
      .lean();

    const authorIds = [...new Set(
      photos.flatMap(photo => (photo.comments || [])
        .map(comment => comment.user_id && comment.user_id.toString())
        .filter(Boolean))
    )];

    const authors = authorIds.length
      ? await User.find({ _id: { $in: authorIds } })
          .select("_id first_name last_name")
          .lean()
      : [];

    const authorMap = new Map(authors.map(author => [author._id.toString(), author]));

    const responseData = photos.map(photo => ({
      _id: photo._id,
      user_id: photo.user_id,
      file_name: photo.file_name,
      date_time: photo.date_time,
      comments: (photo.comments || []).map(comment => {
        const author = comment.user_id
          ? authorMap.get(comment.user_id.toString())
          : null;
        return {
          _id: comment._id,
          comment: comment.comment,
          date_time: comment.date_time,
          user: author ? {
            _id: author._id,
            first_name: author.first_name,
            last_name: author.last_name
          } : null
        };
      })
    }));

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Loi lay anh cua nguoi dung:", error);
    res.status(500).json({ message: "Khong the lay anh cua nguoi dung." });
  }
});

module.exports = router;
