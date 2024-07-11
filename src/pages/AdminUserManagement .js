import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  useEffect(() => {
    if (!showLogin) {
      // Fetch the list of users when the component mounts
      const fetchUsers = async () => {
        try {
          const response = await axios.get('http://localhost:9090/api/auth/users');
          setUsers(response.data);
        } catch (error) {
          console.error('There was an error fetching users!', error);
        }
      };
      fetchUsers();
    }
  }, [showLogin]);

  const handleLogin = async () => {
    if (adminUsername === 'admin' && adminPassword === 'admin') {
      setShowLogin(false);
    } else {
      setError('Invalid admin credentials');
    }
  };

  const handleAddUser = async () => {
    try {
      await axios.post('http://localhost:9090/api/auth/register', newUser);
      setNewUser({ username: '', password: '' });
      // Fetch the updated list of users
      const response = await axios.get('http://localhost:9090/api/auth/users');
      setUsers(response.data);
    } catch (error) {
      setError('Error adding new user');
      console.error('There was an error adding a new user!', error);
    }
  };

  const handleEditUser = async () => {
    try {
      await axios.put(`http://localhost:9090/api/auth/users/${editingUser.id}`, editForm);
      setEditingUser(null);
      setEditForm({ username: '', password: '' });
      // Fetch the updated list of users
      const response = await axios.get('http://localhost:9090/api/auth/users');
      setUsers(response.data);
    } catch (error) {
      setError('Error updating user');
      console.error('There was an error updating the user!', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:9090/api/auth/users/${userId}`);
      // Fetch the updated list of users
      const response = await axios.get('http://localhost:9090/api/auth/users');
      setUsers(response.data);
    } catch (error) {
      setError('Error deleting user');
      console.error('There was an error deleting the user!', error);
    }
  };

  if (showLogin) {
    return (
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6">
            {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
            <div>
              <label htmlFor="adminUsername" className="block text-sm font-medium leading-6 text-gray-900">
                Admin Username
              </label>
              <div className="mt-2">
                <input
                  id="adminUsername"
                  name="adminUsername"
                  type="text"
                  required
                  autoComplete="username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium leading-6 text-gray-900">
                Admin Password
              </label>
              <div className="mt-2">
                <input
                  id="adminPassword"
                  name="adminPassword"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
            <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Sign in
                </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="p-8 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Add New User</h3>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="block w-full rounded-md border border-gray-300 py-2 px-3 mb-2 text-gray-900 shadow-sm placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="block w-full rounded-md border border-gray-300 py-2 px-3 mb-2 text-gray-900 shadow-sm placeholder-gray-400"
        />
        <button
          type="button"
          onClick={handleAddUser}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-500"
        >
          Add User
        </button>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">User List</h3>
        <ul className="space-y-4">
          {users.map(user => (
            <li key={user.id} className="flex justify-between items-center p-2 bg-gray-100 rounded-md">
              <div>
                <p className="font-medium">{user.username}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingUser(user);
                    setEditForm({ username: user.username, password: '' });
                  }}
                  className="text-blue-600 hover:text-blue-500"
                >
                  <PencilIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className="text-red-600 hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {editingUser && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Edit User</h3>
          <input
            type="text"
            placeholder="Username"
            value={editForm.username}
            onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
            className="block w-full rounded-md border border-gray-300 py-2 px-3 mb-2 text-gray-900 shadow-sm placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password (leave blank to keep current password)"
            value={editForm.password}
            onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
            className="block w-full rounded-md border border-gray-300 py-2 px-3 mb-2 text-gray-900 shadow-sm placeholder-gray-400"
          />
          <button
            type="button"
            onClick={handleEditUser}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
