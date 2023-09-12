import { Button , Row} from 'antd'
import Link from 'next/link'

export default function Home() {
  return (
    <main className='bg'>
        <title>SeniorProject</title>
      <div className='title'>
      <div className='beforelogin'> 
        <Row className='aa'>
            <Button type='primary' htmlType='button'>
            <Link href='/login'>
              SIGN IN
              </Link>
            </Button>
        </Row>
    </div>
    </div>
    </main>
  )
}

