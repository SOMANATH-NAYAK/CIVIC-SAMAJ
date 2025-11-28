import React, { useState, useEffect } from 'react';
import './index.css';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ReportIssue from './pages/ReportIssue';
import IssueDetails from './pages/IssueDetails';

function App() {
    const [page, setPage] = useState('dashboard');
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

    const handleLoginSuccess = (name) => {
        setUserName(name);
        setIsLoggedIn(true);
        setPage('dashboard');
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUserName('');
        setPage('dashboard');
    };

    const renderPage = () => {
        if (!isLoggedIn) {
            return <LoginPage onLoginSuccess={handleLoginSuccess} />;
        }

        switch (page) {
            case 'dashboard':
                return <Dashboard />;
            case 'report':
                return <ReportIssue />;
            case 'issues':
                return <IssueDetails />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <div className="app">
            {isLoggedIn && (
                <Navbar
                    isLoggedIn={isLoggedIn}
                    userName={userName}
                    onLogout={handleLogout}
                    onNavigate={setPage}
                />
            )}
            {renderPage()}
        </div>
    );
}

export default App;
