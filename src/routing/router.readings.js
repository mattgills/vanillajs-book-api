let router = require('express').Router();

const { sequelize, Book, Reading, Session } = require('../database/sequelize.connection.js');

router.get('/', async (req, res, next) => {
    try {
        // Retrieve books from database
        let readings = await Reading.findAll();
        
        res.locals.body = { data: readings };
        next();
    } catch(error) {
        res.status(500).send('oops something went wrong')
    }
});

router.get('/books', async (req, res, next) => {
    try {
        // const readings = await Reading.findAll({
        //     attributes: [
        //         //    Sequelize.fn('DISTINCT', Sequelize.col('bookId'))
        //     ],
        //     include: Book
        // });

        // const books = readings.map(reading => reading.book);

        const result = await sequelize.query('SELECT DISTINCT ON ("reading"."bookId") book.id, book.title, book.authors, book.isbn, book.isbn13, book.publisher, book.edition, book.length, book.media FROM "reading" "reading" INNER JOIN "book" "book" ON "book"."id"="reading"."bookId"')

        const books = result[0];

        books.forEach(book => {
            book.authors = convertAuthorsStringToArray(book.authors);
        });

        res.locals.body = { data: books };
        next();
    } catch(error) {
        console.error(error)
        res.status(500).send(error)
    }
});

router.get('/:id([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12})', async (req, res, next) => {
    try {
        // Retrieve single book from database
        const reading = await Reading.findOne({ where: { id: req.params.id } });

        if (reading) {
            res.locals.body = { data: reading };
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
        const newReading = await Reading.create(req.body);

        res.status(201).send(newReading);
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
        const updatedReading = await Reading.update(req.body, { where: { id: req.params.id } });

        res.send(updatedReading);
    } catch(error) {
        res.status(500).send(error)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        // Create a new book in the database
        const deleted = await Reading.destroy({ where: { id: req.params.id } });
        res.sendStatus(204);
    } catch(error) {
        res.status(500).send(error)
    }
});


router.get('/:id/sessions', async (req, res, next) => {
    try {
        // Retrieve single book from database
        const sessions = await Session.findAll({ where: { readingId: req.params.id } });

        res.locals.body = { data: sessions };
        next();
    } catch(error) {
        res.status(500).send(error)
    }
});

function convertAuthorsStringToArray(authors) {
    return authors.split(',');
}

module.exports = router;