const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "User",
    },
    fullName: {
      type: "string",
      required: [true, "Please enter your full name and surname!"],
      minlength: [
        5,
        "The name and surname must consist of at least 5 characters!",
      ],
      maxlength: [30, "The name and surname cannot contain more than 30 characters"],
      validate: [
        {
          validator: (val) => val.match(/^[A-Za-z\s]+$/),
          message: "The name and surname can only contain characters!",
        },
        {
          validator: (val) => val.split(" ")?.length > 1,
          message: "Please enter your full name and surname!",
        },
      ],
    },
    location: {
      type: "string",
      required: [true, "Please indicate your place of residence"],
      enum: [
        "Addis Ababa",
        "Adama",
        "Adigrat",
        "Adwa",
        "Agaro",
        "Aksum",
        "Alaba Kulito",
        "Alamata",
        "Aleta Wendo",
        "Ambo",
        "Arba Minch",
        "Areka",
        "Arsi Negele",
        "Asella",
        "Assosa",
        "Awassa",
        "Bahir Dar",
        "Bale Robe",
        "Batu",
        "Bedessa",
        "Bishoftu",
        "Boditi",
        "Bonga",
        "Bule Hora Town",
        "Burayu",
        "Butajira",
        "Chiro",
        "Dangila",
        "Debre Birhan",
        "Debre Mark'os",
        "Debre Tabor",
        "Degehabur",
        "Dembi Dolo",
        "Dessie",
        "Dilla",
        "Dire Dawa",
        "Durame",
        "Fiche",
        "Finote Selam",
        "Gambela",
        "Gimbi",
        "Goba",
        "Gode",
        "Gonder",
        "Haramaya",
        "Harar",
        "Hosaena",
        "Jijiga",
        "Jimma",
        "Jinka",
        "Kobo",
        "Kombolcha",
        "Mekelle",
        "Meki",
        "Metu",
        "Mizan Teferi",
        "Mojo",
        "Mota",
        "Negele Borana",
        "Nekemte",
        "Sawla",
        "Sebeta",
        "Shashamane",
        "Shire (Inda Selassie)",
        "Sodo",
        "Tepi",
        "Waliso",
        "Weldiya",
        "Welkite",
        "Wukro",
        "Yirgalem",
      ],
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

    passwordChangedAt: {
      type: Date,
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

userSchema.statics.checkFields = function checkFields(body) {
  if (
    !body.fullName ||
    !body.location ||
    !body.email ||
    !body.password ||
    !body.passwordConfirm
  ) {
    return false;
  } else return true;
};

userSchema.method("hasChangedPassword", function () {
  if (!this.passwordChangedAt) return false;
  const now = new Date().getTime();
  const timestamp = new Date(this.passwordChangedAt).getTime();
  return timestamp > now;
});

userSchema.pre("save", async function (next) {
  if (!this.isNew) return next();
  this.passwordConfirm = undefined;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
