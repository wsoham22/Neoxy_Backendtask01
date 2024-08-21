const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./usermodel");
const crypto = require('crypto');
const mail = require("./../../utils/mail")
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Directly execute the query without using APIFeatures

        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
exports.createUser = async (req, res) => {
    try {
        const { name, email, password,confirmpassword,role,image} = req.body;
        if (!name || !email || !password || !confirmpassword || !role) {
            return res.status(400).json({ error: 'Make sure you are filling all details' });
        }
        if(confirmpassword !== password){
            return res.status(500).json({error: 'Passwords doesnt match'});
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({ name, email, password: hashedPassword,role,image});

        // Save the user to the database
        await user.save();

        // Return a success response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Enter details first' });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate and send a JWT token for authentication
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log(token);
        console.log("User logged!");
        res.status(200).json({ message: `Logged in as ${user.role}`, token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.updateUserById = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await User.findByIdAndUpdate(req.params.id, { name, email, password: hashedPassword });
        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.partialUpdateUserById = async (req, res) => {
    try {
        const updates = req.body;
        const allowedUpdates = ['name', 'email', 'password'];
        const isValidOperation = updates && Object.keys(updates).every(update => allowedUpdates.includes(update));
        
        if (!isValidOperation) {
            return res.status(400).json({ error: 'Invalid updates' });
        }

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user exists with the provided email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a password reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 300000; 
        await user.save();
        console.log(resetToken);
        // Send password reset email with the token
        await mail.sendPasswordResetEmail(email, resetToken);

        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Find user by reset token and check if it's not expired
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
        }

        // Set new password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Send password reset confirmation email
        await mail.sendPasswordResetConfirmation(user.email);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
