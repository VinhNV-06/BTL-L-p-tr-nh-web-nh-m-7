const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    provider: { type: String, default: "local"},
    googleId: String,
    facebookId: String,
});
module.exports = mongoose.model("User", userSchema);