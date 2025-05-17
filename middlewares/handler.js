const { session } = require("passport");


const logError = (req, res, next) => {
  res.locals.authErrors = req.flash('error');
  res.locals.errors = req.flash('errors');
  next();
}

const isAuth = (req, res, next) => {
  res.locals.isAuth = req.isAuthenticated()
  next();
}

function isAuthMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

const logCurrentUser = (req, res, next) => {
  res.locals.currentUser = req.user
  console.log(`Session ID: ${req.sessionID}`)
  console.log('User:', req.user);

  next()
}

const formatCreatedDate = (req, res, next) => {
  res.locals.formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  }
  next()
}


const getParentFolderId = (req, res, next) => {
  const path = req.path.split('/')
  console.log(path)
  const foldersIdx = path.indexOf('folders')
  if (foldersIdx != -1 && foldersIdx + 1 < path.length) {
    console.log('PATH: ', path[foldersIdx + 1])
    req.parentFolderId = path[foldersIdx + 1]
  }else{
    req.parentFolderId = null
  }
  next()
}


module.exports = {
  logError,
  isAuth,
  isAuthMiddleware,
  logCurrentUser,
  formatCreatedDate,
  getParentFolderId
}