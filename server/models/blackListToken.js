const mongoose = require("mongoose");

const blacklistedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
});

const BlackListModule = new mongoose.model("blacklist", blacklistedTokenSchema);
module.exports = { BlackListModule };
