let router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../database/sequelize.connection.js');

router.post('/login', async (req, res) => {
    if (req.body.email && req.body.password) {
        const user = await User.findOne({ where: { email: req.body.email } });

        if (user) {
            bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
                if (err) {
                    console.error('Login Error with bcrypt:', err);
                    res.status(500).send({
                        name: 'Internal Server Error',
                        message: 'Unable to login at this time, please try again later.'
                    });
                } else if (!isMatch) {
                    res.status(401).send({
                        name: 'Unauthorized',
                        message: 'Email and/or password is incorect.'
                    });
                } else {
                    const payload = {
                        id: user.id,
                        email: user.email
                    }
                    jwt.sign(payload, 'replacewithenvvariable', { expiresIn: '1h' }, (jwtErr, token) => {
                        if (jwtErr) {
                            console.error('Login Error with JWT Generation:', err);
                            res.status(500).send({
                                name: 'Internal Server Error',
                                message: 'Unable to login at this time, please try again later.'
                            });
                        } else {
                            res.status(200).send({
                                access_token: token
                            });
                        }
                    });
                }
            });
        } else {
            res.status(401).send({
                name: 'Unauthorized',
                message: 'Email and/or password is incorect.'
            });
        }
    } else {
        res.status(400).send({
            name: 'Bad Request',
            message: 'Email and/or Password were not provided.'
        });
    }
});

module.exports = router;