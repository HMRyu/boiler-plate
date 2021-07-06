import { PromiseProvider } from 'mongoose';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {loginUser} from '../../../_actions/user_action';

function LoginPage(props) {
  const dispatch = useDispatch()

  const[Email, setEmail] = useState("")
  const[Password, setPassword] = useState("")


  // 이메일 부분에 입력할 수 있도록 하는 이벤트 핸들러 함수
  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onSubmitHandler = (event) => {
    event.preventDefault(); // 페이지 refresh 방지 꼭 필요한 부분

    let body = {
      email: Email,
      password: Password
    }

    dispatch(loginUser(body)).then(response => {
      if (response.payload.loginSuccess) {
        props.history.push('/')
      } else {
        alert('Error')
      }
    })   
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh'
    }}>
      <form style={{display: 'flex', flexDirection:'column'}} onSubmit={onSubmitHandler}>
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler}></input>
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler}></input>
        <br />
        <button type="submit"> 
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginPage