import React, { useState } from "react";
import { Button, message} from "antd";
import axios from "axios";

export default function Deletes() {

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [username, setUername] = useState<string>("");

    const _handleDeletes = async () => {
         try {
           if (!username) {
             setErrorMessage("Please enter a username ");
             return;
           }
        
          const result = await axios({
            method: "post",
            maxBodyLength: Infinity,
            url: "/api/user/delete",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              "id": username,
            }),
          });
          
          if (result?.data?.result?.id) {
            console.log("Deleted successful!");
            setErrorMessage("ลบผู้ใช้งานสำเร็จแล้ว");
          }
        } catch (errorMessage: any) {
          if (axios.isAxiosError(errorMessage)) {
            if (errorMessage.response) {
              setErrorMessage("ไม่พบผู้ใช้งานนี้ในระบบ");
            }
          }
        }
      };

      return (
        <main className="bg">
          <div className="register">
            <form>
              <div className="container">
                <label className="signup" htmlFor="signup">
                  <b>
                    <h1>Deleted User</h1>
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
                  onChange={(e) => setUername(e.target.value)}
                />
                <Button
                  className="buttonlogin"
                  type="primary"
                  onClick={_handleDeletes}
                >
                  Delete
                </Button>
              </div>
              <p>{errorMessage}</p>
            </form>
          </div>
        </main>
      );    
}





