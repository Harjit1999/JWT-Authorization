var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var UserSchema=new Schema({
    username:{
        type:String,
        required:true
    },
    password:{

        type:String,
        required:true
    },
    admin:{
        type:Boolean,
        default:false
    }
});
var user=mongoose.model("user",UserSchema);
module.exports=user;