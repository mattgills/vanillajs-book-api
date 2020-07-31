const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/book');

// Define Book
const Book = sequelize.define('book', require('./models/book.js'), { timestamps: false, tableName: 'book' });

Book.prototype.convertAuthorsStringToArray = function() {
    this.authors = this.authors.split(',');
}

Book.beforeValidate(convertAuthorsArrayToString);

function convertAuthorsArrayToString(book, options) {
    if (Array.isArray(book.authors)) {
        book.authors = book.authors.join(',');
    } else {
        throw new Error('Authors must be in the format of an array.');
    }
};

const User = sequelize.define('user', require('./models/user.js'), { timestamps: false, tableName: 'user' });
User.beforeCreate(encryptPasswordIfChanged);
User.beforeUpdate(encryptPasswordIfChanged);

async function encryptPasswordIfChanged(user, options) {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
}

// Define Reading
const Reading = sequelize.define('reading', require('./models/reading.js'), { timestamps: false, tableName: 'reading' });

// Define Session
const Session = sequelize.define('session', require('./models/session.js'), { timestamps: false, tableName: 'session' });

// Define Associations
Book.hasMany(Reading, { foreignKey: 'bookId' });
Reading.belongsTo(Book, { foreignKey: 'bookId' })
User.hasMany(Reading, { foreignKey: 'userId' });
Reading.hasMany(Session, { foreignKey: 'readingId' });
User.hasMany(Session, { foreignKey: 'userId' });

module.exports = {
    sequelize,
    Book,
    User,
    Reading,
    Session
};