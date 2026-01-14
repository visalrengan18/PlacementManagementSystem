import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import profileApi from '../../api/profileApi';
import './Profile.css';

const SeekerProfile = () => {
    const { user } = useAuth();
    const { success, error } = useNotification();
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [newSkill, setNewSkill] = useState('');

    const [profile, setProfile] = useState({
        title: '',
        location: '',
        phone: '',
        bio: '',
        experience: '',
        education: '',
        skills: [],
        resumeUrl: '',
        linkedin: '',
        github: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileApi.getSeekerProfile();
                setProfile({
                    title: data.title || '',
                    location: data.location || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                    experience: data.experience || '',
                    education: data.education || '',
                    skills: data.skills || [],
                    resumeUrl: data.resumeUrl || '',
                    linkedin: data.linkedin || '',
                    github: data.github || '',
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

    const handleAddSkill = () => {
        if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
            setProfile((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skill) => {
        setProfile((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await profileApi.updateSeekerProfile(profile);
            success('Profile updated successfully! 🎉');
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
                        <div className="profile-avatar-large profile-avatar-placeholder">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <button className="avatar-edit-btn">📷</button>
                    </div>
                    <div className="profile-header-info">
                        <h1>{user?.name || 'Your Name'}</h1>
                        <p>{profile.title || 'Add a title'}</p>
                        <span className="profile-location">📍 {profile.location || 'Add location'}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <section className="profile-section card">
                        <h2 className="section-title">Basic Information</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Professional Title</label>
                                <input type="text" name="title" className="form-input" value={profile.title} onChange={handleChange} placeholder="e.g. Senior React Developer" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input type="text" name="location" className="form-input" value={profile.location} onChange={handleChange} placeholder="e.g. San Francisco, CA" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input type="tel" name="phone" className="form-input" value={profile.phone} onChange={handleChange} placeholder="Your phone number" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Experience</label>
                                <input type="text" name="experience" className="form-input" value={profile.experience} onChange={handleChange} placeholder="e.g. 5 years" />
                            </div>
                            <div className="form-group full-width">
                                <label className="form-label">Education</label>
                                <input type="text" name="education" className="form-input" value={profile.education} onChange={handleChange} placeholder="e.g. BS Computer Science, Stanford" />
                            </div>
                        </div>
                    </section>

                    <section className="profile-section card">
                        <h2 className="section-title">About</h2>
                        <div className="form-group">
                            <textarea name="bio" className="form-input form-textarea" value={profile.bio} onChange={handleChange} placeholder="Tell employers about yourself..." rows={4} />
                        </div>
                    </section>

                    <section className="profile-section card">
                        <h2 className="section-title">Skills</h2>
                        <div className="skills-input-group">
                            <input type="text" className="form-input" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill..." onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} />
                            <button type="button" className="btn btn-secondary" onClick={handleAddSkill}>Add</button>
                        </div>
                        <div className="skills-list">
                            {profile.skills.map((skill) => (
                                <span key={skill} className="skill-tag editable">
                                    {skill}
                                    <button type="button" className="skill-remove" onClick={() => handleRemoveSkill(skill)}>×</button>
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="profile-section card">
                        <h2 className="section-title">Links</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Resume URL</label>
                                <input type="url" name="resumeUrl" className="form-input" value={profile.resumeUrl} onChange={handleChange} placeholder="Link to your resume" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">LinkedIn</label>
                                <input type="url" name="linkedin" className="form-input" value={profile.linkedin} onChange={handleChange} placeholder="LinkedIn profile URL" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">GitHub</label>
                                <input type="url" name="github" className="form-input" value={profile.github} onChange={handleChange} placeholder="GitHub profile URL" />
                            </div>
                        </div>
                    </section>

                    <div className="profile-actions">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                            {saving ? <span className="spinner"></span> : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SeekerProfile;
