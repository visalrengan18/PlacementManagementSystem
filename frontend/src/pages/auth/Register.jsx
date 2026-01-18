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
    const [isExiting, setIsExiting] = useState(false);

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
            // Success Trigger
            setIsExiting(true);
            setTimeout(() => {
                showSuccess('Account created successfully! Welcome aboard! 🎉');
                const redirectPath = user.role === 'SEEKER' ? '/seeker/profile' : '/company/profile';
                navigate(redirectPath, { replace: true });
            }, 500);
        } catch (err) {
            showError(err.message || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className={`auth-container auth-container-wide animate-scale-in ${isExiting ? 'animate-fade-out-down' : ''}`}>

                {/* Sliding Toggle */}
                <div className="auth-toggle-wrapper">
                    <Link to="/login" className="auth-toggle-btn">Login</Link>
                    <Link to="/register" className="auth-toggle-btn active">Sign Up</Link>
                </div>

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
                            <span className="role-desc">I want a job</span>
                        </button>
                        <button
                            type="button"
                            className={`role-btn ${formData.role === 'COMPANY' ? 'active' : ''}`}
                            onClick={() => setFormData((prev) => ({ ...prev, role: 'COMPANY' }))}
                        >
                            <span className="role-icon">🏢</span>
                            <span className="role-label">Company</span>
                            <span className="role-desc">I am hiring</span>
                        </button>
                    </div>

                    <div className="form-group">
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className={`form-input ${errors.name ? 'error' : ''}`}
                            placeholder=" "
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <label htmlFor="name" className="form-label">
                            {formData.role === 'SEEKER' ? 'Full Name' : 'Company Name'}
                        </label>
                        {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder=" "
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <label htmlFor="email" className="form-label">Email Address</label>
                        {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>

                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className={`form-input ${errors.password ? 'error' : ''}`}
                                placeholder=" "
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <label htmlFor="password" className="form-label">Password</label>
                            {errors.password && <span className="form-error">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                                placeholder=" "
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            <label htmlFor="confirmPassword" className="form-label">Confirm</label>
                            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
