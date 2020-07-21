const { Sequelize, DataTypes } = require('sequelize');

module.exports = {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    authors: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isbn: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isbn13: {
        type: DataTypes.STRING,
        allowNull: true
    },
    publisher: {
        type: DataTypes.STRING,
        allowNull: true
    },
    edition: {
        type: DataTypes.STRING,
        allowNull: true
    },
    length: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    media: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['print', 'ebook', 'audio'],
        defaultValue: 'print'
    }
}