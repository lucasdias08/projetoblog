const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session")

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require("./users/User");

const connection = require("./database/database");

connection.authenticate().then(() => { 
    console.log("Conectado ao MySql");
}).catch((erro) => {
    console.log("Erro ao se conectar com o MySql:");
    console.log(erro)
})

//template engine
app.set("view engine", "ejs");

//configurar uso de sessions e cookie com tempo em milsegundos
app.use(session({
    secret: "qualquercoisa", cookie: { maxAge: 300000 } 
}));

//config para o body-parser trabalhar com formulários e json's
app.use(bodyParser.urlencoded({extended: "false"}));
app.use(bodyParser.json());

//caminho para os arquivos estáticos
app.use(express.static("public"));

//Configura o express para utilizar o controller e, consequentemente, as rotas
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);


app.get("/", (req, res) => {
    
    Article.findAll({
        order:[
            ["id", "DESC"]
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});    
        })
    })
    
});

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if(article != undefined){    
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            })
        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
});

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){

            Category.findAll().then(categories => {
                res.render("article", {articles: category.articles, categories: categories});
            })

        } else {
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
});

app.listen(8080, () => {
    console.log("Servidor rodando na porta 8080");
});