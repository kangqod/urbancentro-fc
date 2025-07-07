import { Button } from 'antd'
import { House } from 'lucide-react'
import { TabFooter } from '@/shared'

export function FooterHome() {
  return (
    <TabFooter>
      <div className="footer-container">
        <Button
          type="primary"
          className="next-button"
          icon={<House size={24} />}
          onClick={() => (window.location.href = '/urbancentro-fc')}
        >
          홈으로
        </Button>
      </div>
    </TabFooter>
  )
}
