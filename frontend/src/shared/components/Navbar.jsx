import "../styles/Navbar.scss";

const Navbar = () => {
  return (
    <nav className="navbar">
      <span className="navbar__logo">StepWise</span>
      <div className="navbar__links">
        <a href="#" className="navbar__link navbar__link--accent">Sign in</a>
      </div>
    </nav>
  );
};

export default Navbar;