import { Link } from "react-router-dom";
import { useAuth } from "./security/AuthContext";
import "../styles/todoApp.css"
import React from "react";

export default function Header() {
  const authContext = useAuth();
  const isAuthenticated = authContext.isAuthenticated;
  const isAdmin = authContext.isAdmin;

  return (
    <div className="Header border-bottom border-light border-5 mb-5 p-2 bg-dark text-white">
      <div className="container">
        <div className="row">
          <nav className="navbar navbar-expand-lg navbar-dark">
            <a
              className="navbar-brand ms-2 fs-2 fw-bold text-white"
              href="https://g4stlyx.github.io"
            >
              g4stly
            </a>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav">
                <li className="nav-item fs-5">
                  {isAuthenticated && 
                  <Link className="nav-link text-white" to="/welcome/g4stly">
                    Home
                  </Link>}
                </li>
                <li className="nav-item fs-5">
                  {isAuthenticated && 
                  <Link className="nav-link text-white" to="/todos">
                    Todos
                  </Link>}
                </li>
              </ul>
            </div>
            <ul className="navbar-nav">
              <li className="nav-item fs-5">
                {!isAuthenticated && <Link className="nav-link text-white" to="/login">
                  Login
                </Link>}
              </li>
              <li className="nav-item fs-5">
                {isAdmin && isAuthenticated && <Link className="nav-link text-white" to="/administrator/users">
                  Users
                </Link>}
              </li>
              <li className="nav-item fs-5">
                {isAuthenticated && <Link className="nav-link text-white" to="/profile">
                  Profile
                </Link>}
              </li>
              <li className="nav-item fs-5">
                {isAuthenticated && <Link className="nav-link text-white" to="/logout" onClick={authContext.logout}>
                  Logout
                </Link>}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}