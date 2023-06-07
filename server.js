const express = require("express")
const path = require("path")
const slug = require("slug")
const multer = require("multer")

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
const app = express()
const PORT = 3000
const mongoose = require("mongoose")

// IEMAND MOET HIER FF CONNECTEN MET DE DB MET MONGOOSE (ZET WW IN DE ENV EN DEEL DIE IN TEAMS)
// const { MONGO_URI } = require("/Users/jopmolenaar/Documents/Blok4-Tech-Feature-Jop/.env")
// const client = new MongoClient(MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// client.connect()

const { engine } = require("express-handlebars")
const ObjectId = require("mongodb").ObjectId

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./views")

// __dirname is something out of typescript
app.use(express.static(path.join(__dirname, "/static")))
app.use(express.urlencoded({ extended: true }))

app.get("/login", async (req, res) => {
    res.render("login")
})

app.get("/signup", async (req, res) => {
    res.render("signUp")
})

app.get("*", (req, res) => {
    res.status(404).render("notfound")
})

app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`)
})
