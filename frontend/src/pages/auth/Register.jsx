import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'SEEKER',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { register } = useAuth();
    const { error: showError, success: showSuccess } = useNotification();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';

        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
        else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const user = await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });
            showSuccess('Account created successfully! Welcome aboard! 🎉');
            // Redirect based on role
            const redirectPath = user.role === 'SEEKER' ? '/seeker/profile' : '/company/profile';
            navigate(redirectPath, { replace: true });
        } catch (err) {
            showError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container auth-container-wide animate-fade-in-up">
                <div className="auth-header">
                    <div className="auth-logo">💼</div>
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join the best talent-job matching platform</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Role Selection */}
                    <div className="role-selector">
                        <button
                            type="button"
                            className={`role-btn ${formData.role === 'SEEKER' ? 'active' : ''}`}
                            onClick={() => setFormData((prev) => ({ ...prev, role: 'SEEKER' }))}
                        >
                            <span className="role-icon">👤</span>
                            <span className="role-label">Job Seeker</span>
                            <span className="role-desc">Looking for opportunities</span>
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${formData.role === 'COMPANY' ? 'active' : ''}`}
                            onClick={() => setFormData((prev) => ({ ...prev, role: 'COMPANY' }))}
                        >
                            <span className="role-icon">🏢</span>
                            <span className="role-label">Company</span>
                            <span className="role-desc">Hiring talent</span>
                        </button>
                    </div>

                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            {formData.role === 'SEEKER' ? 'Full Name' : 'Company Name'}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className={`form-input ${errors.name ? 'error' : ''}`}
                            placeholder={formData.role === 'SEEKER' ? 'John Doe' : 'Acme Inc.'}
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && <span className="form-error">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                        {loading ? <span className="spinner"></span> : 'Create Account'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
