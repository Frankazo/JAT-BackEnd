const mongoose = require("mongoose")

const cardSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Card", cardSchema)
