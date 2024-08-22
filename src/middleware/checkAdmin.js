// middleware/checkAdmin.js
import User from '../models/User';

export default async function checkAdmin(req, res, next) {
    const user = await User.findById(req.userId); // Assuming req.userId contains the logged-in user ID
    if (user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
}
