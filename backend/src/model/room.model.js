const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String }
}, { _id: false });

const roomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String },
  members: { type: [memberSchema], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  createdAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deletedByAdmin: { type: Boolean, default: false },
  deletedReason: { type: String },
  deletedAt: { type: Date }
});

const roomModel = mongoose.model("room", roomSchema);

module.exports = roomModel;
