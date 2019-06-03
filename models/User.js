//用户数据模型

//引入数据库
const mongoose = require('mongoose');
//
const Schema = mongoose.Schema;
const UserSchema  = new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  avatar:{
    type:String,
  },
  date:{
    type:Date,
    default:Date.now
  },
  identity:{
    type:String,
    required:true
  }
})

//曝光出去，将User接口暴露出去
module.exports = User = mongoose.model("user",UserSchema);