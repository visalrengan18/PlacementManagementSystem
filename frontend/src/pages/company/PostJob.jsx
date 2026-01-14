import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import jobApi from '../../api/jobApi';
import './PostJob.css';

const PostJob = () => {
    const navigate = useNavigate();
    const { success, error } = useNotification();
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        type: 'FULL_TIME',
        salaryMin: '',
        salaryMax: '',
        description: '',
        requirements: '',
        skills: [],
    });

    const [newSkill, setNewSkill] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
            setNewSkill('');
        }
    };

    const handleRemoveSkill = (skill) => {
        setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                ...formData,
                salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
                salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
            };
            await jobApi.createJob(payload);
            success('Job posted successfully! 🎉');
            navigate('/company/jobs');
        } catch (err) {
            error('Failed to post job. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page-container">
            <div className="post-job-page">
                <div className="page-header">
                    <h1>Post a New Job</h1>
                    <p className="text-muted">Fill in the details to attract the best candidates</p>
                </div>

                <form onSubmit={handleSubmit} className="job-form">
                    <section className="form-section card">
                        <h2>Basic Information</h2>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label className="form-label">Job Title *</label>
                                <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required placeholder="e.g. Senior React Developer" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Location</label>
                                <input type="text" name="location" className="form-input" value={formData.location} onChange={handleChange} placeholder="e.g. San Francisco, CA or Remote" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Employment Type</label>
                                <select name="type" className="form-input" value={formData.type} onChange={handleChange}>
                                    <option value="FULL_TIME">Full-time</option>
                                    <option value="PART_TIME">Part-time</option>
                                    <option value="CONTRACT">Contract</option>
                                    <option value="INTERNSHIP">Internship</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Minimum Salary ($)</label>
                                <input type="number" name="salaryMin" className="form-input" value={formData.salaryMin} onChange={handleChange} placeholder="e.g. 80000" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Maximum Salary ($)</label>
                                <input type="number" name="salaryMax" className="form-input" value={formData.salaryMax} onChange={handleChange} placeholder="e.g. 120000" />
                            </div>
                        </div>
                    </section>

                    <section className="form-section card">
                        <h2>Description</h2>
                        <div className="form-group">
                            <label className="form-label">Job Description *</label>
                            <textarea name="description" className="form-input form-textarea" value={formData.description} onChange={handleChange} required placeholder="Describe the role..." rows={5} />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Requirements</label>
                            <textarea name="requirements" className="form-input form-textarea" value={formData.requirements} onChange={handleChange} placeholder="List the requirements..." rows={4} />
                        </div>
                    </section>

                    <section className="form-section card">
                        <h2>Required Skills</h2>
                        <div className="skills-input-group">
                            <input type="text" className="form-input" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a skill..." onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} />
                            <button type="button" className="btn btn-secondary" onClick={handleAddSkill}>Add</button>
                        </div>
                        <div className="skills-list">
                            {formData.skills.map((skill) => (
                                <span key={skill} className="skill-tag editable">
                                    {skill}
                                    <button type="button" className="skill-remove" onClick={() => handleRemoveSkill(skill)}>×</button>
                                </span>
                            ))}
                        </div>
                    </section>

                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
                        <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
                            {saving ? <span className="spinner"></span> : 'Post Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostJob;
