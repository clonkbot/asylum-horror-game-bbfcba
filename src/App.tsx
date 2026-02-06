import { useState, useEffect, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import HorrorScene from './components/HorrorScene'
import GameUI from './components/GameUI'
import StartScreen from './components/StartScreen'
import './styles.css'

export type GameState = 'start' | 'playing' | 'gameover'

function App() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [sanity, setSanity] = useState(100)
  const [battery, setBattery] = useState(100)
  const [flashlightOn, setFlashlightOn] = useState(true)
  const [messages, setMessages] = useState<string[]>([])
  const [scareActive, setScareActive] = useState(false)

  const addMessage = useCallback((msg: string) => {
    setMessages(prev => [...prev.slice(-4), msg])
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m !== msg))
    }, 4000)
  }, [])

  const triggerScare = useCallback(() => {
    setScareActive(true)
    setSanity(prev => Math.max(0, prev - 15))
    setTimeout(() => setScareActive(false), 500)
  }, [])

  useEffect(() => {
    if (gameState !== 'playing') return

    const interval = setInterval(() => {
      // Drain battery when flashlight is on
      if (flashlightOn) {
        setBattery(prev => {
          const newVal = Math.max(0, prev - 0.5)
          if (newVal === 0) {
            setFlashlightOn(false)
            addMessage('Flashlight died...')
          }
          return newVal
        })
      }

      // Drain sanity slowly in darkness
      if (!flashlightOn) {
        setSanity(prev => Math.max(0, prev - 0.3))
      }

      // Random ambient scares
      if (Math.random() < 0.02) {
        addMessage(getRandomAmbientMessage())
      }
    }, 100)

    return () => clearInterval(interval)
  }, [gameState, flashlightOn, addMessage])

  useEffect(() => {
    if (sanity <= 0 && gameState === 'playing') {
      setGameState('gameover')
      addMessage('Your mind shattered...')
    }
  }, [sanity, gameState, addMessage])

  const startGame = () => {
    setGameState('playing')
    setSanity(100)
    setBattery(100)
    setFlashlightOn(true)
    setMessages([])
    addMessage('Find the exit before they find you...')
  }

  const toggleFlashlight = () => {
    if (battery > 0) {
      setFlashlightOn(prev => !prev)
    }
  }

  return (
    <div className="app-container">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Vignette */}
      <div className="vignette" />

      {/* Scare flash */}
      {scareActive && <div className="scare-flash" />}

      {gameState === 'start' && <StartScreen onStart={startGame} />}

      {gameState === 'gameover' && (
        <div className="gameover-screen">
          <h1 className="gameover-title">YOU DIED</h1>
          <p className="gameover-text">The darkness consumed you</p>
          <button className="restart-btn" onClick={startGame}>
            TRY AGAIN
          </button>
        </div>
      )}

      <Canvas
        shadows
        camera={{ fov: 75, near: 0.1, far: 100, position: [0, 1.6, 0] }}
        style={{ background: '#000' }}
      >
        <Suspense fallback={null}>
          <HorrorScene
            flashlightOn={flashlightOn && battery > 0}
            gameState={gameState}
            onScare={triggerScare}
            addMessage={addMessage}
          />
        </Suspense>
      </Canvas>

      {gameState === 'playing' && (
        <GameUI
          sanity={sanity}
          battery={battery}
          flashlightOn={flashlightOn}
          onToggleFlashlight={toggleFlashlight}
          messages={messages}
        />
      )}

      <footer className="footer">
        Requested by @ArliRwa · Built by @clonkbot
      </footer>
    </div>
  )
}

function getRandomAmbientMessage(): string {
  const messages = [
    'You hear footsteps behind you...',
    'Something moved in the shadows...',
    'A distant scream echoes...',
    'The walls seem to breathe...',
    'You feel watched...',
    'Whispers surround you...',
    'The air grows cold...',
    'Something scratches nearby...',
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

export default App