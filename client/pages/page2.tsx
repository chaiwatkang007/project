import { Button , Col , Checkbox, Row} from 'antd'
import Link from 'next/link'

export default function Home() {
  return (
    <main className='bg'>
      <div className='beforelogin'> 
        <Row className='aa'>
          <Link href='/login'>
            <Button type='primary' htmlType='button'>
              ค่อยทำ
            </Button>
          </Link>
        </Row>
    </div>
    </main>
  )
}
