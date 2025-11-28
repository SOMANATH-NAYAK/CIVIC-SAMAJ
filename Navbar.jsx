import React from 'react';

function Navbar({ isLoggedIn, userName, onLogout, onNavigate }) {
    return (
        <nav className="navbar">
            <div className="navbar-content">
                <div className="logo">🏛️ Civic Portal</div>
                <div className="nav-links">
                    {isLoggedIn ? (
                        <>
                            <span style={{ fontWeight: 600 }}>Hi, {userName}! 👋</span>
                            <a href="#" className="nav-link" onClick={(e) => {
                                e.preventDefault();
                                onNavigate('dashboard');
                            }}>
                                Dashboard
                            </a>
                            <a href="#" className="nav-link" onClick={(e) => {
                                e.preventDefault();
                                onNavigate('report');
                            }}>
                                Report Issue
                            </a>
                            <a href="#" className="nav-link" onClick={(e) => {
                                e.preventDefault();
                                onNavigate('issues');
                            }}>
                                View Issues
                            </a>
                            <button className="btn btn-logout" onClick={onLogout}>
                                Logout
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
