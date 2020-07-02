var passport=require('passport');
var localStrategy=require('passport-local').Strategy;
var bcrypt=require('bcrypt');
var User=require("./Schema");
var jwt=require('jsonwebtoken');
var crypto=require('crypto');
var secretkey=crypto.randomBytes(64).toString('hex');
passport.use(new localStrategy(function(username,password,done){
        User.findOne({username:username})
        .then(function(user){
             if(!user)
            {
                return done(null,false,{message:"user not found"});
            }
            else if(bcrypt.compareSync(password,user.password))
            {
                console.log("successfully login");
               
                return done(null,user);
            }
            else{
                  console.log("incorret password");
                  return done(null,false);
            }
        })

}));
exports.gentoken=function(user){
   return jwt.sign(user,secretkey,{ algorithm:"HS256"});
};
passport.serializeUser(function(user,done){
    return done(null,user.id);
})
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err)
        {
            return done(err);
        }
        return done(null,user);
    })
})
exports.key=secretkey;
