interface GameUIProps {
  sanity: number
  battery: number
  flashlightOn: boolean
  onToggleFlashlight: () => void
  messages: string[]
}

export default function GameUI({
  sanity,
  battery,
  flashlightOn,
  onToggleFlashlight,
  messages,
}: GameUIProps) {
  return (
    <div className={`game-ui ${sanity < 30 ? 'heartbeat' : ''}`}>
      {/* Crosshair */}
      <div className="crosshair" />

      {/* Stats */}
      <div className="ui-top">
        <div className="stat-bar">
          <span className="stat-label">Sanity</span>
          <div className="stat-track">
            <div
              className={`stat-fill sanity ${sanity < 25 ? 'low' : ''}`}
              style={{ width: `${sanity}%` }}
            />
          </div>
        </div>
        <div className="stat-bar">
          <span className="stat-label">Battery</span>
          <div className="stat-track">
            <div
              className={`stat-fill battery ${battery < 20 ? 'low' : ''}`}
              style={{ width: `${battery}%` }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={`${msg}-${i}`} className="message">
            {msg}
          </div>
        ))}
      </div>

      {/* Look hint */}
      <div className="look-hint">drag to look</div>

      {/* Controls */}
      <div className="controls">
        <button
          className={`control-btn ${flashlightOn ? 'active' : ''} ${battery <= 0 ? 'disabled' : ''}`}
          onClick={onToggleFlashlight}
          disabled={battery <= 0}
        >
          <span className="control-icon">🔦</span>
          <span>{flashlightOn ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </div>
  )
}