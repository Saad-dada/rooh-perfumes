import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/Navbar.css";

import { useEffect, useRef } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const lastScrollY = useRef(window.scrollY);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { itemCount, openDrawer } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY === 0) {
        setSticky(false);
      } else if (currentY < lastScrollY.current) {
        // Scrolling up
        setSticky(true);
      } else {
        // Scrolling down
        setSticky(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`nav${sticky ? " nav--sticky" : ""}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <img
            src="/roohlogo.png"
            alt="Rooh Perfumes"
            className="nav-logo nav-logo-large"
          />
        </Link>
        <div className="nav-links">
          <Link to="/">HOME</Link>
          <Link to="/shop">SHOP</Link>
          {isHome ? (
            <a href="#about">ABOUT</a>
          ) : (
            <Link to="/#about">ABOUT</Link>
          )}
          {isHome ? (
            <a href="#contact">CONTACT</a>
          ) : (
            <Link to="/#contact">CONTACT</Link>
          )}
        </div>

        <div className="nav-actions">
          <button
            className="nav-cart-btn nav-cart-desktop"
            onClick={openDrawer}
            aria-label="Open cart"
          >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {itemCount > 0 && <span className="nav-cart-badge">{itemCount}</span>}
        </button>

          {/* Mobile: cart + hamburger */}
          <div className="nav-mobile-actions">
          <button
            className="nav-cart-btn nav-cart-btn-mobile"
            onClick={openDrawer}
            aria-label="Open cart"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {itemCount > 0 && (
              <span className="nav-cart-badge">{itemCount}</span>
            )}
          </button>

          <button
            className={`nav-hamburger ${menuOpen ? "nav-hamburger--open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <div
        className={`nav-mobile-menu ${menuOpen ? "nav-mobile-menu--open" : ""}`}
      >
        <Link to="/" onClick={() => setMenuOpen(false)}>
          HOME
        </Link>
        <Link to="/shop" onClick={() => setMenuOpen(false)}>
          SHOP
        </Link>
        {isHome ? (
          <a href="#about" onClick={() => setMenuOpen(false)}>
            ABOUT
          </a>
        ) : (
          <Link to="/#about" onClick={() => setMenuOpen(false)}>
            ABOUT
          </Link>
        )}
        {isHome ? (
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            CONTACT
          </a>
        ) : (
          <Link to="/#contact" onClick={() => setMenuOpen(false)}>
            CONTACT
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
