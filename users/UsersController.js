const express = require("express");
const router = express.Router();
const User = require("./User");

const adminAuth = require("../midlewares/adminAuth");
const bcrypt = require("bcryptjs");

router.get("/admin/users", adminAuth, (req, res) => {
    User.findAll().then(users => {
        res.render("admin/users", {users: users});
    }).catch(err => {
        res.json(err);
    }) 
});

router.get("/admin/users/create", adminAuth, (req, res) => {
    res.render("admin/users/create");
});

router.get("/login", (req, res) => {
    res.render("admin/users/login");
});

router.get("/logout", (req, res) => {
    req.session.user = undefined;
    res.redirect("/");
})

router.post("/authenticate", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where:{
            email: email
        }
    }).then(user => {
        if(user != undefined){
            // validar senha
            var correct = bcrypt.compareSync(password, user.password);

            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles");
            } else {

            }

        } else {

        }
    })

})

router.post("/users/create", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where:{
            email: email
        }
    }). then(user => {
        if(user == undefined){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt);

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect("/");
            }).catch(erro => {
                res.redirect("/")
            });
        } else {
            res.redirect("/admin/users/create");
        }
    })


    

})

module.exports = router;