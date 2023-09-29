const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require("multer");
const multiPart = multer().none();



const app = express();
const indexRouter = require("./routes/index.route");
const signupRoute = require("./routes/signup.Routes")
const companyRoute = require("./routes/company.routes");
const userRoute = require("./routes/user.routes");
const loginRoute = require("./routes/login.route");
const tokenService = require("./services/token.service");
const profileRouter = require("./routes/profile.route");
const authController = require("./controller/auth.Controller");
const logoutRoute = require("./routes/logout.routes");
const studentsRoute = require("./routes/students.route");
const sendMailRoute = require("./routes/sendMail.routes");
const exportRoute = require("./routes/exports.route");
const accessRouter = require("./routes/access.routes");
const tokenRoute = require("./routes/token.routes");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(multiPart);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/",indexRouter);
app.use("/api/signup",signupRoute);
app.use("/api/login",loginRoute);




// impliminting api securty private company route middleware
app.use((request,response,next)=>{
const isVerified =  tokenService.verify(request);
if(isVerified.isVerified){
  // user is valid
  next();
}else{
  // clearCookie hav use cookeyParser not predefine
  response.clearCookie("authToken");
  response.status(401)
  response.redirect("/");
}
});


const authLogger =  ()=>{
return async (request,response,next)=>{
const isLogged = await authController.checkUserLogged(request,response);
if(isLogged){
  next();
}else{
  response.clearCookie("authToken");
  response.redirect("/");
}
}
}
app.use("/api/private/company",companyRoute);
app.use("/api/private/user",userRoute);
app.use("/students",studentsRoute);
app.use("/logout", logoutRoute);
// kisi 1 roote ko alag se sepret karna ke leye us roote me alag security laga saktay hen
app.use("/profile",authLogger(),profileRouter);
app.use("/sendMail",sendMailRoute);
app.use("/export-to-pdf",exportRoute);
app.use("/get-token",tokenRoute);
app.use("/access",accessRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
