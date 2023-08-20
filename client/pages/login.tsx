import React, { useState } from 'react';
import { Button, Checkbox, Col , Row } from 'antd';
import axios from 'axios';
import Router from  "next/router"


export default function login() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const _handleLogin = async() => {
    try {
      if (!username || !password) {
        setErrorMessage("Please enter a username and password");
        return;
      }

      const result = await axios({
        method: 'post',
        maxBodyLength: Infinity,
        url: '/api/auth/signin',
        headers: { 
          'Content-Type': 'application/json'
        },
        data : JSON.stringify({
          "username": username,
          "password": password
        })
      })
      if(result?.data?.result?.id) {
        console.log('Login successful!');
        Router.push("/page2")
      }
    } catch (errorMessage: any ) {
      if(axios.isAxiosError(errorMessage)) {
        if(errorMessage.response) {
          setErrorMessage("Invalid username or password")
        }
      }
      console.log('err=========>',errorMessage)
        }
      }

  return (
    <main className="bg">
      <div className="beforelogin">
        <form>
          <div className="container">
            <label htmlFor="uname">
              <b>Username</b>
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              name="uname"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="psw">
              <b>Password</b>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="psw"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Col className="b">
        
            </Col>
            <Button className="buttonlogin" type="primary" onClick={_handleLogin}>
              Login
            </Button>
          </div>
          <p>{errorMessage}</p>
        </form>
      </div>
    </main>
  )
}
