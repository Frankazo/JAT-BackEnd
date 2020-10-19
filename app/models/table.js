const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // TODO: Implement Model Column
    // columns: [ column.schema ],
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
