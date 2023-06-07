const express = require("express")
const path = require("path")
const slug = require("slug")
const multer = require("multer")
const app = express()
const PORT = 3000
const mongoose = require("mongoose")
const { engine } = require("express-handlebars")
require("dotenv").config()

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./views")
app.use(express.static("static"))
app.use(express.urlencoded({ extended: true }))

// connection with db
console.log(process.env.DB_CONNECTION_STRING)
mongoose
    .connect(process.env.DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to the database")
    })

// defines path for images, replaces file name with unique file name
const storage = multer.diskStorage({
    destination: (req, file, setPath) => {
        setPath(null, "static/upload/")
    },
    filename: (req, file, replaceFileName) => {
        console.log(file)
        replaceFileName(null, Date.now() + path.extname(file.originalname))
    },
})
const upload = multer({ storage: storage })

app.get("/login", async (req, res) => {
    res.render("login")
})

//
// normale gebruikers
//
app.get("/products", async (req, res) => {
    res.render("products")
})

//
// Admin pagina's
//
app.get("/producten-overzicht", async (req, res) => {
    res.render("admin-overzicht")
})
app.get("/producten-overzicht/toevoegen", async (req, res) => {
    res.render("admin-addProducts")
})

//
// 404
//
app.get("*", (req, res) => {
    res.status(404).render("notfound")
})

app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`)
})
