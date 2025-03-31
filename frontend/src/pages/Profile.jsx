import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/Profile.css';
import { toast } from 'react-toastify';

const Profile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!token || !user) {
          setLoading(false);
          return;
        }

        const [userResponse, addressesResponse] = await Promise.all([
          axios.get(`http://localhost:8080/api/users/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:8080/api/users/${user.id}/addresses`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setProfile(userResponse.data);
        setAddresses(addressesResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/users/${currentUser.id}`,
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h1>My Profile</h1>
      
      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                value={profile.firstName || ''}
                onChange={(e) => setProfile({...profile, firstName: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                value={profile.lastName || ''}
                onChange={(e) => setProfile({...profile, lastName: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profile.email || ''}
                disabled
              />
            </div>
            
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={profile.phoneNumber || ''}
                onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})}
              />
            </div>
            
            <button type="submit" className="update-button">
              Update Profile
            </button>
          </form>
        </div>

        <div className="addresses-section">
          <h2>My Addresses</h2>
          <div className="addresses-list">
            {addresses.map(address => (
              <div key={address.id} className="address-card">
                <p><strong>{address.name}</strong></p>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                {address.isDefault && <span className="default-badge">Default</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;