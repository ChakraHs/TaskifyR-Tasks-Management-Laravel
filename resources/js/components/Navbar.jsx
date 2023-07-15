
import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
    const location = useLocation();
  return (
    <div>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">TASKDONE</Link>
                <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} aria-current="page" to="/"><i className="fas fa-home"></i> Home</Link>
                    </li>
                    <li className="nav-item">
                    <Link className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`} to="/create"><i className="fas fa-edit"></i> Create task</Link>
                    </li>
                </ul>
                </div>
            </div>
            </nav>
    </div>
  )
}

