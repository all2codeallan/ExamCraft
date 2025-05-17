import React from "react";
import { Link } from "react-router-dom";
import '../styles/home.css';

/* 
There is no routing to /dashboard for any role on opening the app 
So use a user variable in App.jsx to do the routing to respective dashboard if the token is there in localStorage */


export default function Home() {
  return (
    <div className="home">
      <header className="header-main">
        <div className="header-content">
          {/* <div className="logo">QPG</div> */}
          <div className="nav-links">
            <Link to="/login-admin" className="login-button">
              Admin Login
            </Link>
            <Link to="/login-faculty" className="login-button">
              Faculty Login
            </Link>
            <Link to="/login-student" className="login-button">
              Student Login
            </Link>
          </div>
        </div>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <h1>Exam Craft</h1>
          <p>Create and manage question papers efficiently</p>
          <div className="features">
            <div className="feature-card">
              <div className="icon">📝</div>
              <h3>Easy Creation</h3>
              <p>Create question papers with just a few clicks</p>
            </div>
            <div className="feature-card">
              <div className="icon">🎯</div>
              <h3>Smart Filtering</h3>
              <p>Filter questions by CO, BT level, and more</p>
            </div>
            <div className="feature-card">
              <div className="icon">📊</div>
              <h3>Organized Management</h3>
              <p>Manage your question bank efficiently</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
