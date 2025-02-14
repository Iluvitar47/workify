'use client';

import { User } from '@/models/user.model';
import React, { useState, useEffect } from 'react';
import Modal from './ModalsDashboard';

const UsersComponents: React.FC = () => {
  const urlApi = process.env.NEXT_PUBLIC_URL_API;
  const usersRoute = `${urlApi}/users`;
  const updateUsersRoute = `${urlApi}/users`;
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [formDataAdd, setFormDataAdd] = useState<Partial<User>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const bearer = 'Bearer ';

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Invalid credentials');
    }
    await fetch(usersRoute, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: bearer + token,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Invalid credentials');
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found.');
      }

      if (!user) {
        throw new Error('User not found');
      }

      const requestBody = {
        permission: formData.permission,
        email: formData.email,
      };

      if (requestBody.permission !== "admin" && requestBody.permission !== "applicants") {
        throw new Error('Permission type not allowed!');
      }

      const response = await fetch(`${updateUsersRoute}/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });


      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      if (response.status === 202) {
        setSuccessMessage('Utilisateur mis à jour!');
      } else {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setSuccessMessage('Utilisateur mis à jour!');
      }
      setRefresh(!refresh);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const response = await fetch(`${updateUsersRoute}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setShowModal(false);
      setRefresh(!refresh);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found.');
      }

      if (user) {
        throw new Error('User already exist.');
      }

      const requestBody = {
        permission: formDataAdd.permission,
        email: formDataAdd.email,
        people_id: formDataAdd.people_id,
        password: formDataAdd.password,
      };

      if (requestBody.permission !== "admin" && requestBody.permission !== "applicants") {
        throw new Error('Permission type not allowed!');
      }

      const response = await fetch(`${usersRoute}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });


      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      if (response.status === 202) {
        setSuccessMessage('Utilisateur mis à jour!');
      }

      setRefresh(!refresh);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleChangeAdd = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormDataAdd({
      ...formDataAdd,
      [name]: value,
    });
  };

  const renderUsersTable = () => {
    return (
      <div className="flex justify-center items-center flex-col">
        <h2 className="text-center mb-4 text-info">Users</h2>
        <div className="mb-4">
          <table className="table-auto ">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Permission</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">People ID</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className='border-t border-b border-x-dark'>
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{user.id}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{user.permission}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{user.email}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">{user.people_id}</td>
                  <td className="border-t border-b border-x-dark  px-4 py-2">
                    <div className="flex space-x-2">
                      <button className="btn" onClick={() => { setUser(user); setFormData(user); setShowModal(true); }}>modifier</button>
                      <button className="btn" onClick={() => { deleteUser(user.id) }}>supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
              {showModal &&
                <Modal onClose={() => setShowModal(false)}>
                  <div className="flex justify-center items-center min-h-screen">
                    <form onSubmit={handleSubmit} className="bg-fullwhite p-8 rounded-lg shadow-lg w-full  text-dark max-w-md">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-semibold text-dark">Edit Application</h2>
                      </div>
                      {successMessage && <p className="text-success text-center mb-4 font-medium">{successMessage}</p>}
                      {error && <p className="text-alert_info text-center mb-4 font-medium">{error}</p>}
                      <div className="mb-5">
                        <label className="block text-dark ">ID:</label>
                        <input
                          name="id"
                          value={formData.id || ''}
                          disabled
                          onChange={handleChange}
                          className="w-full  text-dark p-3 bg-alert_info  bg-opacity-5 rounded-md mt-1 "
                        />
                      </div>
                      <div className="mb-5">
                        <label className="block text-dark font-semibold">Permission:</label>
                        <input
                          type='text'
                          name="permission"
                          value={formData.permission || ''}
                          onChange={handleChange}
                          className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-5">
                        <label className="block text-dark font-semibold">Email:</label>
                        <input
                          type='email'
                          name="email"
                          value={formData.email || ''}
                          onChange={handleChange}
                          className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                        />
                      </div>
                      <div className="mb-5">
                        <label className="block text-dark">People ID:</label>
                        <input
                          disabled
                          name="people_id"
                          value={formData.people_id || ''}
                          onChange={handleChange}
                          className="w-full  text-dark bg-alert_info bg-opacity-5 p-3 rounded-md mt-1 "
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full  text-dark bg-interact  py-3 px-4 rounded-md font-semibold hover:bg-info hover:text-fullwhite transition-colors"
                      >
                        Save Changes
                      </button>
                    </form>
                  </div>
                </Modal>

              }
            </tbody>
          </table>
        </div>
        <button className="btn" onClick={() => { setShowAddModal(true); }}>Add User</button>
        {showAddModal &&
          <Modal onClose={() => setShowAddModal(false)}>
            <div className="flex justify-center items-center min-h-screen">
              <form onSubmit={handleSubmitAdd} className="bg-fullwhite p-8 rounded-lg shadow-lg w-full  text-dark max-w-md">
                <h2 className="flex justify-between items-center mb-6">Add User</h2>
                {successMessage && <p className="text-success text-center mb-4 font-medium">{successMessage}</p>}
                {error && <p className="text-alert_info text-center mb-4 font-medium">{error}</p>}
                <div className="mb-4">
                  <label className="block text-gray-700">Permission:</label>
                  <input
                    type='text'
                    disabled
                    name="permission"
                    value={formDataAdd.permission = "applicants"}
                    onChange={handleChangeAdd}
                    className="w-full  text-dark bg-alert_info bg-opacity-5 p-3 rounded-md mt-1"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-dark font-semibold">Email:</label>
                  <input
                    type='email'
                    name="email"
                    value={formDataAdd.email || ''}
                    onChange={handleChangeAdd}
                    className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-dark font-semibold">Password:</label>
                  <input
                    type='password'
                    name="password"
                    value={formDataAdd.password || ''}
                    onChange={handleChangeAdd}
                    className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">People ID:</label>
                  <input
                    type='number'
                    name="people_id"
                    value={formDataAdd.people_id || ''}
                    onChange={handleChangeAdd}
                    className="w-full  text-dark p-3 border border-ligth rounded-md mt-1 focus:outline-none focus:ring-2 focus:ring-interact"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full  text-dark bg-interact  py-3 px-4 rounded-md font-semibold hover:bg-info hover:text-fullwhite transition-colors"
                >
                  Add User
                </button>
              </form>
            </div>
          </Modal>
        }
      </div>
    );
  };

  return (
    <>
      {error && <div className="error">{error}</div>}
      {renderUsersTable()}
    </>
  );
};

export default UsersComponents;
