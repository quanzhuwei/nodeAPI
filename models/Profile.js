//信息接口      数据模型

//引入数据库
const mongoose = require('mongoose');
//
const Schema = mongoose.Schema;
const ProfileSchema  = new Schema({
  date:{
    type:Date,
    default:Date.now
  },
  type:{        //用户类型
    type:String
  },
  describe:{    //描述
    type:String
  },
  income:{      //收入
    type:String,
    require:true
  },
  expend:{       //支出
    type:String,
    require:true
  },
  cash:{         //现金
    type:String,
    require:true
  },
  remark:{       //备注
    type:String
  },
})

//曝光出去
module.exports = Profile = mongoose.model("Profile",ProfileSchema);