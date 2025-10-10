import { Form, Input, Button, Switch } from 'antd'
import useSecurity from './security.hook'

import './security.scss'

export function Security() {
  const { loading, contextHolder, handleFinish } = useSecurity()

  return (
    <>
      <div className="security-container">
        <h1>팀 코드를 입력하세요</h1>
        <Form
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
          initialValues={{
            password_status: true
          }}
        >
          <Form.Item label="코드" name="password" rules={[{ required: true, message: '코드를 입력하세요.' }]}>
            <Input.Password size="large" placeholder="코드" autoFocus />
          </Form.Item>
          <Form.Item label="코드 상태 유지" name="password_status" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading} style={{ marginTop: 8 }}>
            확인
          </Button>
        </Form>
      </div>
      {contextHolder}
    </>
  )
}
