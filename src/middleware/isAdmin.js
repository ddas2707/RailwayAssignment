// middleware/isAdmin.js
import User from '../models/User';

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId); // Assuming userId is available in request
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default isAdmin;
