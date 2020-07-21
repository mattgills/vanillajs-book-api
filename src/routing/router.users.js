let router = require('express').Router();

const { User } = require('../database/sequelize.connection.js');

router.get('/', async (req, res, next) => {
    try {
        // Retrieve books from database
        let users = await User.findAll();
        
        // Remove password from users
        users.forEach(user => {
            user.password = undefined;
        })

        res.body = { data: users };
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

            res.body = { data: user };
            next();
        } else {
            res.status(404).send();
        }
    } catch(error) {
        res.status(500).send(error)
    }
});

router.post('/', async (req, res) => {
    try {
        // Remove user set id if it exists
        if (req.body.id) delete req.body.id;

        // Create a new book in the database
        const newUser = await User.create(req.body);

        // Remove the password
        newUser.password = undefined;

        res.send(newUser);
    } catch(error) {
        console.log(error)
        res.status(500).send(error)
    }
});

router.put('/:id', async (req, res) => {
    try {
        // Remove user set id if it exists
        if (req.body.id) delete req.body.id;

        // Create a new book in the database
        const updatedReading = await User.update(req.body, { where: { id: req.params.id } });

        res.send(updatedReading);
    } catch(error) {
        res.status(500).send(error)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        // Create a new book in the database
        const deleted = await User.destroy({ where: { id: req.params.id } });
        res.sendStatus(204);
    } catch(error) {
        res.status(500).send(error)
    }
});

module.exports = router;