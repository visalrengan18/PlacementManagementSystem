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
            showSuccess(`Welcome back, ${user.name}! 🎉`);
            // Redirect based on role
            const redirectPath = user.role === 'SEEKER' ? '/seeker/dashboard' : '/company/dashboard';
            navigate(from !== '/' ? from : redirectPath, { replace: true });
        } catch (err) {
            showError(err.message || 'Login failed. Please check your credentials.');
        } finally {
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
            <div className="auth-container animate-fade-in-up">
                <div className="auth-header">
                    <div className="auth-logo">💼</div>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to continue your job search journey</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            className={`form-input ${errors.email ? 'error' : ''}`}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            id="password"
                            className={`form-input ${errors.password ? 'error' : ''}`}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <span className="form-error">{errors.password}</span>}
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
                        {loading ? <span className="spinner"></span> : 'Sign In'}
                    </button>
                </form>

                <div className="auth-divider">
                    <span>or try demo accounts</span>
                </div>

                <div className="demo-buttons">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleDemoLogin('SEEKER')}
                    >
                        👤 Demo Seeker
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => handleDemoLogin('COMPANY')}
                    >
                        🏢 Demo Company
                    </button>
                </div>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Create one</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
