const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "creatorType",
    },
    creatorType: {
      type: "string",
      enum: ["User", "Agency"],
    },
    title: {
      type: "string",
      required: [true, "Enter the title of your post"],
      minlength: [8, "The title must contain at least 8 characters"],
      maxlength: [90, "The title can only contain 60 characters"],
    },
    subtitle: {
      type: "string",
      required: [true, "Enter the subtitle of your post"],
      minlength: [8, "The subtitle must contain at least 8 characters"],
      maxlength: [90, "The subtitle can only contain 60 characters"],
    },
    description: {
      type: "string",
      required: [true, "Enter a description of your post"],
      minlength: [10, "The description must contain at least 10 characters"],
    },
    price: {
      type: Number,
      required: [true, "Enter the price of your property"],
    },
    imgs: [
      {
        type: String,
      },
    ],
    location: {
      type: "string",
      required: [true, "Please mark where the object is located"],
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
    newbuilding: {
      type: Boolean,
    },
    furnished: {
      type: Boolean,
    },
    heating: {
      type: "string",
      required: [true, "Select the type of heating"],
      enum: ["gas", "central", "without heating"],
    },
    roomNum: {
      required: [true, "Indicate how many rooms there are"],
      type: Number,
    },
    listingPurpose: {
      type: "string",
      required: [true, "Select the type of advertisement!"],
      enum: ["sale", "renting"],
    },
    floor: {
      type: Number,
    },
    square_meters: {
      required: [true, "Enter the number of square meters"],
      type: Number,
    },
    parking: {
      required: [true, "Enter whether the property has a parking"],
      type: Boolean,
    },
    indexed: {
      required: [true, "“Enter whether the property is registered"],
      type: Boolean,
    },
    typeProperty: {
      type: "string",
      enum: ["house", "apartment"],
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    coords: {
      type: [String],
      required: [true, "Mark on the map where your property is located"],
    },
    finished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
