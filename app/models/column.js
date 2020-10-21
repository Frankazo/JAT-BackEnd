const mongoose = require("mongoose")

const columnSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },
    cards: [card.schema],
    title: {
      type: String,
      required: true,
    },
  },
  {
    // Date createdAt
    timestamps: true,
  }
)

module.exports = mongoose.model("Column", columnSchema)
