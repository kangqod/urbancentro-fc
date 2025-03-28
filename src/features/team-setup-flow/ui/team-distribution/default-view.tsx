import { Container } from './container'
import { Footer } from './footer'

interface DefaultViewProps {
  isShuffle: boolean
  onClickShuffle: () => void
}

export function DefaultView({ isShuffle, onClickShuffle }: DefaultViewProps) {
  return (
    <>
      <Container isShuffle={isShuffle} />
      <Footer isShuffle={isShuffle} onClickShuffle={onClickShuffle} />
    </>
  )
}
