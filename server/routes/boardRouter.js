const express = require("express");
const router = express.Router();
const Board = require("../schemas/board");
const User = require("../schemas/user");
const { checkOwnership, verifyToken } = require("../middleware/auth");

// 게시물 작성
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user;

    // 사용자 정보 조회
    const user = await User.findById(userId);
    console.log(user);

    // 게시물 작성
    const { subject, content } = req.body;
    const board = new Board({
      writer_id: user._id,
      userId: userId,
      writer: user.name,
      subject,
      content,
    });

    await board.save();

    user.posts.push(board._id);

    await user.save();

    res
      .status(201)
      .json({ idx: board._id, newAccessToken: req.newAccessToken }); // 저장된 글의 ID, new토큰 클라이언트로 전송
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러" });
  }
});

// 게시물 수정
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(board);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러" });
  }
});

// 게시물 삭제
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Board.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러" });
  }
});

// 게시물 목록 조회
router.get("/", async (req, res) => {
  try {
    const boards = await Board.find();
    res.status(200).json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 에러" });
  }
});

// 게시물 상세 조회
router.get("/:id", verifyToken, checkOwnership, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      res.status(404).json({ message: "게시물을 찾을 수 없습니다" });
      return;
    }

    board.views += 1;
    await board.save();

    const isOwner = req.isOwner;

    return res.status(200).json({ board, isOwner });
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 에러");
  }
});

module.exports = router;
