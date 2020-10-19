const mongoose = require("mongoose");
const column = require("./column");

const tableSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    columns: [column.schema],
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    deleted: {
      type: Boolean,
      required: true,
    },
  },
  {
    // Date createdAt
    timestamps: true,
  }
);

module.exports = mongoose.model("Table", tableSchema);
