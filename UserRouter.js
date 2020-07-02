var express=require('express');
var router=express.Router();
var User=require("./Schema");
var jwt=require('jsonwebtoken');
var passport=require('passport');
var bcrypt=require('bcrypt');
var authenticate=require("./authentication");
function authenticateToken(req,res,next){
    
    var authHeader=req.headers["authorization"];
    if(!authHeader){
        res.statusCode=400;
        res.send("You are not authenticated");
    }
    var token=authHeader.split(' ')[1];
    if(token==null)
    {
        return res.send("not authenticated");
    }
    jwt.verify(token,authenticate.key,function(err,user){
        if(err)
        {   console.log(token);
            res.sendStatus(403);
        }
          console.log(jwt.decode(token));
            req.user=user;
        

    })
    console.log("user info",req.user);
        next();
 };
 function checkAdmin(req,res,next){
    
     if(req.user.admin===false)
     {   res.send("You are not authorized to perform this operation!");
         
     }
     next();
 };

router.get("/",authenticateToken,checkAdmin,function(req,res,next){
//     console.log("user route",req.user);
//    if(req.user.admin===true)
   
       User.find().then(function(user){
       res.send(user);
   }).catch(function(err){
       console.log("you are not permitted to view users");
   }) 
   //else{
//     console.log("you are not an admin");
//     res.statusCode=400;
//     res.send("You are not allowed");
//}
  //res.send("you are not allowed");
});
router.post("/register",function(req,res){
    var password=genHash(req.body.password);
    User.insertMany({username:req.body.username,password:password},function(err,user){
        console.log("data inserted in database");
         res.send(user);
    })
})
router.get("/post",authenticateToken,function(req,res,next)
 {  
    User.findOne({username:req.user.username}).then(function(user){
          console.log(user);
          res.send(user);
    })
})
router.post("/login",passport.authenticate('local',{session:"false"}),function(req,res)
{   
    var user={
        id:req.user._id,
     username:req.user.username,
     admin:req.user.admin };
    console.log("admin",user.admin);
    var token=authenticate.gentoken(user);
    res.send({ token:token,user:req.user});
});
function genHash(pwd)
{
    return bcrypt.hashSync(pwd,10);
}
module.exports=router;