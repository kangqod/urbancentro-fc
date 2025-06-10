import { Container } from './container'

interface SharedViewProps {
  isShuffle: boolean
}

export function SharedView({ isShuffle }: SharedViewProps) {
  return <Container isShuffle={isShuffle} />
}
