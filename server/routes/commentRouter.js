const express = require("express");
const router = express.Router();
const Comment = require("../schemas/Comment");
const User = require("../schemas/User");
const Board = require("../schemas/Board");
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

    // 사용자에게 댓글 추가
    const user = await User.findById(userId);
    user.comments.push(comment._id);
    await user.save();

    // 게시글에 댓글 추가
    const board = await Board.findById(board_id);
    board.comments.push(comment._id);
    await board.save();

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

// 대댓글 작성
router.post("/:parentCommentId/reply", verifyToken, async (req, res) => {
  try {
    const { board_id, content } = req.body;
    const userId = req.user;
    const parentCommentId = req.params.parentCommentId;

    // 부모 댓글 확인
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      return res.status(404).json({ error: "부모 댓글을 찾을 수 없습니다." });
    }

    // 대댓글 생성
    const reply = new Comment({
      board_id,
      writer_id: userId,
      content,
      parent_comment: parentCommentId,
    });

    await reply.save();

    // 사용자 확인 및 대댓글 추가
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }
    if (!user.comments) {
      user.comments = [];
    }
    user.comments.push(reply._id);
    await user.save();

    // 부모 댓글에 대댓글 추가
    if (!parentComment.replies) {
      parentComment.replies = [];
    }
    parentComment.replies.push(reply._id);
    await parentComment.save();

    res.status(200).json(reply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러" });
  }
});

module.exports = router;
