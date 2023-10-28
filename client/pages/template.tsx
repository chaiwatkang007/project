import React, { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import axios from "axios";
import { Button, Card, Col, Progress, Row, Statistic } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import ReCAPTCHA from "react-google-recaptcha";
import Link from "next/link";

const { Meta } = Card;

interface LogEntry {
  day : string;
  time: string;
  event_happening: string;
}

function Admin() {
  const [usernamelogin, setUsernamelogin] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2023-09-03"); // Default date
  const [selectedTime, setSelectedTime] = useState("00:00"); // Default time
  const [temperature, setTemperature] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [xAxisCategories, setXAxisCategories] = useState();
  const [countuser, setUser] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("DASHBOARD");
  const [datalog, setDatalog] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // หน้าปัจจุบัน
  const [itemsPerPage] = useState(10); // จำนวนรายการต่อหน้า

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = datalog.slice(indexOfFirstItem, indexOfLastItem);

  const pageNumbers:number[] = [];
  for (let i = 1; i <= Math.ceil(datalog.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map((number) => {
    return (
      <li key={number}>
        <a href="#" onClick={() => setCurrentPage(number)}>
          {number}
        </a>
      </li>
    );
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
        console.log("Login successful! as admin");
        setIsLoggedIn(true);
      }
      if (result.data.result.role === "user") {
        setErrorMessage("คุณไม่มีสิทธิ์เข้าถึง");
        return;
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

  useEffect(() => {

    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('usernamelogin');
      if(storedUsername) {
        setUsernamelogin(storedUsername);
      }
    }
    // Fetch temperature and humidity data from the server when the date and time change
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/temp/daytemp", {
          day: selectedDate,
          // time: selectedTime,
        });
        const data = response.data;

        // Extract temperature and humidity from the response
        const temperature = data.result.map((entry) => entry.temp);
        const humidity = data.result.map((entry) => entry.humidity);
        const timeData = data.result.map((entry) => entry.time);

        setTemperature(temperature);
        setHumidity(humidity);
        setXAxisCategories(timeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const fetchLog = async () => {
      try {
        const response = await axios.get("/api/log");
        const data = response.data;

        const logdata = data.result.rows.map((entry) => ({
          day: entry.day,
          time: entry.time,
          event_happening: entry.event_happening,
        }));
        console.log(logdata);

        setDatalog(logdata);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchLog();

    const fetchpix = async () => {
      try {
        const randomText = Math.random().toString(36).substring(7);
        const response = await fetch(`https://robohash.org/${randomText}.png`);
        if (response.ok) {
          setAvatarUrl(response.url);
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    fetchpix();

    const fetchDataUser = async () => {
      try {
        const response = await axios.get("/api/user");
        const data = response.data;

        const countuser = data.result.count;
        const nameone = data.result.rows[4].username;
        const nametwo = data.result.rows[0].username;
        const namethree = data.result.rows[1].username;
        const namefour = data.result.rows[3].username;
        console.log(countuser);


        setUser(countuser);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataUser();
  }, [selectedDate, selectedTime]);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const selectMenu = (menu) => {
    setSelectedMenu(menu);
  };

  const options = {
    chart: {
      type: "area",
    },
    title: {
      text: "Temperature and Humidity",
    },
    xAxis: {
      categories: xAxisCategories,
    },
    yAxis: {
      title: {
        text: "value",
      },
    },
    series: [
      {
        name: "Temperature",
        data: temperature,
      },
      {
        name: "Humidity",
        data: humidity,
      },
    ],
  };

  return (
    <div>
      <header>
        <title>Admin Dashboard</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css"
        />
      </header>
      <div className="grid-container">
        {/* Header */}
        <header className="header">
          <div className="menu-icon" onClick={openSidebar}>
            <span className="material-icons-outlined">menu</span>
          </div>
          <div className="header-left">
            <span className="material-icons-outlined">search</span>
          </div>
          <div className="header-right">
            {/* <span className="material-icons-outlined">account_circle</span> */}
            {avatarUrl && (
              <img className="avatar-image" src={avatarUrl} alt="Avatar" />
            )}
            Wellcome {usernamelogin}
          </div>
        </header>
        {/* End Header */}

        {/* Sidebar */}
        <aside id="sidebar" className={sidebarOpen ? "open" : ""}>
          <div className="sidebar-title">
            <div className="sidebar-brand">
              <span className="material-icons-outlined"></span>
              SENIOR PROJECT
            </div>
            <span className="material-icons-outlined" onClick={closeSidebar}>
              close
            </span>
          </div>

          <ul className="sidebar-list">
            <li className="sidebar-list-item">
              <span onClick={() => selectMenu("DASHBOARD")}>
                <span className="material-icons-outlined">dashboard</span>{" "}
                DASHBOARD
              </span>
            </li>

            <li className="sidebar-list-item">
              <span onClick={() => selectMenu("TEAM")}>
                <span className="material-icons-outlined">groups</span> TEAM
              </span>
            </li>

            <li className="sidebar-list-item">
              <span onClick={() => selectMenu("CONTROL")}>
                <span className="material-icons-outlined">settings</span>{" "}
                CONTROL
              </span>
            </li>

            <li className="sidebar-list-item">
              <span onClick={() => selectMenu("ADMINLOG")}>
                <span className="material-icons-outlined">construction</span>{" "}
                ADMINLOG
              </span>
            </li>
          </ul>
        </aside>
        {/* End Sidebar */}

        {/* Main */}
        <main className="main-container">
          <div className="main-title">
            <h2>{selectedMenu}</h2>
          </div>

          {selectedMenu === "DASHBOARD" && (
            <>
              <div className="main-cards">
                <div className="card">
                  <div className="card-inner">
                    <h2>USER</h2>
                    <span className="material-icons-outlined">groups</span>
                  </div>
                  <h1>{countuser}</h1>
                </div>

                {/* <div className="card">
                  <div className="card-inner">
                    <h2>จ่ายไปแล้ว</h2>
                    <span className="material-icons-outlined">bloodtype</span>
                  </div>
                  <h1>20</h1>
                </div>

                <div className="card">
                  <div className="card-inner">
                    <h2>จำนวนยา</h2>
                    <span className="material-icons-outlined">medication</span>
                  </div>
                  <h1>50</h1>
                </div> */}

                <div className="card">
                  <div className="card-inner">
                    <h2>ยาคงเหลือหลอดแรก</h2>
                    <span className="material-icons-outlined">autorenew</span>
                  </div>
                  <div className="prog">
                    <Progress type="circle" percent={30} size="small" />
                  </div>
                </div>

                <div className="card">
                  <div className="card-inner">
                    <h2>ยาคงเหลือหลอดสอง</h2>
                    <span className="material-icons-outlined">autorenew</span>
                  </div>
                  <div className="prog">
                    <Progress type="circle" percent={20} size="small" />
                  </div>
                </div>

                <div className="card">
                  <div className="card-inner">
                    <h2>ยาคงเหลือหลอดสาม</h2>
                    <span className="material-icons-outlined">autorenew</span>
                  </div>
                  <div className="prog">
                    <Progress type="circle" percent={25} size="small" />
                  </div>
                </div>

                <div className="card">
                  <div className="card-inner">
                    <h2>ยาคงเหลือหลอดสี่</h2>
                    <span className="material-icons-outlined">autorenew</span>
                  </div>
                  <div className="prog">
                    <Progress type="circle" percent={25} size="small" />
                  </div>
                </div>

                {/* <div className="card">
                  <Card bordered={false}>
                    <Statistic
                      title="Active"
                      value={11.28}
                      precision={2}
                      valueStyle={{ color: "#3f8600" }}
                      prefix={<ArrowUpOutlined />}
                      suffix="%"
                    />
                  </Card>
                </div>

                <div className="card">
                  <Card bordered={false}>
                    <Statistic
                      title="Idle"
                      value={9.3}
                      precision={2}
                      valueStyle={{ color: "#cf1322" }}
                      prefix={<ArrowDownOutlined />}
                      suffix="%"
                    />
                  </Card>
                </div> */}

                {/* Add your main cards here */}
              </div>

              <div className="products">
                {/* Add your product cards here */}

                {/* <div className="product-card"> */}
                {/* <h2 className="product-description">Temp & Humidity</h2> */}
                {/* <div className="text-secondary"> */}
                {/* <HighchartsReact
                      highcharts={Highcharts}
                      options={options}
                    /> */}
                {/* </div> */}
                {/* </div> */}

                <div className="social-media">
                  <div className="product">
                    {/* <div>
                      <div className="product-icon background-red">
                        <i className="bi bi-twitter"></i>
                      </div>
                      <h1 className="text-red">+274</h1>
                      <p className="text-secondary">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </p>
                    </div> */}
                    {/* <div>
                      <div className="product-icon background-green">
                        
                      </div>
                      <h1 className="text-green">{nameone}</h1>
          
                    </div>

                    <div>
                      <div className="product-icon background-green">
                      </div>
                      <h1 className="text-green">{nametwo}</h1>
                      
                    </div>

                    <div>
                      <div className="product-icon background-orange">
                        
                      </div>
                      <h1 className="text-orange">{namethree}</h1>
                      
                    </div>

                    <div>
                      <div className="product-icon background-blue">
                        
                      </div>
                      <h1 className="text-blue">{namefour}</h1>
                     
                    </div> */}
                  </div>
                </div>
              </div>
            </>
          )}

          {selectedMenu === "TEAM" && (
            <>
              <div className="team1">
                <Card
                  hoverable
                  style={{ width: 300 }}
                  cover={
                    <img
                      alt="example"
                      src="https://www.bu.ac.th/uploads/professors/20230105094052_1p23gZ0mf2LULxu_5OPxgLGfPvFusU5.jpg"
                    />
                  }
                >
                  <Meta
                    title="ผศ.ดร.วิศาล พัฒน์ชู"
                    description="FACULTY ADVISORS"
                  />
                </Card>
              </div>
              <div className="fixteam">
                <div className="team-container">
                  <Card
                    hoverable
                    style={{ width: 300 }}
                    cover={
                      <img
                        alt="example"
                        src="https://scontent.fbkk13-3.fna.fbcdn.net/v/t1.6435-9/124710523_1465572543647601_920919380793570628_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=174925&_nc_ohc=uSqQEN2jDpYAX_GfoXp&_nc_ht=scontent.fbkk13-3.fna&oh=00_AfC9fqD-PX5NXBZph_WsXoXj3PT4x3yZwApAokvRtNHeEQ&oe=6543607F"
                      />
                    }
                  >
                    <Meta title="CHAIWAT COMERINTHRON" description="SOFTWARE" />
                  </Card>
                  <Card
                    hoverable
                    style={{ width: 300 }}
                    cover={
                      <img
                        alt="example"
                        src="https://scontent.fbkk12-4.fna.fbcdn.net/v/t39.30808-6/337012394_233257582512653_7465760359736163477_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=Knmag1WTd2wAX-yHnh3&_nc_ht=scontent.fbkk12-4.fna&oh=00_AfBY8djt-lRWweG9nQLJvPeEJmpe3X6X95lAA_3FNSVe3A&oe=65326D37"
                      />
                    }
                  >
                    <Meta title="KANOKPORN HUDSREE" description="HARDWARE" />
                  </Card>
                  <Card
                    hoverable
                    style={{ width: 300 }}
                    cover={
                      <img
                        alt="example"
                        src="https://scontent.fbkk13-3.fna.fbcdn.net/v/t39.30808-6/371034662_1974338542924136_330610339788569331_n.jpg?stp=cp6_dst-jpg&_nc_cat=110&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeH8F7YGK7GEVYpvj4bXsUc-Z6T_Eqk7KidnpP8SqTsqJ2J5016RpDM5GyR2Jm2WpY1bYrJDkmTX_mfTdoAhMPm7&_nc_ohc=QjbmvtzAQLoAX8XVP76&_nc_ht=scontent.fbkk13-3.fna&oh=00_AfCp2B-hDI1DYFv-nfyVims47Z_N1OsWjNe7cQ8SdkP7Cw&oe=65320FCB"
                      />
                    }
                  >
                    <Meta title="KASSARAPON CHAYANANT" description="HARDWARE" />
                  </Card>
                  <Card
                    hoverable
                    style={{ width: 300 }}
                    cover={
                        <img
                          src="https://scontent.fbkk12-1.fna.fbcdn.net/v/t39.30808-6/362951835_2042172992795649_5082259832039992477_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=5f2048&_nc_ohc=gQ89jgl_HC0AX_KPrvg&_nc_ht=scontent.fbkk12-1.fna&oh=00_AfBTHtXVh5mZkmdNQtbwJGkJXmmEJN4GPxh7pVYz72qbdA&oe=6541F371"
                          alt="example"
                        />
                    }
                  >
                    <Meta title="BENCHAPORN PHANMI" description="CLOUD" />
                  </Card>
                </div>
              </div>
            </>
          )}

          {selectedMenu === "CONTROL" && <></>}

          {selectedMenu === "ADMINLOG" && (
            <>
              {isLoggedIn ? null : (
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
                        <Link href="/forgorpassword">forgot password</Link>
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
              )}

              {datalog.length > 0 && isLoggedIn && (
                <div className="admin-log-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Event</th>
                      </tr>
                    </thead>
                    {currentItems.map((logEntry:LogEntry, index) => (
                      <tr key={index}>
                        <td>{logEntry.day}</td>
                        <td>{logEntry.time}</td>
                        <td>{logEntry.event_happening}</td>
                      </tr>
                    ))}
                  </table>
                  <div className="pagination">
                    <ul className="page-numbers">{renderPageNumbers}</ul>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
        {/* End Main */}
      </div>
    </div>
  );
}

export default Admin;
