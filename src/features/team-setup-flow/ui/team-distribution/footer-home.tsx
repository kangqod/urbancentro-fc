import { Button } from 'antd'
import { House } from 'lucide-react'
import { TabFooter } from '@/shared'

export function FooterHome() {
  return (
    <TabFooter>
      <div className="footer-container">
        <Button
          type="primary"
          className="next-button go-home-button"
          icon={<House size={24} />}
          onClick={() => (window.location.href = '/urbancentro-fc')}
        >
          홈으로 이동
        </Button>
      </div>
    </TabFooter>
  )
}
