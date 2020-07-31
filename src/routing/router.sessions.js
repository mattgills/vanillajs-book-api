let router = require('express').Router();

const { Session } = require('../database/sequelize.connection.js');

router.get('/', async (req, res, next) => {
    try {
        // Set size and page based on query filter
        let size = req.query.size ? req.query.size : 10;
        let pageNumber = req.query.page ? req.query.page: 1;

        // Retrieve sessions from database
        let sessions = await Session.findAll({
            limit: size,
            offset: Math.floor(size * (pageNumber - 1)),
        });

        // Retrieve count of sessions from database
        const count = await Session.count();
        
        res.locals.body = {
            data: sessions,
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
        const session = await Session.findOne({ where: { id: req.params.id } });

        if (session) {
            res.locals.body = { data: session };
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
        const newSession = await Session.create(req.body);

        res.locals.body = { data: newSession };
        
        next();
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
        await Session.destroy({ where: { id: req.params.id } });
        res.sendStatus(204);
    } catch(error) {
        res.status(500).send(error)
    }
});

module.exports = router;