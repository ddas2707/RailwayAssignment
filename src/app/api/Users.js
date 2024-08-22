// src/app/api/users.js

// Mock data for demonstration
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
];

export default function handler(req, res) {
    if (req.method === 'GET') {
        res.status(200).json(users);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
