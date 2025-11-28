import React from 'react';

function StatsGrid({ stats }) {
    return (
        <div className="stats-grid">
            <div className="stat-card">
                <h3>Total Reports</h3>
                <div className="number">{stats?.total || 0}</div>
            </div>
            <div className="stat-card">
                <h3>🔴 Reported</h3>
                <div className="number">{stats?.reported || 0}</div>
            </div>
            <div className="stat-card">
                <h3>🟡 In Progress</h3>
                <div className="number">{stats?.in_progress || 0}</div>
            </div>
            <div className="stat-card">
                <h3>🟢 Resolved</h3>
                <div className="number">{stats?.resolved || 0}</div>
            </div>
        </div>
    );
}

export default StatsGrid;
