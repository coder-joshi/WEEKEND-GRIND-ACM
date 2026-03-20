import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ScanPage from "./pages/ScanPage";
import AdminPage from "./pages/AdminPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>🍽️ Scan</Link>
        <Link to="/admin" style={styles.link}>🛠️ Admin</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ScanPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const styles = {
  nav: {
    display: "flex",
    gap: "16px",
    padding: "12px 24px",
    background: "#0f172a",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
  },
};

export default App;