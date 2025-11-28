import React, { useState, useEffect } from 'react';
import { complaintAPI } from '../api';
import ComplaintCard from '../components/ComplaintCard';
import Loading from '../components/Loading';

function IssueDetails() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ status: '', category: '' });

    useEffect(() => {
        fetchComplaints();
    }, [filters]);

    const fetchComplaints = async () => {
        try {
            const response = await complaintAPI.getAllComplaints(filters);
            setComplaints(response.data);
        } catch (err) {
            console.error('Error fetching complaints:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="container">
            <h2 style={{ marginBottom: 20 }}>All Civic Issues</h2>

            <div style={{ display: 'flex', gap: 15, marginBottom: 30 }}>
                <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                    <option value="">All Status</option>
                    <option value="reported">Reported</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                </select>

                <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
                    <option value="">All Categories</option>
                    <option value="pothole">Pothole</option>
                    <option value="garbage">Garbage</option>
                    <option value="streetlight">Streetlight</option>
                    <option value="water_supply">Water Supply</option>
                    <option value="sanitation">Sanitation</option>
                </select>
            </div>

            {complaints.length === 0 ? (
                <p style={{ color: '#999' }}>No issues found.</p>
            ) : (
                <div className="issues-list">
                    {complaints.map((complaint) => (
                        <ComplaintCard key={complaint.id} complaint={complaint} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default IssueDetails;
