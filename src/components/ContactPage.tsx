import Navbar from './Navbar'
import Footer from './Footer'
import '../styles/ContactPage.css'

const ContactPage = () => {
  return (
    <div className="contact-page">
      <Navbar />

      <header className="contact-hero">
        <h1>Contact Us</h1>
        <p>We would love to hear from you. Reach out for orders, support, or wholesale inquiries.</p>
      </header>

      <main className="contact-main">
        <section className="contact-details" aria-label="Contact details">
          <article className="contact-card">
            <h3>General Address</h3>
            <p>
              RB Trading – F.Z.E<br />
              Ajman Free Zone<br />
              Ajman, United Arab Emirates
            </p>
          </article>

          <article className="contact-card">
            <h3>Email</h3>
            <p><a href="mailto:hello@roohperfumes.com">hello@roohperfumes.com</a></p>
          </article>

          <article className="contact-card">
            <h3>Phone</h3>
            <p><a href="tel:+971500000000">+971 50 000 0000</a></p>
          </article>

          <article className="contact-card">
            <h3>Business Hours</h3>
            <p>Mon – Sat: 10:00 AM – 8:00 PM<br />Sunday: Closed</p>
          </article>
        </section>

        <section className="contact-grid">
          <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
            <h2>Send a Message</h2>
            <label>
              Full Name
              <input type="text" name="name" placeholder="Your name" required />
            </label>
            <label>
              Email
              <input type="email" name="email" placeholder="you@example.com" required />
            </label>
            <label>
              Phone
              <input type="tel" name="phone" placeholder="+971" />
            </label>
            <label>
              Message
              <textarea name="message" rows={5} placeholder="How can we help?" required />
            </label>
            <button type="submit">Send Message</button>
          </form>

          <section className="contact-map" aria-label="Store location map">
            <h2>Find Us</h2>
            <iframe
              title="Rooh Perfumes location"
              src="https://www.google.com/maps?q=Ajman+Free+Zone&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </section>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ContactPage