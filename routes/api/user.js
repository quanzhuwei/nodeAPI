//@login & register  登录和注册接口
const express = require("express");
//引入express路由功能
const router = express.Router();
//引入加密
const bcrypt = require("bcrypt");

//引入User
const User = require("../../models/User");

//引入头像功能gravator
const gravator = require('gravator');
//引入token
const jwt = require('jsonwebtoken');

//导入命名加密
const keys = require("../../config/key");
//引入passport 
const passport = require("passport");


// 路由   GET  api/users/test
// desc   返回请求的json数据
// access  公共接口（public） 
// router.get("/test",(req,res) => {
//   res.json({msg:"login done"})
// })

// 路由   POST  api/users/register      注册接口
// desc   返回请求的json数据
// access  公共接口（public） 
router.post("/register",(req,res) => {
  //console.log(req.body);    // req:请求，    res:响应
  User.findOne({email:req.body.email})
  .then(user => {                 //查找判断数据库是否存在已注册的邮箱
    if (user) {
      return res.status(400).json("邮箱已被注册！");
    }else{
      const newUser = new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        identity:req.body.identity
      })
      //对password进行hash加密
      bcrypt.genSalt(10 , function(err, salt){
        bcrypt.hash(newUser.password, salt ,(err , hash) => {
          //console.log(newUser);
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
            .then( user => res.json(user))
            .catch( err => {console.log("数据错误")})
        })
      })
    }
  })
})

// 路由   POST  api/users/login      登录接口
// desc   返回token jwt  passport
// access  公共接口（public） 
router.post("/login",(req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  //判断邮箱是否存在
  User.findOne({email})
    .then(user => {
      if(!user){               //判断用户是否存在
        return res.status(404).json("用户不存在！");
      }
      //密码匹配,前端页面的password 和  数据库中的password
      bcrypt.compare(password,user.password)
        .then(isMatch =>{
          if(isMatch){
            //定义规则,因为token还需要在前端进行解析，所以不能把密码加入进去
            const rule = { id:user.id, name:user.name,identity:user.identity}
            //jwt.sign("rule规则","name命名加密","timer过期时间","function箭头函数");
            jwt.sign(rule,keys.secretOrkey,{expiresIn:3600},(err, token) =>{
              if(err) throw err;
              res.json({
                success:true,
                token:"Bearer "+token
              });
            });
           // res.json({msg:"success"})
          }else{
            return res.status(404).json("密码错误！");
          }
        })
    })
})
// 路由   POST  api/users/current      获取用户登录数据接口
// desc   返回token jwt  passport
// access  公共接口（public） 
//使用token的认证方式
router.get("/current",passport.authenticate("jwt",{session:false}),(req,res) => {
  //对用户返回信息
  res.json({
    id:req.user.id,
    name:req.user.name,
    email:req.user.email,
    identity:req.user.identity
  });
})
module.exports = router;