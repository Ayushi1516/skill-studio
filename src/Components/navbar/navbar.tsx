import { Nav, Navbar } from "react-bootstrap";
import skilllogo from "../../assets/logo.png";
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, NavLink, Link } from "react-router-dom";
import "./Navbar.css";

export default function NavbarComp() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "block", width: "100%", margin: "auto" }}>
      <Navbar bg={theme} variant={theme} sticky="top">
        <Navbar.Brand as={Link} to="/">
          <img
            src={skilllogo}
            alt="Sample Brand Logo"
            width="30"
            className="align-top d-inline-block"
            height="30"
            style={{ borderRadius: "50%" }}
          />
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            {currentUser && (
              <Nav.Link as={NavLink} to="/dashboard">Dashboard</Nav.Link>
            )}
            {currentUser?.role === 'admin' && (
              <Nav.Link as={NavLink} to="/admin">Admin</Nav.Link>)}
            {/* from href page reload, Navlink resolves this issue*/}
          </Nav>
          <Nav>
            <Nav.Link onClick={toggleTheme}>
              {theme === "light" ? "🌙" : "☀️"}
            </Nav.Link>
            {currentUser ? (
              <>
                <Nav.Link as={NavLink} to="/profile" className="navbar-text">👤 {currentUser.displayName}</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to="/login" className="nav-link">👤 Login</Nav.Link>
                <Nav.Link as={NavLink} to="/register" className="nav-link">📝 Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
