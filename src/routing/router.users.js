let router = require('express').Router();

const { User } = require('../database/sequelize.connection.js');

router.get('/', async (req, res, next) => {
    try {
        // Set size and page based on query filter
        let size = req.query.size ? req.query.size : 10;
        let pageNumber = req.query.page ? req.query.page: 1;

        // Retrieve users from database
        let users = await User.findAll({
            limit: size,
            offset: Math.floor(size * (pageNumber - 1)),
        });

        // Remove password from users
        users.forEach(user => {
            user.password = undefined;
        });

        // Retrieve count of users from database
        const count = await User.count();

        res.locals.body = {
            data: users,
            page: {
                size,
                totalElements: count,
                totalPages: Math.ceil(count / size),
                number: pageNumber
            }
        };
        next();
    } catch(error) {
        res.status(500).send('oops something went wrong')
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        // Retrieve single book from database
        const user = await User.findOne({ where: { id: req.params.id } });

        if (user) {
            // Remove user password
            user.password = undefined;

            res.locals.body = { data: user };
            next();
        } else {
            res.status(404).send();
        }
    } catch(error) {
        res.status(500).send(error)
    }
});

router.post('/', async (req, res, next) => {
    try {
        // Remove user set id if it exists
        if (req.body.id) delete req.body.id;

        // Create a new book in the database
        const newUser = await User.create(req.body);

        // Remove the password
        newUser.password = undefined;

        res.locals.body = { data: newUser };
        
        next();
    } catch(error) {
        console.log(error)
        res.status(500).send(error)
    }
});

// router.put('/:id', async (req, res) => {
//     try {
//         // Remove user set id if it exists
//         if (req.body.id) delete req.body.id;

//         // Create a new book in the database
//         const updatedReading = await User.update(req.body, { where: { id: req.params.id } });

//         res.send(updatedReading);
//     } catch(error) {
//         res.status(500).send(error)
//     }
// });

router.delete('/:id', async (req, res) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.sendStatus(204);
    } catch(error) {
        res.status(500).send(error)
    }
});

module.exports = router;