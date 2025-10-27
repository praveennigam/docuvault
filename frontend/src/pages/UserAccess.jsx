import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import "./UserAccess.css";

export default function UserAccess() {
  const [page, setPage] = useState("dashboard");
  const navigate = useNavigate();

  // ✅ Called when login is successful
  const handleLoginSuccess = (user) => {
    console.log("Logged in as:", user);
    localStorage.setItem("isLoggedIn", "true");
    navigate("/user-dashboard"); // ✅ redirect to dashboard
  };

  return (
    <div className="user-access-container">
      {page === "dashboard" && (
        <div className="welcome-box fade-in">
          <h1 className="app-title">Welcome to User Portal</h1>
          <p className="subtitle">Access your account or join the portal</p>
          <div className="button-group">
            <button className="btn login-btn" onClick={() => setPage("login")}>
              Login
            </button>
            <button
              className="btn register-btn"
              onClick={() => setPage("register")}
            >
              Register
            </button>
          </div>
        </div>
      )}

      {page === "login" && (
        <LoginPage
          onBack={() => setPage("dashboard")}
          onLoginSuccess={handleLoginSuccess} // ✅ pass handler
        />
      )}

      {page === "register" && (
        <RegisterPage onBack={() => setPage("dashboard")} />
      )}
    </div>
  );
}
