var express=require('express');
var router=express.Router();
var authenticate=require('./authentication');
var Dishes=require('./dishSchema').dish;
var Comments=require('./dishSchema').comment;
var jwt=require('jsonwebtoken');
var passport=require('passport');
var mongoose=require('mongoose');
function authenticateToken(req,res,next){
    var auth=req.headers['authorization'];
    if(!auth){
        res.statusCode=400;
        res.send("not authenticated");
    }
   else{
    var token=auth.split(' ')[1];
    if(token!=null){
      jwt.verify(token,authenticate.key,function(err,user){
        if(err)
        {
            res.statusCode=400;
          res.send("not authenticated"); 
        } 
        req.user=user;
          console.log(user);
          next();
      })
    }
}
    
};
function checkAdmin(req,res,next){
    
    if(req.user.admin===false)
    {   res.send("You are not authorized to perform this operation!");
        
    }
    next();
};
router.get("/",function(req,res,next){
Dishes.find({}).populate('comments.author').exec(function(err,dish){
        res.json(dish);
        
})
});
router.post("/",authenticateToken,checkAdmin,function(req,res,next){

    Dishes.insertMany(req.body,function(err,dish){
        res.send(dish);
    })
});
router.put("/:dishId",authenticateToken,checkAdmin,function(req,res){
   Dishes.findByIdAndUpdate(req.params.dishId,{$set:{name:req.body.name,rating:req.body.rating}})
   .then(function(dish){
       console.log('dish updated');
       res.send(dish);
   })

})
router.delete("/:dishId",authenticateToken,checkAdmin,function(req,res,next){

    Dishes.findByIdAndRemove(req.params.dishId,function(err,dish){
        console.log("dish deleted");
        res.send(dish);
    })
})
router.post("/:dishId/comments",authenticateToken,function(req,res){
     req.body.author=req.user.id;
     Dishes.findById(req.params.dishId,function(err,dish){
         dish.comments.push(req.body);
         dish.save().then(function(dish){
            console.log("comments push in dish");
             res.send(dish);
         })
        })     
     });
router.delete("/:dishId/comments/:commentId",authenticateToken,function(req,res){
    Dishes.findById(req.params.dishId).then(function(dish){
        var length=dish.comments.length;
       
        for(var i=0;i<length;i++)
        {    console.log("find ",dish.comments[i]._id,req.params.commentId,dish.comments[i].author);
             
            if(dish.comments[i]._id==req.params.commentId && req.user.id==dish.comments[i].author)
            {   
                    dish.comments.splice(i,1);
                    console.log("deleted comments");
                    dish.save().then(function(dish){
                        res.send(dish);
                    });
                    // res.send(dish);
                    
                    
                       
        }
    }
        
        res.send("cannot delete");
    }).catch(function(err){
        res.send("err");
    })
})
router.put("/:dishId/comments/:commentId",authenticateToken,function(req,res){
Dishes.findById(req.params.dishId).then(function(dish){
        var length=dish.comments.length;
        for(var i=0;i<length;i++)
        {
            if(dish.comments[i]._id==req.params.commentId && req.user.id==dish.comments[i].author)
            { 
               dish.comments[i].comment=req.body.comment;
               console.log("push");
               dish.save().then(function(dish){
                   res.send(dish);
               })
               
            
            }
        }
      res.send("cannot update"); 
    });
});

module.exports=router;