const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true, // space 없애는 역할
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  // 유효성 관리
  token: {
    type: String
  },
  // 토큰 유효기간
  tokenExp: {
    type: Number
  }
})

const User = mongoose.model('User', userSchema) // 스키마를 모델로 감싸준다.

module.exports = { User } // 다른 곳에서도 쓸 수 있게 export