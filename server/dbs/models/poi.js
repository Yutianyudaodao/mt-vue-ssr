import mongoose from 'mongoose'
const Schema = mongoose.Schema
const Poi = new Schema({
  name: {
    type: String//景点名
  },
  province: {
    type: String
  },
  city:{
    type:String
  },
  county:{
    type:String
  },
  areaCode:{
    type:String
  },
  tel:{
    type:String
  },
  area:{
    type:String
  },
  addr:{
    type:String
  },
  type:{
    type:String
  },
  module:{
    type:String
  },
  longitude:{
    type:Number //经度
  },
  latitude:{
    type:Number //纬度
  }
})

export default mongoose.model('Poi', Poi)
