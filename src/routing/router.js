let router = require('express').Router();

let verifyToken = require('./middleware/verifyToken.js');
let appendMetaData = require('./middleware/appendMetaData.js');

router.use('/auth', require('./router.auth.js'));
router.use('/api/books', verifyToken, require('./router.books.js'), appendMetaData);
router.use('/api/users', verifyToken, require('./router.users.js'), appendMetaData);
router.use('/api/readings', verifyToken, require('./router.readings.js'), appendMetaData);
router.use('/api/sessions', verifyToken, require('./router.sessions.js'), appendMetaData);

module.exports = router;