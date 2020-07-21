let router = require('express').Router();

const { Session } = require('../database/sequelize.connection.js');

router.get('/', async (req, res, next) => {
    try {
        // Retrieve books from database
        let sessions = await Session.findAll();
        
        res.body = { data: sessions };
        next();
    } catch(error) {
        res.status(500).send('oops something went wrong')
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        // Retrieve single book from database
        const session = await Session.findOne({ where: { id: req.params.id } });

        if (session) {
            res.body = { data: session };
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
        const newSession = await Session.create(req.body);

        res.send(newSession);
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
        const updatedSession = await Session.update(req.body, { where: { id: req.params.id } });

        res.send(updatedSession);
    } catch(error) {
        res.status(500).send(error)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        // Create a new book in the database
        const deleted = await Session.destroy({ where: { id: req.params.id } });
        res.sendStatus(204);
    } catch(error) {
        res.status(500).send(error)
    }
});

module.exports = router;