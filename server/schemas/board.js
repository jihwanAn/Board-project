const mongoose = require("mongoose");

const { Schema } = mongoose;

const boardSchema = new Schema({
  writer_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  subject: {
    type: String,
    required: true,
  },
  writer: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Board", boardSchema);
