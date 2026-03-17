import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { launchOffer } from "../lib/promo";
import "../styles/Navbar.css";

import { useEffect, useRef } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [announcementOpen, setAnnouncementOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const lastScrollY = useRef(window.scrollY);
  const searchFormRef = useRef<HTMLFormElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get("q") ?? "");
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!searchOpen) return;

    const handleOutside = (event: MouseEvent) => {
      if (searchFormRef.current && !searchFormRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("mousedown", handleOutside);
    window.addEventListener("keydown", handleEscape);
    searchInputRef.current?.focus();

    return () => {
      window.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [searchOpen]);

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchValue.trim();
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
    setMenuOpen(false);
    setSearchOpen(false);
  };

  const handleSearchIconClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!searchOpen) {
      event.preventDefault();
      setSearchOpen(true);
      return;
    }

    if (!searchValue.trim()) {
      event.preventDefault();
      setSearchOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchValue("");
    searchInputRef.current?.focus();
  };

  return (
    <>
      {announcementOpen && (
        <div className="nav-announcement" role="status" aria-live="polite">
          <span className="nav-announcement-text">
            <span className="nav-announcement-label">{launchOffer.label}</span>
            <span className="nav-announcement-message">{launchOffer.message}</span>
            <span className="nav-announcement-price">{launchOffer.price}</span>
          </span>
          <button
            type="button"
            className="nav-announcement-close"
            aria-label="Close announcement"
            onClick={() => setAnnouncementOpen(false)}
          >
            ×
          </button>
        </div>
      )}

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
          <Link to="/about">ABOUT</Link>
          <Link to="/contact">CONTACT</Link>
        </div>

        <div className="nav-actions">
          <form
            ref={searchFormRef}
            className={`nav-search ${searchOpen ? "nav-search--open" : ""}`}
            role="search"
            onSubmit={handleSearchSubmit}
          >
            <input
              ref={searchInputRef}
              type="search"
              className="nav-search-input"
              placeholder="Search products"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              aria-label="Search products"
            />
            {searchOpen && searchValue.trim().length > 0 && (
              <button
                type="button"
                className="nav-search-clear"
                aria-label="Clear search"
                onClick={handleClearSearch}
              >
                ×
              </button>
            )}
            <button
              type={searchOpen ? "submit" : "button"}
              className="nav-search-btn"
              aria-label={searchOpen ? "Search" : "Open search"}
              onClick={handleSearchIconClick}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </form>

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
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            ABOUT
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            CONTACT
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
