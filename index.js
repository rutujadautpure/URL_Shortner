const express = require("express")
const ejs = require("ejs")

const app=express();
const port = 3000;

const mongoose = require("mongoose")
const URLroute = require("./routes/url")
const URL = require("./models/url")
const path =require("path");
const staticRouter = require("./routes/staticRouter");
const cookieParser = require("cookie-parser")
const {restrictToLoggedInUser,checkAuth} = require("./middlewares/auth")

const userRouter = require("./routes/user");

mongoose.connect("mongodb://localhost:27017/url_shortner")
.then(()=>{
    console.log("MongoDB Connected!!");
})
.catch((err)=>{
  console.log(err);
})

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));


//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended : false}))   //To support form data
app.use(cookieParser());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/url',restrictToLoggedInUser,URLroute);
app.use('/user',userRouter);
app.use('/',checkAuth,staticRouter);
// app.use('/',checkAuth,staticRouter);



app.get('/url/:shortId',async (req,res)=>{
  shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {shortId},
    {
      $push:{
        visitHistory : [{timestamp  : Date.now()}]
      },
    }
  )
  res.redirect(entry.redirectURL);
})



app.listen(port,()=>{
    console.log(`Server running at port ${port}`);
})