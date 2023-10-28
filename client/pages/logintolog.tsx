import React, { useState } from "react";
import { Button, Col, Row } from "antd";
import axios from "axios";
import Router from "next/router";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";

export default function Logintolog() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [recaptchaResponse, setRecaptchaResponse] = useState<string>("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);

  const handleCaptchaVerify = (token: string | null) => {
    setIsCaptchaVerified(true);
    setRecaptchaResponse(token || "");
  };

  const verifyRecaptcha = async (recaptchaResponse: string) => {
    const secretKey = "6Lcoi9onAAAAAJ_rNHdtMM7EGmubvFQC8slUHiTt";
    const verificationUrl = "https://www.google.com/recaptcha/api/siteverify";
    try {
      const response = await axios.post(verificationUrl, null, {
        params: {
          secret: secretKey,
          response: recaptchaResponse,
        },
      });

      const responseData = response.data;
      return responseData.success;
    } catch (error) {
      console.error("Error verifying reCAPTCHA:", error);
      return false;
    }
  };

  const _handleLogin = async () => {
    try {
      if (!username || !password) {
        setErrorMessage("Please enter a username password ");
        return;
      }

      if (!isCaptchaVerified) {
        setErrorMessage("Please verify the ReCAPTCHA");
        return;
      }

      const isRecaptchaValid = await verifyRecaptcha(recaptchaResponse);

      const result = await axios({
        method: "post",
        maxBodyLength: Infinity,
        url: "/api/user/adminlog",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          username: username,
          password: password,
        }),
      });
      if (result.data.result.role === "admin") {
        console.log("Login successful!");
        Router.push("/template");
      }
      if (result.data.result.role === "user") {
        setErrorMessage("คุณไม่มีสิทธิ์เข้าถึง");
        return;
        // console.log("Login successful!");
        // console.log(result.data);
        // console.log(result.data.role);
        //   if (result?.data?.result?.id) {
        //     console.log("Login successful!");
        //     console.log(result.data);
        //     console.log(result.data.role);

        //Router.push("/template");
      }
    } catch (errorMessage: any) {
      if (axios.isAxiosError(errorMessage)) {
        if (errorMessage.response) {
          setErrorMessage("Invalid username or password");
        }
      }
      console.log("err=========>", errorMessage);
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
                <h1>SIGN IN</h1>
              </b>
            </label>
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
              <Link href="/forgotpassword">
                <a>forgot password</a>
              </Link>
            </Col>
            <div className="cc">
              <ReCAPTCHA
                sitekey="6Lcoi9onAAAAAMeXsjmOo05DRzAg1g3yuJqx9yqS"
                onChange={handleCaptchaVerify}
              />
            </div>
            <Button
              className="buttonlogin"
              type="primary"
              onClick={_handleLogin}
            >
              Login
            </Button>
          </div>
          <p>{errorMessage}</p>
        </form>
      </div>
    </main>
  );
}
