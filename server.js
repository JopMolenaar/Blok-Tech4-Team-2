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
const { ObjectId } = mongoose.Types
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
const User = mongoose.model("User", userSchema, "users")

// The User schema defined
const productShema = new mongoose.Schema({
    naam: String,
    soort: String,
    leeftijd: Number,
    img: String,
    beschrijving: String,
    eigenschappen: {
        activiteit: String,
        leefstijl: String,
        grootte: String,
        dag: String,
    },
})

// Create the User model
const Product = mongoose.model("Product", productShema, "products")

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
    try {
        // zoekt producten op
        const products = await Product.find({})
        const overeenkomende = []
        products.forEach((product) => {
            // matching logica
            overeenkomende.push(product)
        })
        res.render("products", {
            product: overeenkomende.map((product) => product.toJSON()),
        })
    } catch (error) {
        console.log(error)
    } finally {
        console.log("got all products for normal user")
    }
})

//
// Admin pagina's
//
app.get("/producten-overzicht", async (req, res) => {
    try {
        // zoekt producten op
        const products = await Product.find({})
        res.render("admin-overzicht", {
            product: products.map((product) => product.toJSON()),
        })
    } catch (error) {
        console.log(error)
    } finally {
        console.log("got all products for admin")
    }
})

const addProduct = async (req, res) => {
    try {
        const { naam, soort, leeftijd, image, beschrijving, activiteit, leefstijl, grootte, dag } = req.body
        const newProduct = new Product({
            naam: naam,
            soort: soort,
            leeftijd: leeftijd,
            img: req.file ? req.file.filename : null,
            beschrijving: beschrijving,
            eigenschappen: {
                activiteit: activiteit,
                leefstijl: leefstijl,
                grootte: grootte,
                dag: dag,
            },
        })
        newProduct.save()
        console.log("added:", newProduct)
        setTimeout(() => {
            res.redirect("/producten-overzicht")
        }, "1000")
    } catch (error) {
        console.log(error)
    } finally {
        console.log("finally")
    }
}

const changeProduct = async (req, res) => {
    try {
        const { naam, leeftijd, soort, beschrijving, id, activiteit, leefstijl, grootte, dag } = req.body
        let updateObject = {}
        if (naam) updateObject.naam = naam
        if (leeftijd) updateObject.leeftijd = leeftijd
        if (soort) updateObject.soort = soort
        if (beschrijving) updateObject.beschrijving = beschrijving
        if (activiteit) await Product.findOneAndUpdate({ _id: id }, { "eigenschappen.activiteit": activiteit })
        if (leefstijl) await Product.findOneAndUpdate({ _id: id }, { "eigenschappen.leefstijl": leefstijl })
        if (grootte) await Product.findOneAndUpdate({ _id: id }, { "eigenschappen.grootte": grootte })
        if (dag) await Product.findOneAndUpdate({ _id: id }, { "eigenschappen.dag": dag })
        if (req.file) updateObject.img = req.file.filename
        await Product.findOneAndUpdate({ _id: id }, updateObject).then(() => console.log("Object updated successfully."))
        setTimeout(() => {
            res.redirect("/producten-overzicht")
        }, 1000)
    } catch (error) {
        console.log(error)
    } finally {
        console.log("finally")
    }
}

// forms post requests: add en change
app.post("/producten-overzicht/add", upload.single("image"), addProduct)
app.post("/producten-overzicht/change", upload.single("image"), changeProduct)

// pas producten aan als admin
app.get("/producten-overzicht/aanpassen/:id", async (req, res) => {
    try {
        // zoekt producten op id
        const products = await Product.findById(req.params.id)
        const getItToJson = []
        getItToJson.push(products)
        res.render("admin-aanpassen", {
            product: getItToJson.map((product) => product.toJSON()),
        })
    } catch (error) {
        console.log(error)
    } finally {
        console.log("got product for admin")
    }
})

// product detail pagina
app.get("/producten-overzicht/detail/:id", async (req, res) => {
    try {
        // zoekt producten op id
        const products = await Product.findById(req.params.id)
        const getItToJson = []
        getItToJson.push(products)
        res.render("product-detail", {
            product: getItToJson.map((product) => product.toJSON()),
        })
    } catch (error) {
        console.log(error)
    } finally {
        console.log("got product detail for user")
    }
})

// add producten
app.get("/producten-overzicht/toevoegen", async (req, res) => {
    res.render("admin-addProducts")
})

//
// 404
//
app.get("*", (req, res) => {
    res.status(404).render("notfound")
})

//
// PORT
//
app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`)
})
