//@login & register  登录和注册接口
const express = require("express");
//引入express路由功能
const router = express.Router();
//引入Profile
const Profile = require("../../models/Profile");

//引入passport 
const passport = require("passport");


// 路由   GET  api/profiles/test
// desc   返回请求的json数据
// access  公共接口（public） 
// router.get("/test",(req,res) => {
//   res.json({msg:"profiles done"})
// })

// 路由   POST  api/profiles/add
// desc   创建添加数据接口
// access  私有接口（private） 
router.post("/add",passport.authenticate("jwt",{session:false}),(req,res) => {    //token验证
  const profileFileds = {};
  //判断前端数据是否传递过来
  if(req.body.type) profileFileds.type = req.body.type                //用户类型
  if(req.body.describe) profileFileds.describe = req.body.describe     //描述
  if(req.body.income) profileFileds.income = req.body.income           //收入
  if(req.body.expend) profileFileds.expend = req.body.expend            //支出
  if(req.body.cash) profileFileds.cash = req.body.cash                   //现金
  if(req.body.remark) profileFileds.remark = req.body.remark            //备注

  new Profile(profileFileds).save().then( porfile => {
    //将数据返回数据库
    res.json(porfile);
  })
})  

// 路由   GET  api/profiles
// desc   获取所有接口的数据
// access  私有接口（private） 
router.get("/",passport.authenticate("jwt",{session:false}),(req,res) => {
  Profile.find()        //查找所有
  .then(profile => {
    if(!profile){
      return res.status(404).json("none!")
    }
    return res.json(profile);
  })
  .catch(err => res.status(404).json(err))
})

// 路由   GET  api/profiles/:id
// desc   获取单个的数据
// access  私有接口（private） 
router.get("/:id",passport.authenticate("jwt",{session:false}),(req,res) => {
  Profile.findOne({_id:req.params.id})      //查找所有
  .then(profile => {
    if(!profile){
      return res.status(404).json("none!")
    }
    return res.json(profile);
  })
  .catch(err => res.status(404).json(err))
})

// 路由   POST  api/profiles/edit/:id
// desc   创建编辑数据接口
// access  私有接口（private） 
router.post("/edit/:id",passport.authenticate("jwt",{session:false}),(req,res) => {
  const profileFileds = {};
  //判断前端数据是否传递过来(数据是否存在)
  if(req.body.type) profileFileds.type = req.body.type                //用户类型
  if(req.body.describe) profileFileds.describe = req.body.describe     //描述
  if(req.body.income) profileFileds.income = req.body.income           //收入
  if(req.body.expend) profileFileds.expend = req.body.expend            //支出
  if(req.body.cash) profileFileds.cash = req.body.cash                   //现金
  if(req.body.remark) profileFileds.remark = req.body.remark            //备注
  //更新数据
  Profile.findOneAndUpdate(
      {_id:req.params.id},
      {$set:profileFileds},
      {new:true}
    ).then( porfile => {
    //将数据返回数据库
    res.json(porfile);
  })
})

// 路由   DELETE  api/profiles/delete/:id
// desc   创建删除数据接口
// access  私有接口（private） 
router.delete("/delete/:id",passport.authenticate("jwt",{session:false}),(req,res) => {
  //更新数据
  Profile.findOneAndRemove({_id:req.params.id})
    .then(profile => {
      //保存数据，并返回被删除的数据
      profile.save().then(profile => res.json(profile));
    })
    .catch(err => res.status(404).json("删除失败！"));
});
module.exports = router;