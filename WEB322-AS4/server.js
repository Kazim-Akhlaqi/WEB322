/************************************************************************************************
 *  WEB322 – Assignment 03 
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 *  No part * of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *  Name: Kazim Akhlaqi     Student ID: 103638177    Date: 13 October 2018
 *  Online (Heroku) Link:  https://radiant-castle-92587.herokuapp.com/
 ***********************************************************************************************/

const express = require("express");
const app = express();
const dataService = require("./data-service.js")
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const HTTP_PORT = process.env.PORT || 8080;
////////////////////////////////////////
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
////////////////////////////////////////
app.use(express.static('public'));
////////////////////////////////////////
app.use(bodyParser.urlencoded({
    extended: true
}));
////////////////////////////////////////
app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
////////////////////////////////////////
app.set('view engine', '.hbs');
////////////////////////////////////////
app.use(function (req, res, next) {
    let route = req.baseUrl + req.path;
    app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
    next();
});
////////////////////////////////////////
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {

        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});
////////////////////////////////////////
app.get("/", function (req, res) {
    res.render("home");
});
////////////////////////////////////////
app.get("/home", function (req, res) {
    res.render("home");
});
////////////////////////////////////////
app.get("/about", function (req, res) {
    res.render("about");
});
////////////////////////////////////////
app.get("/employees/add", function (req, res) {
    res.render("addEmployee");
});
////////////////////////////////////////
app.get("/images/add", function (req, res) {
    res.render("addImage");
});
////////////////////////////////////////
app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", function (err, data) {
        res.render('images', {
            images: data
        });
    });
});
////////////////////////////////////////
app.get("/departments", function (req, res) {
    dataService.getDepartments().then((data) => {
        res.render("departments", {
            departments: data
        });
    }).catch(() => {
        res.render("departments", {
            message: "no results"
        });
    });
});
////////////////////////////////////////
app.get('/employee/:employeeNum', (req, res) => {

    dataService.getEmployeeByNum(req.params.employeeNum)
        .then((data) => {
            res.render("employee", {
                employee: data
            });
        }).catch(() => {
            res.render("employee", {
                message: "no results"
            });
        });
});
////////////////////////////////////////
app.get("/employees", function (req, res) {
    if (req.query.status) {
        dataService.getEmployeesByStatus(req.query.status).then((data) => {
            res.render("employees", {
                Employees: data
            });
        }).catch(() => {
            res.render("employees", {
                message: "no results"
            });
        })

    } else if (req.query.department) {

        if (parseInt(req.query.department)) {
            dataService.getEmployeesByDepartment(req.query.department).then((data) => {
                    res.render("employees", {
                        Employees: data
                    });
                })
                .catch(() => {
                    res.render("employees", {
                        message: "no results"
                    });
                })
        } else {
            var dept;
            dataService.getDepartments().then((data) => {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].departmentName == req.query.department) {
                        dept = data[i];
                        dataService.getEmployeesByDepartment(dept.departmentId).then((data) => {
                                res.render("employees", {
                                    Employees: data
                                });
                            })
                            .catch(() => {
                                res.render("employees", {
                                    message: "no results"
                                });
                            });
                        break;
                    }
                }
            }).catch(() => {
                res.render("departments", {
                    message: "no results"
                });
            })
        }
    } else if (req.query.manager) {
        dataService.getEmployeesByManager(req.query.manager).then((data) => {
            res.render("employees", {
                Employees: data
            });
        }).catch(() => {
            res.render("employees", {
                message: "no results"
            });
        })
    } else {
        dataService.getAllEmployees().then((data) => {
            res.render("employees", {
                Employees: data
            });
        }).catch(() => {
            res.render("employees", {
                message: "no results"
            });
        })
    }
});

////////////////////////////////////////
app.get("/images", (req, res) => {
    fs.readdir("./public/images/uploaded", function (err, imageFile) {
        res.json(imageFile);
    });
});
////////////////////////////////////////

app.post("/departments", (req, res) => {
    dataService.getDepartments().then((data) => {
        res.render("employees", {
            Employees: data
        });
    }).catch(() => {
        res.render("employees", {
            message: "no results"
        });
    })
});


////////////////////////////////////////
app.post("/employees/add", (req, res) => {
    dataService.addEmployee(req.body)
        .then(res.redirect("/employees")).catch(() => {
            res.render("employees", {
                message: "no results"
            });
        });
});
////////////////////////////////////////
app.post("/employee/update", (req, res) => {
    dataService.updateEmployee(req.body)
        .then(() => {
            res.redirect("/employees");
        })
        .catch(() => {
            res.render("employees", {
                message: "Unable to Update Employee"
            });
        });
});

////////////////////////////////////////
app.post("/images/add", upload.single(("imageFile")), (req, res) => {
    res.redirect("/images");
});
////////////////////////////////////////
app.use((req, res) => {
    res.status(404).send("Page Not Found!");
});
////////////////////////////////////////
dataService.initialize().then(() => {
    app.listen(HTTP_PORT, onHttpStart);
}).catch((err) => {
    console.log("unable to start the server: " + err.message);
});
