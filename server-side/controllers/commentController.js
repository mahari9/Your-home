const { default: mongoose } = require("mongoose");
const path = require("path");
const Post = require(path.join(__dirname, "..", "models", "Post.js"));
const Comment = require(path.join(__dirname, "..", "models", "Comment"));
const catchAsync = require(path.join(
  __dirname,
  "..",
  "utilities",
  "catchAsync"
));
const AppError = require(path.join(__dirname, "..", "utilities", "AppError"));
const { validationResult } = require("express-validator");
const e = require("express");

exports.comment = catchAsync(async (req, res, next) => {
  const comment = req.body.comment;
  if (!comment) return next(new AppError(400, "Enter message!"));

  const post = await Post.findById(req.params.postId).populate({
    path: "creator",
    select: "email",
  });

  if (!post)
    return next(
      new AppError(
        400,
        "An error occurred while posting your comment"
      )
    );

  if (post.creator.email === req.user.email)
    return next(
      new AppError(400, "You cannot post public questions on your own posts!")
    );

  const newComm = await Comment.create({
    post: post.id,
    creator: req.user.id,
    creatorType: req.user.role,
    comment,
  });

  post.comments.push(newComm.id);
  await post.save({ validateBeforeSave: false });
  res.status(201).json({
    status: "success",
    message: "You have successfully posted a public comment!",
  });
});

exports.answerComment = catchAsync(async (req, res, next) => {
 // You respond to a comment by passing the comment ID as a parameter when calling the API
// Then you check if the creator of the post is the current user who is calling the API
// If they are, you set the response in the answer property of this comment object
  const comment = await Comment.findById(req.params.commentId).populate({
    path: "post",
    populate: { path: "creator" },
  });

  const { creator } = comment.post;
  if (creator.email !== req.user.email)
    return next(new AppError(401, "You do not have permission to perform this action!"));

  if (!req.body.answer) return next(new AppError(400, "Enter the answer!"));

  comment.answer = req.body.answer;
  await comment.save({ validateBeforeSave: false });
  return res.status(200).json({
    status: "success",
    message: "You have successfully posted an answer to the question",
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const results = validationResult(req);
  if (results.errors.length !== 0) return next(new AppError(400, "Invalid id"));

  const comment = await Comment.findById(req.params.commentId);
  if (!comment) return next(404, "An error has occurred");

  if (req.user._id.toString() !== comment.creator.toString())
    return next(
      new AppError(401, "You don't have permission to perform this operation")
    );

  await Comment.findByIdAndDelete(req.params.commentId);
  res.status(200).json({
    status: "success",
    message: "Public question deleted",
  });
});

exports.deleteAnswer = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId).populate({
    path: "post",
    select: "creator",
  });

  if (comment.post.creator._id.toString() !== req.user._id.toString())
    return next(
      new AppError(400, "You don't have permission to perform this operation")
    );
  comment.answer = undefined;
  await comment.save({ validateBeforeSave: false });
  return res.status(200).json({
    status: "success",
    message: "Answer deleted",
  });
});
