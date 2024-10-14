const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const agencySchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "Agency",
    },
    agencyName: {
      type: "string",
      required: [true, "Enter the name of the agency!"],
    },
    contactPerson: {
      type: "string",
      required: [true, "Please enter the name of the contact person"],
      validate: {
        validator: function (val) {
          return val.match(/^[A-Za-z\s]+$/);
        },
        message: "The contact person’s name can only contain characters",
      },
    },
    about: {
      type: String,
    },
    email: {
      type: "string",
      unique: [true, "The entered email is already in use."],
      required: [true, "Please enter your email!"],
      validate: {
        validator: (val) => val.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
        message: "Invalid email address format",
      },
    },
    password: {
      type: "string",
      required: [true, "Enter the passwor"],
      minlength: [6, "The password must contain at least 6 characters"],
      maxlength: [30, "The password can contain a maximum of 30 characters"],
    },
    passwordConfirm: {
      type: "string",
      required: [true, "Re-enter the password"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Passwords do not match!",
      },
    },
    phoneNumber: {
      type: "string",
      validate: {
        validator: (val) => val.match(/^\+?\d{1,3}[\s-]?\d{1,5}[\s-]?\d{1,9}$/),
        message: "Invalid phone number",
      },
    },
    instagram: {
      type: "string",
    },
    website: {
      type: "string",
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    reviews: [
      {
        reviewType: {
          type: String,
          enum: ["positive", "negative"],
        },
        reviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

agencySchema.statics.checkFields = function checkFields(body) {
  if (
    !body.agencyName ||
    !body.contactPerson ||
    !body.email ||
    !body.password ||
    !body.passwordConfirm
  ) {
    return false;
  } else return true;
};

agencySchema.method("hasChangedPassword", function () {
  if (!this.passwordChangedAt) return false;
  const now = new Date().getTime();
  const timestamp = new Date(this.passwordChangedAt).getTime();
  return timestamp > now;
});

agencySchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  this.passwordConfirm = undefined;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Agency = mongoose.model("Agency", agencySchema);

module.exports = Agency;
