import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import userService from '../../services/userService';
import '../../styles/admin/AdminUsers.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roles: []
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({
      ...currentUser,
      [name]: value
    });
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setCurrentUser({
        ...currentUser,
        roles: [...currentUser.roles, value]
      });
    } else {
      setCurrentUser({
        ...currentUser,
        roles: currentUser.roles.filter(role => role !== value)
      });
    }
  };

  const handleAddUser = () => {
    setIsEditing(false);
    setCurrentUser({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      roles: ['ROLE_USER']
    });
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setIsEditing(true);
    setCurrentUser({
      ...user,
      password: '' // Don't show existing password
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let updatedUser;
      
      if (isEditing) {
        // If password is empty, don't update it
        const userData = currentUser.password 
          ? currentUser 
          : { ...currentUser, password: undefined };
          
        updatedUser = await userService.updateUser(currentUser.id, userData);
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      } else {
        updatedUser = await userService.createUser(currentUser);
        setUsers([...users, updatedUser]);
      }
      
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving user:', err);
      alert('Failed to save user. Please try again.');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Users">
        <div className="loading">Loading users...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Users">
        <div className="error-message">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Users">
      <div className="admin-users">
        <div className="admin-actions">
          <button className="add-button" onClick={handleAddUser}>
            Add New User
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Registered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{`${user.firstName} ${user.lastName}`}</td>
                <td>{user.email}</td>
                <td>
                  {user.roles.map(role => (
                    <span key={role} className="role-badge">
                      {role.replace('ROLE_', '')}
                    </span>
                  ))}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="actions-cell">
                  <button 
                    className="edit-button"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="user-modal">
              <h2>{isEditing ? 'Edit User' : 'Add New User'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={currentUser.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={currentUser.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={currentUser.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">
                    {isEditing ? 'Password (leave blank to keep current)' : 'Password'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={currentUser.password}
                    onChange={handleInputChange}
                    required={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Roles</label>
                  <div className="checkbox-group">
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="role-user"
                        name="roles"
                        value="ROLE_USER"
                        checked={currentUser.roles.includes('ROLE_USER')}
                        onChange={handleRoleChange}
                      />
                      <label htmlFor="role-user">User</label>
                    </div>
                    <div className="checkbox-item">
                      <input
                        type="checkbox"
                        id="role-admin"
                        name="roles"
                        value="ROLE_ADMIN"
                        checked={currentUser.roles.includes('ROLE_ADMIN')}
                        onChange={handleRoleChange}
                      />
                      <label htmlFor="role-admin">Admin</label>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-button">
                    {isEditing ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;