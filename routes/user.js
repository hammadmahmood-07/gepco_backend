const express = require("express");
const connection = require("../config/connection");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var auth = require("../services/authentication");

router.use(express.json());




// router.post('/login', async (req, res) => {
    
//     const { username, password } = req.body;

//     try {
//         // Query to find the user by username
//         const query = `
//             SELECT u.id, u.first_name, u.last_name, u.username, u.password, u.user_type_id
//             FROM users u 
//             WHERE u.username = $1
//         `;
//         const result = await connection.query(query, [username]);

//         // Check if the user exists
//         if (result.rows.length === 0) {
//             return res.status(400).json({ error: 'Invalid username or password' });
//         }

//         const user = result.rows[0];

//         // Check if user_type_id is 8
//                 if (parseInt(user.user_type_id) !== 8 || parseInt(user.user_type_id) !== 1 ) {
//             //console.log(user.user_type_id);
//             return res.status(403).json({ error: 'You are not authorized to login.' });
//         }

//         // Check if the password is correct (plain text comparison)
//         if (password !== user.password) {
//             return res.status(400).json({ error: 'Invalid username or password' });
//         }

//         // Create and sign a JWT token
//         const token = jwt.sign(
//             { id: user.id, username: user.username },
//             process.env.ACCESS_TOKEN,
//             { expiresIn: '8h' }
//         );

//         // Send the token and user info as the response
//         res.json({
//             token,
//             user: {
//                 id: user.id,
//                 first_name: user.first_name,
//                 last_name: user.last_name,
//                 username: user.username,
//             },
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = `
            SELECT u.id, u.first_name, u.last_name, u.username, u.password, u.user_type_id
            FROM users u 
            WHERE u.username = $1
        `;
        const result = await connection.query(query, [username]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const user = result.rows[0];

        // Allow only user_type_id 1 or 8
        if (parseInt(user.user_type_id) !== 8 && parseInt(user.user_type_id) !== 1) {
            return res.status(403).json({ error: 'You are not authorized to login.' });
        }

        // Compare passwords (consider using bcrypt in production)
        if (password !== user.password) {
            return res.status(400).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.ACCESS_TOKEN,
            { expiresIn: '8h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                username: user.username,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});










module.exports = router;