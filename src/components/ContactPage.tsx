import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/ContactPage.css";

const ContactPage = () => {
  return (
    <div className="contact-page">
      <Navbar />

      <header className="contact-hero">
        <h1>Contact Us</h1>
        <p>
          We would love to hear from you. Reach out for orders, support, or
          wholesale inquiries.
        </p>
      </header>

      <main className="contact-main">
        <section className="contact-details" aria-label="Contact details">
          <article className="contact-card">
            <h3>General Address</h3>
            <p>
              RB Trading – F.Z.E
              <br />
              Ajman Free Zone
              <br />
              Ajman, United Arab Emirates
            </p>
          </article>

          <article className="contact-card">
            <h3>Email</h3>
            <p>
              <a href="mailto:roohperfumes01@gmail.com">roohperfumes01@gmail.com</a>
            </p>
          </article>

          <article className="contact-card">
            <h3>Phone</h3>
            <p>
              <a href="tel:+971555230007">+971 55 523 0007</a>
            </p>
          </article>

          <article className="contact-card">
            <h3>Business Hours</h3>
            <p>
              Mon – Sat: 10:00 AM – 8:00 PM
              <br />
              Sunday: Closed
            </p>
          </article>
        </section>

        <section className="contact-grid">
          <form
            className="contact-form"
            onSubmit={(event) => event.preventDefault()}
          >
            <h2>Send a Message</h2>
            <label>
              Full Name
              <input type="text" name="name" placeholder="Your name" required />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Phone
              <input type="tel" name="phone" placeholder="+971" />
            </label>
            <label>
              Message
              <textarea
                name="message"
                rows={5}
                placeholder="How can we help?"
                required
              />
            </label>
            <button type="submit">Send Message</button>
          </form>

          <section className="contact-map" aria-label="Store location map">
            <h2>Find Us</h2>
            <iframe
              title="Rooh Perfumes location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.0325426236636!2d55.3008744!3d25.2694907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f438aa1cebda3%3A0x3bb39c1e15977e3!2sLovisa%20Perfumes!5e0!3m2!1sen!2sin!4v1774400255408!5m2!1sen!2sin"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </section>
        </section>

        <section
          className="contact-extra-location"
          aria-label="Additional store location"
        >
          <div className="contact-extra-location-content">
            <p className="contact-extra-location-eyebrow">Also available at</p>
            <h2>Lovisa Perfumes</h2>
            <p className="contact-extra-location-address">Deira, Dubai, UAE</p>
          </div>

          <a
            className="contact-extra-location-link"
            href="https://maps.app.goo.gl/g3Q6G8UHxMJ4SKrA9"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
