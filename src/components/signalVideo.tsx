export function SignalVideo() {
  return (
    <div className="video-container">
      <video className="video video--home" autoPlay loop muted>
        <source src="https://chalupagrande.nyc3.cdn.digitaloceanspaces.com/aesop/oscilloscope-keyd.webm" type="video/webm" />
      </video>
    </div>
  )
}