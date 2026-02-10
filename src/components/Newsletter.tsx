import '../styles/Newsletter.css'

const Newsletter = () => {
  return (
    <section className="sec sec-newsletter">
      <div className="sec-inner narrow center-text">
        <h2 className="sec-title">Stay in the loop</h2>
        <p className="sec-sub">
          New arrivals, care tips, and limited releases — delivered monthly.
        </p>
        <form className="nl-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email" />
          <button className="btn-fill hero-cta">Subscribe</button>
        </form>
      </div>
    </section>
  )
}

export default Newsletter
