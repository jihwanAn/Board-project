const express = require("express");
const router = express.Router();
const Comment = require("../schemas/Comment");
const { verifyToken } = require("../middleware/auth");

// 댓글 작성
router.post("/", verifyToken, async (req, res) => {
  try {
    const { board_id, content } = req.body;
    const userId = req.user;

    const comment = new Comment({
      board_id,
      writer_id: userId,
      content,
    });

    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러" });
  }
});

// 댓글 조회
router.get("/", async (req, res) => {
  try {
    const { board_id } = req.query;
    const comments = await Comment.find({ board_id }).populate(
      "writer_id",
      "name userId"
    );

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러" });
  }
});

// 댓글 수정
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러" });
  }
});

// 댓글 삭제
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러" });
  }
});

module.exports = router;
