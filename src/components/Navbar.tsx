import '../styles/Navbar.css'

const Navbar = () => {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-links nav-left">
          <a href="#">HOME</a>
          <a href="#shop">SHOP</a>
        </div>

        <a href="#" className="nav-brand">
          <img src="/roohlogo.png" alt="Rooh Perfumes" className="nav-logo" />
        </a>

        <div className="nav-links nav-right">
          <a href="#about">ABOUT</a>
          <a href="#contact">CONTACT</a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
