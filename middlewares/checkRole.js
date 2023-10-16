const User = require("../models/User");

exports.checkRole = (roles) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!roles.includes(user.role)) {
      const error = new Error("You are not authorized to access this route.");
      error.status = 401;
      return next(error);
    }
    next();
  } catch (err) {
    const error = new Error("User not found.");
    error.status = 401;
    error.data = err.message;
    return next(error);
  }
};

// exports.checkRole = async (req, res, next, role) => {
//   console.log(role);
//   if (req.user.role !== role) {
//     const error = new Error("You are not authorized to access this page.");
//     error.status = 401;
//     return next(error);
//   }
//   next();
// };
