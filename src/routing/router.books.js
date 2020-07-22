let router = require('express').Router();

const { Book, Reading } = require('../database/sequelize.connection.js');

router.get('/', async (req, res, next) => {
    try {
        // Retrieve books from database
        const books = await Book.findAll();
        
        // Convert authors string to array of authors
        books.forEach(book => {
            book.authors = convertAuthorsStringToArray(book.authors);
        });
        
        res.body = { data: books };
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
            book.authors = convertAuthorsStringToArray(book.authors);

            res.body = { data: book };
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

        // Convert book authors array to string
        req.body.authors = convertAuthorsArrayToString(req.body.authors);

        // Create a new book in the database
        const newBook = await Book.create(req.body);

        res.status(201).send(newBook);
    } catch(error) {
        res.status(500).send(error)
    }
});

router.put('/:id', async (req, res) => {
    try {
        // Remove user set id if it exists
        if (req.body.id) delete req.body.id;

        // Convert book authors array to string
        req.body.authors = convertAuthorsArrayToString(req.body.authors);

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
        const deleted = await Book.destroy({ where: { id: req.params.id } });
        res.sendStatus(204);
    } catch(error) {
        res.status(500).send(error)
    }
});

router.get('/:id/readings', async (req, res, next) => {
    try {
        // Retrieve single book from database
        const readings = await Reading.findAll({ where: { bookId: req.params.id } });

        res.body = { data: readings };
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
}

function convertAuthorsStringToArray(authors) {
    return authors.split(',');
}

module.exports = router;