const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentSchema = new Schema({
  board_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Board",
  },
  writer_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
  parent_comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null, // 부모 댓글이 없는 경우
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
