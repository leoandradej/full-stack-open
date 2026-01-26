const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
  },
  born: {
    type: Number,
    min: [1000, "Year must be 4 digits"],
    max: [9999, "Year must be 4 digits"],
    validate: {
      validator: function (value) {
        if (value == null) return true;

        return value >= 1000 && value <= 9999;
      },
      message: "Birth Year Must be a Four-Digit Year",
    },
  },
});

module.exports = mongoose.model("Author", schema);
