interface StartScreenProps {
  onStart: () => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="start-screen">
      <h1 className="start-title">ASYLUM</h1>
      <p className="start-subtitle">
        You wake in darkness. Something is wrong.
        <br />
        Find the exit. Don't let your sanity break.
        <br />
        Don't let THEM find you.
      </p>
      <button className="start-btn" onClick={onStart}>
        ENTER
      </button>
      <div className="start-instructions">
        Drag to look around · Tap flashlight to toggle · Find the way out
      </div>
    </div>
  )
}