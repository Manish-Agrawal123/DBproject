if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
}


const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require("./utils/ExpressError.js");
const ejsMate = require("ejs-mate");
const listingRouter= require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");


const session = require("express-session");
const MongoStore = require('connect-mongo').default;
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl=process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "public")));
app.engine('ejs', ejsMate);
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
  limit: "10kb",
  parameterLimit: 100
}));


const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret: process.env.SECRETE,
  },
  touchAfter: 24 * 3600 // time period in seconds
});

store.on("error",(err)=>{
  console.log("Error in mongo session store",err);
})

const sessionOpt ={
  store,
  secret: process.env.SECRETE,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
};


async function main() {
  await mongoose.connect(dbUrl);
}

main().then((res)=>{
  console.log("Database connection successful");
})
.catch(err => console.log(err));

app.use(session(sessionOpt));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.userCurr = req.user;
  next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
   

app.use((req,res,next)=>{
  next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
  let{status=500,message="something went wrong"}=err;
  res.status(status).render("error.ejs",{message});
})

app.listen(8080,'0.0.0.0',()=>{
  console.log("app is listering");
});