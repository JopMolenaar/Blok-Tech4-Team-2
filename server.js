const express = require("express")
const path = require("path")
const slug = require("slug")
const multer = require("multer")
const bcrypt = require("bcryptjs")
const session = require("express-session")
const dotenv = require("dotenv").config()
const app = express()
const PORT = 3000
const mongoose = require("mongoose")
const { engine } = require("express-handlebars")
const ObjectId = require("mongodb").ObjectId
app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./views")
app.use(express.static("static"))
app.use(express.urlencoded({ extended: true }))

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

// The User schema defined
const userSchema = new mongoose.Schema({
    naam: String,
    email: String,
    leeftijd: Number,
    gebruikersnaam: String,
    wachtwoord: String,
})

// Create the User model
const User = mongoose.model("User", userSchema)

// Configure session
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 15 * 60 * 1000, // Set the expiration time to 15 minutes in milliseconds
        },
    })
)

mongoose
    .connect(process.env.DB_CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })

    .then(() => {
        console.log("Verbonden met de database")
    })

app.get("/login", async (req, res) => {
    const errorMessage = req.session.error
    req.session.error = "" // Clear the error message from the session
    const gebruikersnaam = req.session.loggedIn ? req.session.gebruikersnaam : "" // Get the username from the session
    res.render("login", { error: errorMessage, gebruikersnaam: gebruikersnaam })
})

app.get("/signUp", async (req, res) => {
    // Check if the user is already logged in
    if (req.session.loggedIn) {
        res.redirect("/products")
    } else {
        res.render("signUp")
    }
})

app.post("/login", (req, res) => {
    const { gebruikersnaam, wachtwoord } = req.body

    // Find the user in the database with the provided username
    User.findOne({ gebruikersnaam: gebruikersnaam })
        .then((user) => {
            if (user) {
                // if user found compare the provided password with the hashed password
                bcrypt.compare(wachtwoord, user.wachtwoord, (error, result) => {
                    if (result) {
                        // Password matches, set loggedIn session variable to true
                        req.session.loggedIn = true
                        req.session.gebruikersnaam = gebruikersnaam
                        req.session.save(() => {
                            res.redirect("/products")
                        })
                    } else {
                        // Password does not match
                        req.session.error = "Gebruikersnaam of wachtwoord ongeldig"
                        res.redirect("/login")
                    }
                })
            } else {
                // User not found
                req.session.error = "Gebruikersnaam of wachtwoord ongeldig"
                res.redirect("/login")
            }
        })
        .catch((error) => {
            console.error("Error gebruiker niet gevonden:", error)
            req.session.error = "Inloggen onsuccesvol"
            res.redirect("/login")
        })
})

app.post("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/")
})

// Signup as a new user
app.post("/signUp", (req, res) => {
    const { gebruikersnaam, wachtwoord, wachtwoordBevestigen, naam, email, leeftijd } = req.body
    console.log(gebruikersnaam)
    console.log("post request werkt")
    // Check if username is filled in
    if (!gebruikersnaam) {
        req.session.error = "Vul een gebruikersnaam in"
        res.redirect("/signup") // Redirect to the signup page
        return
    }

    // Check if password and confirm password match
    if (wachtwoord !== wachtwoordBevestigen) {
        req.session.error = "Wachtwoorden komen niet overeen"
        res.render("signUp", { error: req.session.error }) // Render the signup page with the error message
        return
    }

    // Create a new user object with the filled-in information
    const newUser = new User({
        naam: naam,
        email: email,
        leeftijd: leeftijd,
        gebruikersnaam: gebruikersnaam,
        // wachtwoord: hashedPassword,
    })

    // Save the new user to the database
    newUser
        .save()
        .then(() => {
            console.log("new user")
            req.session.loggedIn = true
            req.session.gebruikersnaam = gebruikersnaam
            req.session.save(() => {
                res.redirect("/products")
            })
        })
        .catch((error) => {
            console.error("Error gebruiker aanmaken:", error)
            if (error.code === 11000) {
                // Duplicate key error
                req.session.error = "Email al in gebruik"
            } else {
                req.session.error = "Gebruiker niet kunnen registreren"
            }
            res.render("signUp", { error: req.session.error }) // Render the signup page with the error message
        })

    // Hash the password
    // bcrypt.hash(wachtwoord, 10, (err, hashedPassword) => {
    //     console.log("bycrypt")
    //     if (err) {
    //         console.error("Error hashing password:", err)
    //         req.session.error = "Gebruiker niet kunnen registreren"
    //         res.redirect("/signUp") // Redirect to the signup page
    //         return
    //     }
    // })
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

// voorkeuren pagina
app.get("/voorkeuren", (req, res) => {
    res.render("voorkeuren", { error: "" })
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
