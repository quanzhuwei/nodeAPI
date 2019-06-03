//引入express
const express = require("express");
//引入数据库
const mongoose = require('mongoose');
//引入bodyParser
const bodyParser = require("body-parser");
//实例化数据库对象
const db = require("./config/key").mongoURI;
//引入passport,passport-jwt
const passport = require("passport");
const passportJwt = require("passport-jwt");

//引入user.js
const users = require("./routes/api/user");
//引入user.js
const profiles = require("./routes/api/profiles");

//实例化对象
const app  = express();
//初始化body-parser中间件
app.use(bodyParser.urlencoded({extends:false}));
app.use(bodyParser.json());

//初始化passport
app.use(passport.initialize());
//把passport传入文件passport.js中，实现代码抽离
require("./config/passport")(passport);




//连接数据库
mongoose.connect(db)
  .then(() => { console.log("数据库连接成功！");})
  .catch(err => {console.log(err);})



//设置路由
app.get("/",(req,res) =>{
  res.send("hello world !")
})

//使用routes
app.use("/api/users",users);
app.use("/api/profiles",profiles);

//设置端口
const port  = process.env.PORT || 5000;

app.listen(port, () =>{
  console.log(`server running on localhost:${port}`);
})


