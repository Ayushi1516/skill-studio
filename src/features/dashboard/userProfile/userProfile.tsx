import { useAuth } from '../../../context/AuthContext';
import './UserProfile.css';

const UserProfile = () => {
    const { currentUser } = useAuth();
    
    return (
        <div className="user-profile">
        {currentUser && <div className='user-profile-container'>
            <h2><strong>{currentUser.role}:</strong>{currentUser.displayName}</h2>
            <p><strong>Email:</strong> {currentUser.email}</p>      
            <p><strong>Contact:</strong> {currentUser.contact}</p>
            </div>}
        </div>
    )
}

export default UserProfile;
