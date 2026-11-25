import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before saving it
        const passwordHash = await bcrypt.hash(password, 10);

        // Save the new user in the database
        const userId = await createUser(name, email, passwordHash);

        console.log('Registered user ID:', userId);
        res.redirect('/login');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Registration failed. Please try again.');
    }
};

export { showUserRegistrationForm, processUserRegistrationForm };