import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import profileApi from '../../api/profileApi';
import ProfileCard from '../../components/swipe/ProfileCard';
import './UserProfile.css';

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { error } = useNotification();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [type, setType] = useState('seeker');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileApi.getPublicProfileByUserId(userId);
                setProfile(data);

                // Determine type based on fields
                if (data.industry !== undefined) {
                    setType('company');
                } else {
                    setType('seeker');
                }
            } catch (err) {
                console.error(err);
                error('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchProfile();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="page-container flex items-center justify-center">
                <div className="spinner spinner-lg"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="page-container flex flex-col items-center justify-center">
                <h2>User not found</h2>
                <button onClick={() => navigate(-1)} className="btn btn-secondary mt-4">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="page-container user-profile-page">
            <button onClick={() => navigate(-1)} className="back-btn mb-4">
                ← Back
            </button>

            <div className="profile-wrapper">
                <ProfileCard profile={profile} type={type} showSwipeHints={false} />
            </div>
        </div>
    );
};

export default UserProfile;
