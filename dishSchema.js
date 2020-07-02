var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var user=require('./Schema');
var commentSchema=new Schema({
    comment:{
        type:String
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:'user'
    }
})
var dishSchema=new Schema({
    name:{
        type:"String"
    },
    rating:{
        type:Number,
    },
    comments:[commentSchema]
});
var dish=mongoose.model("dish",dishSchema);
var comment=mongoose.model('comment',commentSchema);
module.exports={
    dish,comment
};