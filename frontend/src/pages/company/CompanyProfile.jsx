import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import profileApi from '../../api/profileApi';
import '../seeker/Profile.css';

const CompanyProfile = () => {
    const { user } = useAuth();
    const { success, error } = useNotification();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const [profile, setProfile] = useState({
        industry: '',
        location: '',
        size: '',
        website: '',
        description: '',
        founded: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileApi.getCompanyProfile();
                setProfile({
                    industry: data.industry || '',
                    location: data.location || '',
                    size: data.size || '',
                    website: data.website || '',
                    description: data.description || '',
                    founded: data.founded || '',
                });
            } catch (err) {
                error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await profileApi.updateCompanyProfile(profile);
            success('Company profile updated! 🎉');
        } catch (err) {
            error('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center">
                <div className="spinner spinner-lg"></div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="profile-page">
                <div className="profile-header-section">
                    <div className="profile-avatar-edit">
                        <div className="profile-avatar-large profile-avatar-placeholder">{user?.name?.charAt(0) || 'C'}</div>
                        <button className="avatar-edit-btn">📷</button>
                    </div>
                    <div className="profile-header-info">
                        <h1>{user?.name || 'Company Name'}</h1>
                        <p>{profile.industry || 'Add industry'}</p>
                        <span className="profile-location">📍 {profile.location || 'Add location'}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <section className="profile-section card">
                        <h2 className="section-title">Company Information</h2>
                        <div className="form-grid">
                            <div className="form-group"><label className="form-label">Industry</label><input type="text" name="industry" className="form-input" value={profile.industry} onChange={handleChange} placeholder="e.g. Technology" /></div>
                            <div className="form-group"><label className="form-label">Location</label><input type="text" name="location" className="form-input" value={profile.location} onChange={handleChange} placeholder="e.g. San Francisco, CA" /></div>
                            <div className="form-group"><label className="form-label">Company Size</label><input type="text" name="size" className="form-input" value={profile.size} onChange={handleChange} placeholder="e.g. 50-200 employees" /></div>
                            <div className="form-group"><label className="form-label">Founded Year</label><input type="text" name="founded" className="form-input" value={profile.founded} onChange={handleChange} placeholder="e.g. 2015" /></div>
                            <div className="form-group full-width"><label className="form-label">Website</label><input type="url" name="website" className="form-input" value={profile.website} onChange={handleChange} placeholder="https://yourcompany.com" /></div>
                            <div className="form-group full-width"><label className="form-label">About Company</label><textarea name="description" className="form-input form-textarea" value={profile.description} onChange={handleChange} rows={4} placeholder="Describe your company..." /></div>
                        </div>
                    </section>
                    <div className="profile-actions">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>{saving ? <span className="spinner"></span> : 'Save Changes'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CompanyProfile;
