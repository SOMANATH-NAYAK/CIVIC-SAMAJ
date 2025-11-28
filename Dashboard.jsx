import React, { useState, useEffect } from 'react';
import { adminAPI, complaintAPI } from '../api';
import StatsGrid from '../components/StatsGrid';
import ComplaintCard from '../components/ComplaintCard';
import Loading from '../components/Loading';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [myComplaints, setMyComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, complaintsRes] = await Promise.all([
                adminAPI.getStats(),
                complaintAPI.getMyComplaints(),
            ]);
            setStats(statsRes.data);
            setMyComplaints(complaintsRes.data);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="container">
            <h2 style={{ marginBottom: 20 }}>Dashboard</h2>
            <StatsGrid stats={stats} />

            <div style={{ marginTop: 40 }}>
                <h3 style={{ marginBottom: 20 }}>Your Recent Reports</h3>
                {myComplaints.length === 0 ? (
                    <p style={{ color: '#999' }}>No reports yet. Create one now!</p>
                ) : (
                    <div className="issues-list">
                        {myComplaints.map((complaint) => (
                            <ComplaintCard key={complaint.id} complaint={complaint} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
