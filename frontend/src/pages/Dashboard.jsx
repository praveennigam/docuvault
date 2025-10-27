import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2 className="welcome-text">🎉 Welcome to Your Dashboard!</h2>
        <p className="sub-text">
          You are now successfully logged in. Explore your account and enjoy
          the experience!
        </p>

        <div className="button-group">
          <button className="action-btn">My Profile</button>
          <button className="action-btn">My Documents</button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
