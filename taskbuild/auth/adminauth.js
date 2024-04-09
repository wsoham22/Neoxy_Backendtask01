// adminAuthController.js
const jwt = require("jsonwebtoken");

const adminAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Authorization token is required' });
    }
// console.log(token);
const tokenarr = token.split(' ');
const decodedtoken = tokenarr[1];
console.log(decodedtoken);
    try {
        const decoded = jwt.verify(decodedtoken, process.env.JWT_SECRET);
        console.log(decoded);
        console.log(decoded.role);
        if (decoded.role !== 'superadmin') {
            return res.status(403).json({ error: 'Unauthorized: You need superadmin privileges' });
        }
        // If the user is a superadmin, proceed to the next middleware or route handler
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
module.exports = { adminAuthMiddleware };
