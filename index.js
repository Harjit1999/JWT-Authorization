var express=require("express");
var bodyParser=require("body-parser");
var app=express();
var bcrypt=require('bcrypt');
var passport=require('passport');
var mongoose=require('mongoose');
var User=require("./Schema");
var authenticate=require('./authentication');
var url="mongodb://localhost:27017/InfoDb";
var jwt=require('jsonwebtoken');
var dishRouter=require("./dishRouter");
var userRouter=require("./UserRouter");
var connect=mongoose.connect(url,{useNewUrlParser:true,});
connect.then(function(db){
    console.log("database connected");
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/dish",dishRouter);
app.use("/user",userRouter);
app.get("/",function(req,res){
    User.find().then(function(user){
        res.send(user);
    })
    
})
// function authenticateToken(req,res,next){
//     var authHeader=req.headers["authorization"];
//     var token=authHeader.split(' ')[1];
//     if(token==null)
//     {
//         return res.send("not authenticated");
//     }
//     jwt.verify(token,authenticate.key,function(err,user){
//         if(err)
//         {   console.log(token);
//             res.sendStatus(403);
//         }
//           console.log(jwt.decode(token));
         
//             req.user=user;
//             console.log("user info",req.user);
//             next();
        

//     })
// };
// app.post("/register",function(req,res){
//     var password=genHash(req.body.password);
//     User.insertMany({username:req.body.username,password:password},function(err,user){
//         console.log("data inserted in database");
//          res.send(user);
//     })
// })
// app.get("/post",authenticateToken,function(req,res,next)
//  {  
//     User.findOne({username:req.user.username}).then(function(user){
//           console.log(user);
//           res.send(user);
//     })
// })
// app.post("/login",passport.authenticate('local'),function(req,res)
// {    user={
//      "username":req.body.username,
//     "admin":req.body.admin};
//     var token=authenticate.gentoken(user);
//     res.send({ token:token,user:req.user});
// });

app.listen(3000,function(){
    console.log("server listen at port 3000");
})
  
