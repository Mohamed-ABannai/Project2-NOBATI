const isSignedIn = (req, res, next) => {
  if (req.session.user) {
    return next();
  }

  res.redirect("/auth/sign-in");
};


const isPatient = (req, res, next) => {
  if (req.session.user && req.session.user.role === "patient") {
    return next();
  }

  res.redirect("/auth/sign-in");
};


const isDoctor = (req, res, next) => {
  if (req.session.user && req.session.user.role === "doctor") {
    return next();
  }

  res.redirect("/auth/sign-in");
};


const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === "admin") {
    return next();
  }

  res.redirect("/auth/sign-in");
};


module.exports = {
  isPatient,
  isDoctor,
  isAdmin,
  isSignedIn
};