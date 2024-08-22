import React, { useEffect, useState } from 'react';
import getUserDetails from '../api/getUserDetails'  // Adjust this based on your API or data fetching mechanism

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch user details from your API or data source
        const fetchUsers = async () => {
            try {
                const response = await getUserDetails(); // Example function to fetch user details
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data.users); // Assuming data.users contains an array of user objects
                } else {
                    console.error('Failed to fetch users:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching users:', error.message || 'Unknown error');
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-4xl w-full p-8 bg-gray-100 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Admin Dashboard</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-gray-200 px-4 py-2">Name</th>
                                <th className="border border-gray-200 px-4 py-2">Email</th>
                                <th className="border border-gray-200 px-4 py-2">Phone</th>
                                <th className="border border-gray-200 px-4 py-2">Address</th>
                                <th className="border border-gray-200 px-4 py-2">Age</th>
                                <th className="border border-gray-200 px-4 py-2">Department</th>
                                <th className="border border-gray-200 px-4 py-2">Designation</th>
                                <th className="border border-gray-200 px-4 py-2">Place of Work</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id}>
                                    <td className="border border-gray-200 px-4 py-2">{user.name}</td>
                                    <td className="border border-gray-200 px-4 py-2">{user.email}</td>
                                    <td className="border border-gray-200 px-4 py-2">{user.phone}</td>
                                    <td className="border border-gray-200 px-4 py-2">{user.address}</td>
                                    <td className="border border-gray-200 px-4 py-2">{user.age}</td>
                                    <td className="border border-gray-200 px-4 py-2">{user.department}</td>
                                    <td className="border border-gray-200 px-4 py-2">{user.designation}</td>
                                    <td className="border border-gray-200 px-4 py-2">{user.placeOfWork}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
