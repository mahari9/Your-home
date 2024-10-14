const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const catchAsync = require(path.join(
  __dirname,
  "..",
  "utilities",
  "catchAsync"
));
const AppError = require(path.join(__dirname, "..", "utilities", "AppError"));
const User = require(path.join(__dirname, "..", "models", "User.js"));
const Blacklist = require(path.join(__dirname, "..", "models", "Blacklist" ));
const generateJWT = require(path.join(
  __dirname,
  "..",
  "utilities",
  "generateJWT"
));
const Agency = require(path.join(__dirname, "..", "models", "Agency"));
const { validationResult } = require("express-validator");

exports.register = catchAsync(async (req, res, next) => {
  //check if user has filled all required fields
  if (!User.checkFields(req.body))
    return next(
      new AppError(400, "Please enter data in all required fields!")
    );

  //format users input
  const nameArr = req.body.fullName.toLowerCase().split(" ");
  formatedName = nameArr
    .map((el) => el[0].toUpperCase() + el.slice(1))
    .join(" ");

  req.body.fullName = formatedName;
  //save user
  const user = await User.create(req.body);

  //generate jwt that will be stored in cookie
  const token = generateJWT(user.id, res);

  return res.status(200).json({
    status: "success",
    message: `${user.fullName}, welcome!`,
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return next(new AppError(400, "Please enter the required data!"));
  const [user, agency] = await Promise.all([
    User.findOne({ email: req.body.email }),
    Agency.findOne({ email: req.body.email }),
  ]);

  const validProfile = user || agency;
  if (!validProfile) return next(new AppError(401, "Invalid email/password"));

  const decrypted = await bcrypt.compare(
    req.body.password,
    validProfile.password
  );
  if (!decrypted) return next(new AppError(401, "Invalid email/password"));
  //generate jwt that will be stored in cookie
  const token = generateJWT(validProfile.id, res);
  res.status(200).json({
    status: "success",
    message: `You have successfully logged in`,
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) return next(new AppError(401, "Unauthorized, please login!"));

  const verified = jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
    if (err) return next(new AppError(401, "invalid token, please login!"));
    return token;
  });

  const [user, agency] = await Promise.all([
    User.findById(verified.id).select("-password"),
    Agency.findById(verified.id).select("-password"),
  ]);

  const validProfile = user || agency;
  if (validProfile) {
    if (validProfile.hasChangedPassword())
      return next(
        new AppError(401, "Password changed in meantime, please login again!")
      );
    req.user = validProfile;
    next();
  } else
    return next(new AppError(401, "User doesn't exist anymore! Please login"));
});

exports.registerAgency = catchAsync(async (req, res, next) => {
  if (!Agency.checkFields(req.body))
    return next(
      new AppError(400, "Please enter data in all required fields!")
    );

  //save agency
  const agency = await Agency.create(req.body);

  //generate jwt that will be stored in cookie
  const token = generateJWT(agency.id, res);

  return res.status(200).json({
    status: "success",
    message: `${agency.agencyName}, welcome!`,
    token,
  });
});

exports.loginAgency = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return next(new AppError(400, "Please enter the required data!"));
  const agency = await Agency.findOne({ email: req.body.email });
  if (!agency) return next(new AppError(401, "Invalid email/password"));
  const decrypted = await bcrypt.compare(req.body.password, agency.password);
  if (!decrypted) return next(new AppError(401, "Invalid email/password"));
  //generate jwt that will be stored in cookie
  const token = generateJWT(agency.id, res);
  res.status(200).json({
    status: "success",
    message: `You're successfully logged in`,
    token,
  });
});

exports.verify = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return next(new AppError(401, "Unathorized"));
  const verified = jwt.verify(token, process.env.JWT_SECRET, (err, token) => {
    if (err) return next(new AppError(401, "invalid token, please login!"));
    return token;
  });
  const authHeader = req.headers["cookie"];
  if (!authHeader) return next(new AppError(401, "Unauthorized"));

  const cookie = authHeader.split("=")[1];
  const accessToken = cookie.split(";")[0];

  const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });
  if (checkIfBlacklisted) {
    return res.status(401).json({ message: "This session has expired. Please login" });
  }
  const { id } = verified;
  const [user, agency] = await Promise.all([
    User.findById(id).select("-password").populate("posts"),
    Agency.findById(id).select("-password").populate("posts"),
  ]);
  const validProfile = user || agency;
  if (!validProfile)
    return next(new AppError(401, "User doesn't exist anymore! Please login"));
  if (validProfile.hasChangedPassword())
    return next(new AppError(401, "Password changed in meantime, please login again!"));
  req.user = validProfile;
  res.status(200).json({
    status: "success",
    user: validProfile,
  });
});

exports.makeReview = catchAsync(async (req, res, next) => {
  const [user, agency] = await Promise.all([
    User.findById(req.params.profileId),
    Agency.findById(req.params.profileId),
  ]);

  const validProfile = user || agency;
  if (validProfile._id.toString() === req.user._id.toString())
    return next(new AppError("You cannot rate your profile"));
  if (!validProfile) return next(new AppError(404, "User/Agency not found!"));

  validProfile.reviews.push({
    reviewType: req.body.reviewType,
    reviewer: req.user.id,
  });

  await validProfile.save({ validateBeforeSave: false });
  return res.status(200).json({
    status: "success",
    message: "You have successfully rated the profile",
  });
});

exports.getProfileData = catchAsync(async (req, res, next) => {
  const results = validationResult(req);
  if (results.errors.length !== 0) return next(new AppError(400, "Invalid id"));

  const [user, agency] = await Promise.all([
    User.findById(req.params.profileId)
      .select("-password -passwordChangedAt -createdAt -updatedAt")
      .populate("posts"),
    Agency.findById(req.params.profileId)
      .select("-password -passwordChangedAt -createdAt -updatedAt")
      .populate("posts"),
    ,
  ]);

  const validProfile = user || agency;
  if (!validProfile) return next(new AppError(404, "An error has occurred"));

  return res.status(200).json({
    status: "success",
    validProfile,
  });
});

exports.rateProfile = catchAsync(async (req, res, next) => {
  const [user, agency] = await Promise.all([
    User.findById(req.params.profileId),
    Agency.findById(req.params.profileId),
  ]);
  const validProfile = user || agency;

  if (
    validProfile.reviews.some(
      (el) => el.reviewer.toString() == req.user._id.toString()
    )
  ) {
    validProfile.reviews.find(
      (el) => el.reviewer.toString() === req.user._id.toString()
    ).reviewType = req.body.reviewType;
  } else {
    validProfile.reviews.push({
      reviewType: req.body.reviewType,
      reviewer: req.user.id,
    });
  }

  await validProfile.save({ validateBeforeSave: false });
  return res.status(200).json({
    status: "success",
  });
});

// Logout Logic
exports.logout = catchAsync(async (req, res, next) => {
  try {
    const authHeader = req.headers['cookie'];
    if (!authHeader) return res.sendStatus(204);
    const cookie = authHeader.split('=')[1];
    const accessToken = cookie.split(';')[0];
    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });
    // if true, send a no content response.
    if (checkIfBlacklisted) return res.sendStatus(204);
    // otherwise blacklist token
    const newBlacklist = new Blacklist({
      token: accessToken,
    });
    await newBlacklist.save();
    // Also clear request cookie on client
    res.setHeader('Clear-Site-Data', '"cookies"');
    res.status(200).json({
      status: "success",
      message: 'Logout successful!',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Logout failed',
    });
  }
  res.end();
});