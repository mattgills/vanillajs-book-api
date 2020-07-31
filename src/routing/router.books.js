let router = require('express').Router();

const { Book, Reading } = require('../database/sequelize.connection.js');

router.get('/', async (req, res, next) => {
    try {
        // Set size and page based on query filter
        let size = req.query.size ? req.query.size : 10;
        let pageNumber = req.query.page ? req.query.page: 1;

        // Retrieve books from database
        const books = await Book.findAll({
            limit: size,
            offset: Math.floor(size * (pageNumber - 1))
        });
        
        // Retrieve count of books from database
        const count = await Book.count();
        
        // Convert authors string to array of authors
        books.forEach(book => {
            book.convertAuthorsStringToArray();
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
        res.status(500).send(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        // Retrieve single book from database
        const book = await Book.findOne({ where: { id: req.params.id } });

        if (book) {
            // Convert book authors string to array of authors
            book.convertAuthorsStringToArray();

            res.locals.body = { data: book };
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
        const newBook = await Book.create(req.body);

        // Convert book authors string to array of authors
        newBook.convertAuthorsStringToArray();

        res.locals.body = { data: newBook };
        
        next();
    } catch(error) {
        console.error(error)
        res.status(500).send(error)
    }
});

router.put('/:id', async (req, res) => {
    try {
        // Remove user set id if it exists
        if (req.body.id) delete req.body.id;

        // Create a new book in the database
        const updatedBook = await Book.update(req.body, { where: { id: req.params.id } });

        res.send(updatedBook);
    } catch(error) {
        res.status(500).send(error)
    }
});

router.delete('/:id', async (req, res) => {
    try {
        // Create a new book in the database
        await Book.destroy({ where: { id: req.params.id } });
        res.sendStatus(204);
    } catch(error) {
        res.status(500).send(error)
    }
});

router.get('/:id/readings', async (req, res, next) => {
    try {
        // Set size and page based on query filter
        let size = req.query.size ? req.query.size : 10;
        let pageNumber = req.query.page ? req.query.page: 1;

        // Retrieve single book from database
        const readings = await Reading.findAll({
            limit: size,
            offset: Math.floor(size * (pageNumber - 1)),
            where: {
                bookId: req.params.id
            }
        });

        // Retrieve count of readings from database
        const count = await Reading.count({
            where: {
                bookId: req.params.id
            }
        });

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
        res.status(500).send(error)
    }
});

function convertAuthorsArrayToString(authors) {
    if (Array.isArray(authors)) {
        return authors.join(',');
    }
    throw new Error('Authors must be in the format of an array.');
};

module.exports = router;