import { BPS_PER_WHOLE } from 'gamba-core-v2'
import { GambaUi, TokenValue, useCurrentPool, useSound, useWagerInput } from 'gamba-react-ui-v2'
import { useGamba } from 'gamba-react-v2'
import React from 'react'
import Slider from './Slider'
import { SOUND_LOSE, SOUND_PLAY, SOUND_TICK, SOUND_WIN } from './constants'
import { Container, Result, RollUnder, Stats } from './styles'

const calculateArraySize = (odds: number): number => {
  if (odds <= 0 || odds >= 100) return 100
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a)
  return 100 / gcd(100, odds)
}

export const outcomes = (rollUnder: number) => {
  // rollUnder is 1-99, represents the threshold
  // Win if random result < rollUnder
  const winChance = rollUnder
  const multiplier = 100 / winChance
  
  // Create a flat array where:
  // - Indices 0 to rollUnder-1 are "wins" with payout multiplier
  // - Indices rollUnder to 99 are "losses" with 0 payout
  const arraySize = 100
  const payoutArray: number[] = []
  
  for (let i = 0; i < arraySize; i++) {
    if (i < rollUnder) {
      payoutArray.push(multiplier)
    } else {
      payoutArray.push(0)
    }
  }
  
  return payoutArray
}

export default function Dice() {
  const gamba = useGamba()
  const [wager, setWager] = useWagerInput()
  const pool = useCurrentPool()
  const [resultIndex, setResultIndex] = React.useState(-1)
  const [rollUnderIndex, setRollUnderIndex] = React.useState(50)
  const [error, setError] = React.useState<string | null>(null)
  const sounds = useSound({
    win: SOUND_WIN,
    play: SOUND_PLAY,
    lose: SOUND_LOSE,
    tick: SOUND_TICK,
  })

  // Ensure rollUnder is in valid range
  const safeRollUnder = Math.max(1, Math.min(94, rollUnderIndex))
  
  const multiplier = (100 / safeRollUnder)
  const bet = React.useMemo(() => outcomes(safeRollUnder), [safeRollUnder])
  const maxWin = multiplier * wager

  const game = GambaUi.useGame()

  const play = async () => {
    try {
      setError(null)
      sounds.play('play')

      await game.play({
        wager,
        bet,
      })

      const result = await game.result()
      const win = result.payout > 0

      // Generate visual result based on actual on-chain result
      const resultNum = win
        ? Math.floor(Math.random() * safeRollUnder)
        : safeRollUnder + Math.floor(Math.random() * (100 - safeRollUnder))

      setResultIndex(resultNum)
      win ? sounds.play('win') : sounds.play('lose')
    } catch (err: any) {
      console.error('Play error:', err)
      setError(err.message || 'Transaction failed')
      sounds.play('lose')
    }
  }

  return (
    <>
      <GambaUi.Portal target="screen">
        <GambaUi.Responsive>
          <Container>
            {error && (
              <div style={{
                color: 'red',
                background: 'rgba(255,0,0,0.1)',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '10px',
                textAlign: 'center'
              }}>
                ❌ {error}
              </div>
            )}
            
            <RollUnder>
              <div>
                <div>{safeRollUnder}</div>
                <div>Roll Under</div>
              </div>
            </RollUnder>
            
            <Stats>
              <div>
                <div>{safeRollUnder}%</div>
                <div>Win Chance</div>
              </div>
              <div>
                <div>{multiplier.toFixed(2)}x</div>
                <div>Multiplier</div>
              </div>
              <div>
                {maxWin > pool.maxPayout ? (
                  <div style={{ color: 'red' }}>Too high</div>
                ) : (
                  <div><TokenValue suffix="" amount={maxWin} /></div>
                )}
                <div>Payout</div>
              </div>
            </Stats>
            
            <div style={{ position: 'relative' }}>
              {resultIndex > -1 && (
                <Result style={{ left: `${resultIndex}%` }}>
                  <div key={resultIndex}>{resultIndex}</div>
                </Result>
              )}
              <Slider
                disabled={gamba.isPlaying}
                range={[0, 100]}
                min={1}
                max={94}
                value={rollUnderIndex}
                onChange={(value) => {
                  setRollUnderIndex(value)
                  setResultIndex(-1)
                  sounds.play('tick')
                }}
              />
            </div>
          </Container>
        </GambaUi.Responsive>
      </GambaUi.Portal>
      
      <GambaUi.Portal target="controls">
        <GambaUi.WagerInput value={wager} onChange={setWager} />
        <GambaUi.PlayButton onClick={play}>Roll</GambaUi.PlayButton>
      </GambaUi.Portal>
    </>
  )
}
