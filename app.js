var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash = require('express-flash');
var session = require('express-session');

const authController = require('./controllers/authController');
const mainRouter = require('./routes/main');
const usersManagement = require('./routes/usersManagement');
const logOutRouter = require('./routes/logOut');
const createAccountRouter = require('./routes/createAccount');
const addUserRouter = require('./routes/editUser');
const moviesRouter = require('./routes/movies');
const subscriptionsRouter = require('./routes/subscriptions');
const membersRouter = require('./routes/members');

const {
  requireAuth,
  getCurrentUser,
  userTimeoutController,
  watchMoviesPermission,
  watchSubscriptionsPermission,
  manageUsersPermission } = require('./middleware/authMiddleware');

var app = express();

require('./configs/database');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 24 hours in seconds
const maxAge = 24 * 60 * 60;

app.use(session({
  secret: 'my own secret',
  cookie: {
    maxAge: Date.now() + 86400000, //24 Hour
  },
}))
app.use(flash());

app.use(userTimeoutController)
app.use('*', getCurrentUser);
app.use('/', authController);
app.use('/createAccount', createAccountRouter);
app.use('/main', requireAuth, mainRouter);
app.use('/usersManagement', requireAuth, manageUsersPermission, usersManagement);
app.use('/logout', requireAuth, logOutRouter);
app.use('/editUser', requireAuth, manageUsersPermission, addUserRouter);
app.use('/movies', requireAuth, watchMoviesPermission, moviesRouter);
app.use('/subscriptions', requireAuth, watchSubscriptionsPermission, subscriptionsRouter);
app.use('/members', requireAuth, membersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
