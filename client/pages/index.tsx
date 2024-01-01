import { Button, Row } from "antd";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bbg">
      <title>SMART PILL</title>
      <div className="content">
        <h1>
          SMART PILL DISPENSER
          <br />
        </h1>
        <Row className="hh">
          <div className="dd">
            <Button>
              <Link href="/login">SIGN IN</Link>
            </Button>
          </div>
          <div className="ee">
            <Button>
              <Link href="/register">SIGN UP</Link>
            </Button>
          </div>
        </Row>
      </div>
    </main>
  );
}
