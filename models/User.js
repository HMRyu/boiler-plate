const mongoose = require('mongoose'); // mongoose 추가
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken');

// 스키마 생성
// 이름, e-mail, 비밀번호, 이름, 역할, 이미지, 토큰
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // 공백 제거
        unique: 1 // 유일한 값
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
    // 유효성 검사시 사용
    token: {
        type: String
    },
    // 토큰이 유효한 시간
    tokenExp: {
        type: Number
    }
})

/* 저장하기 전에 암호화 필요 
next() 시 index.js에 존재하는 register Router의 save 부분으로 이동 */
userSchema.pre('save', function (next) {
    var user = this;
    if (user.isModified('password')) { // id, email 변경이 아닌 password 변경 시에만 비밀번호를 암호화한다.
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})


userSchema.methods.comparePassword = function (plainPassword, cb) {
    //plainPassword 1234567    암호회된 비밀번호 $2b$10$l492vQ0M4s9YUBfwYkkaZOgWHExahjWC
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return cb(err); // 에러가 존재한다면 call back 함수로 error 전송
        cb(null, isMatch); // 에러가 존재하지 않는다면 err 자리에는 null, isMatch 자리에는 isMatch를 반환한다.
    })
}

userSchema.methods.generateToken = function (cb) {
    var user = this;
    // console.log('user._id', user._id)

    // jsonwebtoken을 이용해서 token을 생성하기 
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token 
    // -> 
    // 'secretToken' -> user._id

    user.token = token
    user.save(function (err, user) {
        if (err) return cb(err)
        cb(null, user)
    })
}

// Schema를 Model로 감싸는 부분
const User = mongoose.model('User', userSchema)

// 다른 곳에서도 사용할 수 있도록 export
module.exports = { User }
