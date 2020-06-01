const Sequelize = require("sequelize");
const Category = require("../categories/Category")
const connection = require("../database/database");

const Article = connection.define("article",{
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article); //"tem muitos"
Article.belongsTo(Category); //"pertence a: "

//Article.sync({force: true});

module.exports = Article;