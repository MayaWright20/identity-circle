import { asyncError } from "../middleware/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import { cookieOptions, sendToken } from "../utils/feature.js";

export const login = asyncError(async (req, res, next) => {
  const { email, password, username } = req.body;

  const user = await User.findOne({
    $or: [{ email: email || username }, { username: email || username }],
  }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const isMatched = await user.comparePassword(password);

  if (!isMatched) {
    return next(new ErrorHandler("Incorrect Details", 400));
  }

  sendToken(user, res, `Hey ${user.name}`, 200);
});

export const logout = asyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      ...cookieOptions,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged out successfully ",
    });
});

export const signUp = asyncError(async (req, res, next) => {
  const { name, email, password, username, phone } = req.body;

  let user = await User.findOne({
    $or: [{ email: email }, { username: username }],
  });

  let usernameTaken = await User.findOne({ username: username });
  if (usernameTaken)
    return next(new ErrorHandler("Username taken", 400, "username"));

  let emailTaken = await User.findOne({ email: email });
  if (emailTaken) return next(new ErrorHandler("Email taken", 400, "email"));

  if (user) return next(new ErrorHandler("User already signed in", 400));

  user = await User.create({ name, email, password, username, phone });

  sendToken(user, res, "Welcome!", 201);
});

export const getMyProfile = asyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

export const deleteMyProfile = asyncError(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.user._id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Profile deleted successfully",
  });
});
