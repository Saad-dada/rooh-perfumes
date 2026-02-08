import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="ft">
      <div className="ft-inner">
        <span className="ft-brand">
          <img src="/roohlogo.png" alt="Rooh Perfumes" className="nav-logo" />
        </span>
        <div className="ft-links">
          <a href="#popular">Popular</a>
          <a href="#shop">Shop</a>
          <a href="#testimonial">Reviews</a>
        </div>
        <span className="ft-copy">&copy; 2026 All rights reserved</span>
      </div>
    </footer>
  );
};

export default Footer;
