import React, { useState } from 'react';
import { complaintAPI } from '../api';

function ReportIssue() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'pothole',
        latitude: '',
        longitude: '',
        image: null,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleGetLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setFormData({
                    ...formData,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('latitude', formData.latitude);
            data.append('longitude', formData.longitude);
            if (formData.image) {
                data.append('image', formData.image);
            }

            await complaintAPI.createComplaint(data);
            setSuccess(true);
            setFormData({ title: '', description: '', category: 'pothole', latitude: '', longitude: '', image: null });
            setPreview(null);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to report issue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card" style={{ maxWidth: 600, margin: '0 auto' }}>
                <h2>Report a Civic Issue 📍</h2>

                {success && <div className="success-message">✅ Report submitted successfully!</div>}
                {error && <div className="error-message">❌ {error}</div>}

                <form onSubmit={handleSubmit} style={{ marginTop: 30 }}>
                    <div className="form-group">
                        <label>Issue Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g., Broken pothole on Main Street"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the issue in detail..."
                            required
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category *</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="pothole">Pothole</option>
                            <option value="garbage">Garbage</option>
                            <option value="streetlight">Streetlight</option>
                            <option value="water_supply">Water Supply</option>
                            <option value="sanitation">Sanitation</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <input
                                type="text"
                                value={formData.latitude}
                                placeholder="Latitude"
                                readOnly
                            />
                            <input
                                type="text"
                                value={formData.longitude}
                                placeholder="Longitude"
                                readOnly
                            />
                        </div>
                        <button type="button" className="btn btn-secondary" onClick={handleGetLocation} style={{ marginTop: 10 }}>
                            📍 Get Current Location
                        </button>
                    </div>

                    <div className="form-group">
                        <label>Upload Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {preview && (
                            <img src={preview} alt="Preview" className="issue-image" />
                        )}
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                        {loading ? 'Submitting...' : 'Submit Report'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ReportIssue;
