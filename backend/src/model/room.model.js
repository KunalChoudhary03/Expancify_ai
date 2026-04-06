const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String }
}, { _id: false });

const joinedUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  email: { type: String, required: true },
  username: { type: String },
  selectedMemberId: { type: String },
  selectedMemberName: { type: String },
  joinedAt: { type: Date, default: Date.now }
}, { _id: false });

const roomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String },
  members: { type: [memberSchema], default: [] },
  joinedUsers: { type: [joinedUserSchema], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  createdAt: { type: Date, default: Date.now },
  deleted: { type: Boolean, default: false },
  deletedByAdmin: { type: Boolean, default: false },
  deletedReason: { type: String },
  deletedAt: { type: Date }
});

const roomModel = mongoose.model("room", roomSchema);

module.exports = roomModel;
