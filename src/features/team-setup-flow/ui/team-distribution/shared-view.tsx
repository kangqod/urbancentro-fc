import { Container } from './container'
import { FooterHome } from './footer-home'

interface SharedViewProps {
  isShuffle: boolean
}

export function SharedView({ isShuffle }: SharedViewProps) {
  return (
    <>
      <Container isShuffle={isShuffle} />
      <FooterHome />
    </>
  )
}
