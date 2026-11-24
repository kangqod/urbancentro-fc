import { Container } from './container'
import { Footer } from './footer'

interface DefaultViewProps {
  isShuffle: boolean
  onClickShuffle: () => void
  isSwapMode: boolean
  swapSelectedId: string | null
  onToggleSwapMode: () => void
  onSwapTap: (id: string) => void
}

export function DefaultView({ isShuffle, onClickShuffle, isSwapMode, swapSelectedId, onToggleSwapMode, onSwapTap }: DefaultViewProps) {
  return (
    <>
      <Container
        isShuffle={isShuffle}
        swapMode={isSwapMode}
        swapSelectedId={swapSelectedId}
        onSwapTap={onSwapTap}
        onToggleSwapMode={onToggleSwapMode}
      />
      <Footer isShuffle={isShuffle} onClickShuffle={onClickShuffle} />
    </>
  )
}
