import React from 'react';

function Loading() {
    return (
        <div className="loading">
            <div className="spinner"></div>
            <p style={{ marginTop: 15, color: '#999' }}>Loading...</p>
        </div>
    );
}

export default Loading;
