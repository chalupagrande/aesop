export function SignalVideo() {
  return (
    <div className="video-container">
      <video className="video video--home" autoPlay loop muted>
        <source src="oscilloscope-keyd.webm" type="video/webm" />
      </video>
    </div>
  )
}