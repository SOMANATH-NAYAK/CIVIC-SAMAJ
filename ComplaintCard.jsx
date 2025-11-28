import React from 'react';

function ComplaintCard({ complaint }) {
    return (
        <div className="issue-card">
            <h4>{complaint.title}</h4>
            <p>{complaint.description}</p>
            <div className="issue-meta">
                <span className={`badge badge-${complaint.status}`}>
                    {complaint.status.replace('_', ' ').toUpperCase()}
                </span>
                <span style={{ color: '#999', fontSize: 12 }}>
                    {complaint.category}
                </span>
            </div>
            {complaint.image_url && (
                <img src={`http://localhost:5000${complaint.image_url}`} alt="Issue" className="issue-image" />
            )}
            <small style={{ color: '#999' }}>
                Reported by {complaint.user_name} • {new Date(complaint.created_at).toLocaleDateString()}
            </small>
        </div>
    );
}

export default ComplaintCard;
