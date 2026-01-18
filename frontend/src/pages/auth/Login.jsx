import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import './Auth.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [isExiting, setIsExiting] = useState(false);

    const { login } = useAuth();
    const { error: showError, success: showSuccess } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            const user = await login(email, password);
            // Success Animation Trigger
            setIsExiting(true);
            setTimeout(() => {
                showSuccess(`Welcome back, ${user.name}! 🎉`);
                const redirectPath = user.role === 'SEEKER' ? '/seeker/dashboard' : '/company/dashboard';
                navigate(from !== '/' ? from : redirectPath, { replace: true });
            }, 500); // Wait for exit animation (0.5s)
        } catch (err) {
            showError(err.message || 'Login failed. Please check your credentials.');
            setLoading(false);
        }
    };

    // Demo login handlers
    const handleDemoLogin = async (role) => {
        const demoCredentials = {
            SEEKER: { email: 'seeker@demo.com', password: 'demo123' },
            COMPANY: { email: 'company@demo.com', password: 'demo123' },
        };
        setEmail(demoCredentials[role].email);
        setPassword(demoCredentials[role].password);
    };

    return (
        <div className="auth-page">
            <div className={`auth-container animate-scale-in ${isExiting ? 'animate-fade-out-down' : ''}`}>

                {/* Sliding Toggle */}
                <div className="auth-toggle-wrapper">
                    <Link to="/login" className="auth-toggle-btn active">Login</Link>
                    <Link to="/register" className="auth-toggle-btn">Sign Up</Link>
                </div>

                <div className="auth-header">
                    <div className="auth-logo">💼</div>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Enter your details to access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <input
                            type="email"
                            id="email"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder=" " /* Placeholder needed for :placeholder-shown trick */
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <label htmlFor="email" className="form-label">Email Address</label>
                        {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            id="password"
                            className={`form-input ${errors.password ? 'error' : ''}`}
                            placeholder=" "
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <label htmlFor="password" className="form-label">Password</label>
                        {errors.password && <span className="form-error">{errors.password}</span>}
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                        {/* Optional: Forgot Password Link could go here */}
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or continue with</span>
                </div>

                <div className="demo-buttons">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleDemoLogin('SEEKER')}
                    >
                        Demo Seeker
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleDemoLogin('COMPANY')}
                    >
                        Demo Company
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
