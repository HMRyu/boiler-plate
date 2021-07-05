const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
const { User } = require("./models/User");
const cookieParser = require('cookie-parser');
const config = require('./config/key');

// application/x-www-form-urlencoded 형태를 분석하여 가져온다.
app.use(bodyParser.urlencoded({extended:true})); 

// application/json 형태를 분석하여 가져온다.
app.use(bodyParser.json());
app.use(cookieParser());

/* mongoose 연결 */
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false // 에러 방지
}).then(() => console.log('MongoDB Connected...')) // 연결 성공 시 MongoDB Connected... 메시지 출력
.catch(err => console.log(err)) // 연결 실패 시 Error 메시지 출력

app.get('/', (req, res) => res.send('Hello World!'))

/* 회원가입 */
app.post('/register', (req, res) => {
  // 회원 가입 시 필요한 정보들을 client에서 가져오면
  // 데이터베이스에 저장한다.
  
  const user = new User(req.body) // user라는 변수에 User의 정보를 가져온다.

  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

/* 로그인 */
app.post('/login', (req, res) => {
  // 요청된 이메일이 DB에 존재하는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => { // req.body.email에서 email이 존재하는지 찾는다.
    // findOne 함수를 이용하였기 때문에 하나의 값만 리턴되고 그 값은 user에 저장된다.
    // 만약 user가 존재하지 않는다면
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 요청된 이메일이 DB에 있다면 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})

      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err); // 에러 발생 시
        
        // 에러가 없다면 
        // 토큰을 쿠키에 저장한다.
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id })
      })
    })

  })
  // 비밀번호까지 맞다면 토큰을 생성하기
})
app.listen(port, () => console.log('Example app listening on port'))