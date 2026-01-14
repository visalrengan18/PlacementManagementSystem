import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import companyApi from '../../api/companyApi';
import { useNotification } from '../../context/NotificationContext';
import './CompanySearch.css';

const CompanySearch = () => {
    const navigate = useNavigate();
    const { error } = useNotification();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchCompanies();
    }, [debouncedSearch]);

    const fetchCompanies = async () => {
        try {
            setLoading(true);
            const response = await companyApi.search(debouncedSearch);
            setCompanies(response.content || []);
        } catch (err) {
            error('Failed to load companies');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="company-search-page">
                <div className="page-header center-header">
                    <h1>Explore Companies</h1>
                    <p className="text-muted">Discover great places to work</p>

                    <div className="search-bar-container">
                        <input
                            type="text"
                            placeholder="Search by company name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="spinner spinner-lg"></div>
                    </div>
                ) : companies.length > 0 ? (
                    <div className="companies-grid">
                        {companies.map((company) => (
                            <div
                                key={company.id}
                                className="company-card"
                                onClick={() => navigate(`/seeker/companies/${company.id}`)}
                            >
                                <div className="company-logo-placeholder">
                                    {company.name.charAt(0)}
                                </div>
                                <div className="company-info">
                                    <h3>{company.name}</h3>
                                    <p className="company-industry">{company.industry || 'Tech'}</p>
                                    <p className="company-location">📍 {company.location || 'Remote'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-icon">🏢</div>
                        <h3>No companies found</h3>
                        <p>Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanySearch;
