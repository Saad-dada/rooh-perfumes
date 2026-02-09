import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="ft">
      <div className="ft-inner">
        {/* Top row: brand + nav columns */}
        <div className="ft-top">
          <div className="ft-brand-col">
            <img src="/roohlogo.png" alt="Rooh Perfumes" className="ft-logo" />
            <p className="ft-tagline">
              Handcrafted fragrances inspired by tradition, designed for the modern soul.
            </p>
            <div className="ft-socials">
              <a href="#" aria-label="Instagram">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.92 4.92 0 011.675 1.09 4.92 4.92 0 011.09 1.675c.163.46.35 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.92 4.92 0 01-1.09 1.675 4.92 4.92 0 01-1.675 1.09c-.46.163-1.26.35-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.92 4.92 0 01-1.675-1.09 4.92 4.92 0 01-1.09-1.675c-.163-.46-.35-1.26-.403-2.43C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43A4.92 4.92 0 013.726 3.045a4.92 4.92 0 011.675-1.09c.46-.163 1.26-.35 2.43-.403C9.097 2.175 9.477 2.163 12 2.163zm0 1.838c-3.153 0-3.506.012-4.748.069-.987.045-1.524.21-1.88.348a3.077 3.077 0 00-1.15.748 3.077 3.077 0 00-.748 1.15c-.138.356-.303.893-.348 1.88C3.012 8.494 3 8.847 3 12s.012 3.506.069 4.748c.045.987.21 1.524.348 1.88.183.466.42.86.748 1.15.29.328.684.565 1.15.748.356.138.893.303 1.88.348 1.242.057 1.595.069 4.748.069s3.506-.012 4.748-.069c.987-.045 1.524-.21 1.88-.348a3.077 3.077 0 001.15-.748c.328-.29.565-.684.748-1.15.138-.356.303-.893.348-1.88.057-1.242.069-1.595.069-4.748s-.012-3.506-.069-4.748c-.045-.987-.21-1.524-.348-1.88a3.077 3.077 0 00-.748-1.15 3.077 3.077 0 00-1.15-.748c-.356-.138-.893-.303-1.88-.348C15.506 4.012 15.153 4 12 4zm0 3.838a4.162 4.162 0 110 8.324 4.162 4.162 0 010-8.324zm0 1.838a2.324 2.324 0 100 4.648 2.324 2.324 0 000-4.648zm4.406-2.964a.975.975 0 110 1.95.975.975 0 010-1.95z"/></svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#" aria-label="TikTok">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.71a8.19 8.19 0 004.76 1.52V6.78a4.84 4.84 0 01-1-.09z"/></svg>
              </a>
            </div>
          </div>

          <div className="ft-nav-col">
            <h4 className="ft-col-title">Shop</h4>
            <a href="#popular">Popular</a>
            <a href="#shop">All Perfumes</a>
            <a href="#categories">Categories</a>
          </div>

          <div className="ft-nav-col">
            <h4 className="ft-col-title">Company</h4>
            <a href="#about">About Us</a>
            <a href="#testimonial">Reviews</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="ft-nav-col">
            <h4 className="ft-col-title">Support</h4>
            <a href="#">Shipping & Returns</a>
            <a href="#">FAQ</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="ft-bottom">
          <span className="ft-copy">&copy; 2026 Rooh Perfumes. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
