let router = require('express').Router();

const { sequelize, Book, Reading, Session } = require('../database/sequelize.connection.js');

router.get('/', async (req, res, next) => {
    try {
        // Set size and page based on query filter
        let size = req.query.size ? req.query.size : 10;
        let pageNumber = req.query.page ? req.query.page: 1;

        // Retrieve books from database
        let readings = await Reading.findAll({
            limit: size,
            offset: Math.floor(size * (pageNumber - 1))
        });

        // Retrieve count of readings from database
        const count = await Reading.count();
        
        res.locals.body = {
            data: readings,
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

router.get('/books', async (req, res, next) => {
    try {
        // const readings = await Reading.findAll({
        //     attributes: [
        //         //    Sequelize.fn('DISTINCT', Sequelize.col('bookId'))
        //     ],
        //     include: Book
        // });

        // const books = readings.map(reading => reading.book);

        // Set size and page based on query filter
        let size = req.query.size ? req.query.size : 10;
        let pageNumber = req.query.page ? req.query.page: 1;

        const result = await sequelize.query(
            `SELECT DISTINCT ON ("reading"."bookId") book.id, book.title, book.authors, book.isbn, book.isbn13, book.publisher, book.edition, book.length, book.media FROM "reading"
            "reading" INNER JOIN "book" "book" ON "book"."id"="reading"."bookId"
            LIMIT ${size} OFFSET ${Math.floor(size * (pageNumber - 1))}`);

        let books = result[0];

        let count = await sequelize.query(
            `SELECT COUNT (DISTINCT ("reading"."bookId")) FROM "reading"
            "reading" INNER JOIN "book" "book" ON "book"."id"="reading"."bookId"
            LIMIT ${size} OFFSET ${Math.floor(size * (pageNumber - 1))}`);

        count = count[0][0].count;

        books = books.map(book => {
            book = Book.build(book);
            book.convertAuthorsStringToArray();
            return book;
        });

        res.locals.body = {
            data: books,
            page: {
                size,
                totalElements: count,
                totalPages: Math.ceil(count / size),
                number: pageNumber
            }
        };
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

router.post('/', async (req, res, next) => {
    try {
        // Remove user set id if it exists
        if (req.body.id) delete req.body.id;

        // Create a new book in the database
        const newReading = await Reading.create(req.body);

        res.locals.body = { data: newReading };
        
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
        const updatedReading = await Reading.update(req.body, { where: { id: req.params.id } });

        res.send(updatedReading);
    } catch(error) {
        res.status(500).send(error)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Reading.destroy({ where: { id: req.params.id } });
        res.sendStatus(204);
    } catch(error) {
        res.status(500).send(error)
    }
});


router.get('/:id/sessions', async (req, res, next) => {
    try {
        // Set size and page based on query filter
        let size = req.query.size ? req.query.size : 10;
        let pageNumber = req.query.page ? req.query.page: 1;

        // Retrieve single book from database
        const sessions = await Session.findAll({
            limit: size,
            offset: Math.floor(size * (pageNumber - 1)),
            where: {
                readingId: req.params.id
            }
        });

        // Retrieve count of sessions from database
        const count = await Session.count({
            where: {
                readingId: req.params.id
            }
        });

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
        res.status(500).send(error)
    }
});

module.exports = router;