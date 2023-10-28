import React, { useState } from "react";
import { Button } from "antd";
import axios from "axios";
import { useRouter } from "next/router";



export default function Resetpassowrd() {
  const router = useRouter();
  const { email } = router.query;
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [newpassword, setNewPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const _handleReset = async () => {
  try {
    if (!newpassword || !password ) {
      setErrorMessage("Please enter a  username and password");
      return;
    }

    if(newpassword !== password) {
      setErrorMessage("New password and confirm password don't match");
      return;
    }

    const result = await axios({
      method: "post",
      maxBodyLength: Infinity,
      url: "/api/user/update",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        "email": email,
        "password": newpassword,
      }),
    });
    if (result?.data) {
      console.log("Reset password successful!");
      setErrorMessage("Reset password successful!");
      await axios.post('/api/log/addlog', {
        event_happening: `${email} Reset password`,
      });
      router.push("/login");
    }
  } catch (errorMessage: any) {
    if (axios.isAxiosError(errorMessage)) {
      if (errorMessage.response) {
        setErrorMessage("ไม่สามารถเปลี่ยนรหัสได้หรือรหัสผ่านซ้ำกับอันเดิม");
      }
    }
  }
};
  return (
    <main className="bg">
      <title>Sign in to SeniorProject</title>
      <div className="beforelogin">
        <form>
          <div className="container">
          <label className="signin" htmlFor="signin">
              <b>
                <h1>Reset Password</h1>
              </b>
            </label>
            <label htmlFor="uname">
              <b>Email</b>
            </label>
            <input
              type="text"
              placeholder="Enter Email"
              name="em"
              required
              value={email}
              disabled
            />
            <label htmlFor="uname">
              <b>New password</b>
            </label>
            <input
              type="password"
              placeholder="Enter New Password"
              name="uname"
              required
              value={newpassword}
              onChange={(e) => setNewPassword(e.target.value)}
              
            />
            <label htmlFor="psw">
              <b>Password</b>
            </label>
            <input
              type="password"
              placeholder="New Password again"
              name="psw"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="cc">
            </div>
            <Button
              className="buttonlogin"
              type="primary"
              onClick={_handleReset}
            >
              RESET PASSWORD
            </Button>
          </div>
          <p>{errorMessage}</p>
        </form>
      </div>
    </main>
  );
};

