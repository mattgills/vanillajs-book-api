const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get the auth header value
    const bearerHeader = req.headers.authorization;
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Remove the text "Bearer " from the header
        const token = bearerHeader.split(' ')[1];
        // Verify the token
        jwt.verify(token, 'replacewithenvvariable', (err, authData) => {
            if (err) {
                res.status(401).send({
                    name: 'Unauthorized',
                    message: 'Token expired or invalid.'
                });
            } else {
                res.locals.userId = authData.id;
                next();
            }
        })
    } else {
        res.status(401).send({
            name: 'Unauthorized',
            message: 'Authorization header was not set.'
        });
    }
}