import '../styles/Newsletter.css'
import { NewsletterFloral } from './FloralAccents'

const Newsletter = () => {
  return (
    <section className="sec sec-alt sec-newsletter">
      <NewsletterFloral />
      <div className="sec-inner narrow center-text">
        <h2 className="sec-title">Stay in the loop</h2>
        <p className="sec-sub">
          New arrivals, care tips, and limited releases — delivered monthly.
        </p>
        <form className="nl-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Enter your email" />
          <button className="btn-fill">Subscribe</button>
        </form>
      </div>
    </section>
  )
}

export default Newsletter
