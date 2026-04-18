import Navbar from "./Navbar";
import Footer from "./Footer";
import { useEffect } from "react";
import "../styles/TermsAndConditionPage.css";
import "../styles/AboutPage.css";

const PrivacyPolicyPage = () => {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(".terms-reveal"));
    if (elements.length === 0) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      <Navbar />
      <main className="about-main">
        <section className="terms-container terms-reveal">
          <h1>Privacy Policy</h1>
          <p>Rooh Perfumes respects the privacy of its customers and website visitors.</p>
          <p>This Privacy Policy explains how information is collected, used, and protected when you visit or make a purchase from our website.</p>

          <h2>Information Collection</h2>
          <p>We collect personal information such as name, email address, phone number, billing address, and shipping address only for the purpose of processing orders and providing customer support.</p>

          <h2>Payment Information</h2>
          <p>All payments on this website are processed securely through Razorpay. Rooh Perfumes does not store or have access to full debit or credit card details.</p>

          <h2>Use of Information</h2>
          <p>Customer information is used solely for order processing, communication related to orders, delivery updates, and customer support.</p>

          <h2>Data Protection</h2>
          <p>We take reasonable measures to protect customer data from unauthorized access.</p>

          <h2>Business Ownership</h2>
          <p>This website is owned and operated by Rooh Perfumes, a brand owned by RB Trading – F.Z.E, Ajman Free Zone, United Arab Emirates.</p>

          <p>If you have any questions regarding this Privacy Policy, you may contact us through the Contact page.</p>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
