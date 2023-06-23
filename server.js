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
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy

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
    googleId: String,
    voorkeuren: {
        energielevel: String,
        leefstijl: String,
        grootte: String,
        slaapritme: String,
    },
    wishlist: [{ type: ObjectId, ref: "Product" }],
})

// is middleware en vuurt deze function als er een user wordt gesaved
// ARROW FUNCTION WERKT HIER NIET, DAAROM DE "function" ZOALS IN ES5
userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("wachtwoord")) {
            // Skip hashing if the password is not modified
            return next()
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.wachtwoord, salt)
        this.wachtwoord = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
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

//hoofdpagina
app.get("/", (req, res) => {
    res.render("hoofdpagina")
})

app.get("/admin-login", async (req, res) => {
    const errorMessage = req.session.error
    req.session.error = "" // Clear the error message from the session

    const naam = req.session.loggedIn ? req.session.naam : "" // Get the username from the session
    res.render("admin-login", { error: errorMessage, naam: naam })
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

const admin = new mongoose.Schema({
    naam: String,
    wachtwoord: String,
})

const Admin = mongoose.model("Admin", admin, "admins")

// Admin login
app.post("/admin-login", (req, res) => {
    const { gebruikersnaam, wachtwoord } = req.body
    Admin.findOne({ naam: gebruikersnaam })
        .then((admin) => {
            console.log(admin.naam)
            if (gebruikersnaam === admin.naam) {
                console.log("Admin login successful")
                bcrypt.compare(wachtwoord, admin.wachtwoord, (err, result) => {
                    console.log(result)
                    if (result) {
                        console.log("Password matched")
                        // Check if the provided username and password match the admin credentials
                        // Set loggedIn session variable to true for admin
                        req.session.loggedIn = true
                        req.session.adminUsername = gebruikersnaam
                        req.session.save(() => {
                            console.log("Session saved")
                            res.redirect("/producten-overzicht")
                        })
                    } else {
                        console.log("Password did not match")
                        // Password does not match
                        req.session.error = "Gebruikersnaam of wachtwoord ongeldig"
                        res.redirect("/admin-login")
                    }
                })
            } else {
                console.log("Admin login failed")
                // Admin login failed
                req.session.error = "Gebruikersnaam of wachtwoord ongeldig"
                res.redirect("/admin-login")
            }
        })
        .catch((error) => {
            console.error("Error admin niet gevonden:", error)
            req.session.error = "Inloggen onsuccesvol"
            res.redirect("/login")
        })
})
app.post("/admin-logout", (req, res) => {
    req.session.destroy()
    res.redirect("/admin-login")
})

// Regular user login
app.post("/login", (req, res) => {
    const { gebruikersnaam, wachtwoord } = req.body

    console.log("Login username:", gebruikersnaam)

    // Find the user in the database with the provided username
    User.findOne({ gebruikersnaam: gebruikersnaam })
        .then((user) => {
            if (user) {
                console.log("User found:", user)

                // Compare the provided password with the stored password
                bcrypt.compare(wachtwoord, user.wachtwoord, (err, result) => {
                    console.log(result)
                    if (result) {
                        console.log("Password matched")

                        // Password matches, set loggedIn session variable to true
                        req.session.loggedIn = true
                        req.session.gebruikersnaam = gebruikersnaam
                        req.session.save(() => {
                            console.log("Session saved")
                            res.redirect("/products")
                        })
                    } else {
                        console.log("Password did not match")

                        // Password does not match
                        req.session.error = "Gebruikersnaam of wachtwoord ongeldig"
                        res.redirect("/login")
                    }
                })
            } else {
                console.log("User not found")

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
    res.redirect("/login")
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

    // Check if username or email already exists in the database
    User.findOne({ $or: [{ gebruikersnaam: gebruikersnaam }, { email: email }] })
        .then((existingUser) => {
            if (existingUser) {
                // User with the same username or email already exists
                req.session.error = "Gebruikersnaam of email is al in gebruik"
                res.render("signUp", { error: req.session.error }) // Render the signup page with the error message
                return Promise.reject("Duplicate user")
            }

            // Create a new user object with the filled-in information
            const newUser = new User({
                naam: naam,
                email: email,
                leeftijd: leeftijd,
                gebruikersnaam: gebruikersnaam,
                wachtwoord: wachtwoord,
            })

            // Save the new user to the database
            return newUser.save()
        })
        .then(() => {
            console.log("new user")
            req.session.loggedIn = true
            req.session.gebruikersnaam = gebruikersnaam
            req.session.save(() => {
                res.redirect("/voorkeuren")
            })
        })
        .catch((error) => {
            if (error !== "Duplicate user") {
                console.error("Error gebruiker aanmaken:", error)
                req.session.error = "Gebruiker niet kunnen registreren"
                res.render("signUp", { error: req.session.error }) // Render the signup page with the error message
            }
        })
})

//voorkeuren pagina
app.get("/voorkeuren", async (req, res) => {
    try {
        const { gebruikersnaam } = req.session // Gebruikersnaam van de ingelogde gebruiker

        // Zoek de gebruiker in de database op basis van de gebruikersnaam
        const gebruiker = await User.findOne({ gebruikersnaam })

        if (gebruiker) {
            const { energielevel, leefstijl, grootte, slaapritme } = gebruiker.voorkeuren // Je haalt de voorkeuren op uit het gebruikersobject

            console.log("Ingelogde gebruiker:", gebruikersnaam)
            console.log("Energielevel:", energielevel)
            console.log("Leefstijl:", leefstijl)
            console.log("Grootte:", grootte)
            console.log("Slaapritme:", slaapritme)

            res.render("voorkeuren", { energielevel, leefstijl, grootte, slaapritme })
        } else {
            console.log("Gebruiker niet gevonden")
        }
    } catch (error) {
        console.error("Fout bij het ophalen van gebruikersgegevens:", error)
    }
})

app.get("/products", async (req, res) => {
    try {
        const { gebruikersnaam } = req.session // Haal de gebruikersnaam op uit de sessie van de ingelogde gebruiker

        //error handling Mila, uigezet wegens Google login.
        //
        // Controleer of er een gebruiker is ingelogd
        //if (!gebruikersnaam) {
        //	console.log("Gebruiker niet ingelogd")
        //	return res.render("notfound")
        //}

        const gebruiker = await User.findOne({ gebruikersnaam }) // Zoek de gebruiker in de database op basis van de gebruikersnaam
        if (gebruiker) {
            const { energielevel, leefstijl, grootte, slaapritme } = gebruiker.voorkeuren // Haal voorkeuren uit de gebruikersobject

            console.log("Ingelogde gebruiker:", gebruikersnaam)
            console.log("Energielevel:", energielevel)
            console.log("Leefstijl:", leefstijl)
            console.log("Grootte:", grootte)
            console.log("Slaapritme:", slaapritme)

            // Stel de query samen met behulp van de voorkeuren van de gebruiker
            const query = {
                $or: [
                    // Er worden meerdere voorwaarden (4) gecombineerd. Het resultaat van de zoekopdracht zijn documenten die overeenkomen met ten minste één van deze voorwaarden.
                    { "eigenschappen.energielevel": energielevel },
                    { "eigenschappen.leefstijl": leefstijl },
                    { "eigenschappen.grootte": grootte },
                    { "eigenschappen.slaapritme": slaapritme },
                ],
            }

            // Zoek producten in de database die voldoen aan de query
            const producten = await Product.find(query)

            // Stuur de producten als respons naar de client
            return res.render("products", {
                product: producten.map((product) => product.toJSON()),
            })
        }
    } catch (error) {
        console.error(error)
        // Wanneer er een fout is bij het ophalen van producten uit de database
        // 500 status is dat er een onverwachte fout is opgetreden aan de serverzijde tijdens het verwerken van het verzoek. Het is een algemene foutmelding die aangeeft dat er iets intern mis is gegaan, maar geeft niet specifiek aan wat het probleem is.
        return res.status(500).send("Er is een fout opgetreden. Probeer het later opnieuw.")
    } finally {
        console.log("Alle producten zijn opgehaald")
    }
})

// Admin pagina's
// Middleware function to check if the user is logged in as an admin
// Route for "/producten-overzicht" accessible only to logged-in admins
app.get("/producten-overzicht", async (req, res) => {
    try {
        if (req.session.loggedIn) {
            const naam = req.session.adminUsername
            Admin.findOne({ naam: naam }).then((admin) => {
                console.log(admin)
                if (admin) {
                    const findProducts = async () => {
                        // User is logged in as an admin, proceed to the next middleware
                        // Search for products
                        const products = await Product.find({})
                        res.render("admin-overzicht", {
                            product: products.map((product) => product.toJSON()),
                        })
                    }
                    findProducts()
                } else {
                    // User is not logged in as an admin, redirect to the login page
                    res.redirect("/admin-login")
                }
            })
        } else {
            // User is not logged in, redirect to the login page
            res.redirect("/admin-login")
        }
    } catch (error) {
        console.log(error)
    } finally {
        console.log("Got all products for admin")
    }
})

const addProduct = async (req, res) => {
    try {
        let { naam, soort, leeftijd, beschrijving, activiteit, leefstijl, grootte, dag } = req.body

        naam = naam.charAt(0).toUpperCase() + naam.slice(1)
        soort = soort.charAt(0).toUpperCase() + soort.slice(1)
        beschrijving = beschrijving.charAt(0).toUpperCase() + beschrijving.slice(1)
        activiteit = activiteit.charAt(0).toUpperCase() + activiteit.slice(1)
        leefstijl = leefstijl.charAt(0).toUpperCase() + leefstijl.slice(1)
        grootte = grootte.charAt(0).toUpperCase() + grootte.slice(1)
        dag = dag.charAt(0).toUpperCase() + dag.slice(1)

        const newProduct = new Product({
            naam: naam.replace(/[^a-zA-Z]/g, ""),
            soort: soort.replace(/[^a-zA-Z]/g, ""),
            leeftijd: req.body.leeftijd,
            img: req.file ? req.file.filename : null,
            beschrijving: beschrijving.replace("<", ""),
            eigenschappen: {
                activiteit: activiteit.replace(/[^a-zA-Z]/g, ""),
                leefstijl: leefstijl.replace(/[^a-zA-Z]/g, ""),
                grootte: grootte.replace(/[^a-zA-Z]/g, ""),
                dag: dag.replace(/[^a-zA-Z]/g, ""),
            },
        })
        newProduct.save()
        console.log("added:", newProduct)
        setTimeout(() => {
            res.redirect("/producten-overzicht")
        }, 1000)
    } catch (error) {
        console.log(error)
    } finally {
        console.log("finally")
    }
}

const changeProduct = async (req, res) => {
    try {
        let { naam, leeftijd, soort, beschrijving, id, activiteit, leefstijl, grootte, dag } = req.body
        let updateObject = {}
        if (naam) naam = naam.charAt(0).toUpperCase() + naam.slice(1)
        if (soort) soort = soort.charAt(0).toUpperCase() + soort.slice(1)
        if (beschrijving) beschrijving = beschrijving.charAt(0).toUpperCase() + beschrijving.slice(1)
        if (activiteit) activiteit = activiteit.charAt(0).toUpperCase() + activiteit.slice(1)
        if (leefstijl) leefstijl = leefstijl.charAt(0).toUpperCase() + leefstijl.slice(1)
        if (grootte) grootte = grootte.charAt(0).toUpperCase() + grootte.slice(1)
        if (dag) dag = dag.charAt(0).toUpperCase() + dag.slice(1)

        if (naam) updateObject.naam = naam.replace(/[^a-zA-Z]/g, "")
        if (leeftijd) updateObject.leeftijd = leeftijd
        if (soort) updateObject.soort = soort.replace(/[^a-zA-Z]/g, "")
        if (beschrijving) updateObject.beschrijving = beschrijving.replace("<", "")
        if (req.file) updateObject.img = req.file.filename
        await Product.findOneAndUpdate({ _id: id }, updateObject).then(() => console.log("Object updated successfully."))
        if (activiteit) await Product.findOneAndUpdate({ _id: id }, { "eigenschappen.activiteit": activiteit.replace(/[^a-zA-Z]/g, "") })
        if (leefstijl) await Product.findOneAndUpdate({ _id: id }, { "eigenschappen.leefstijl": leefstijl.replace(/[^a-zA-Z]/g, "") })
        if (grootte) await Product.findOneAndUpdate({ _id: id }, { "eigenschappen.grootte": grootte.replace(/[^a-zA-Z]/g, "") })
        if (dag) await Product.findOneAndUpdate({ _id: id }, { "eigenschappen.dag": dag.replace(/[^a-zA-Z]/g, "") })
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
        if (req.session.loggedIn) {
            const naam = req.session.adminUsername
            Admin.findOne({ naam: naam }).then((admin) => {
                console.log(admin)
                if (admin) {
                    const findProduct = async () => {
                        // zoekt producten op id
                        const products = await Product.findById(req.params.id)
                        const getItToJson = []
                        getItToJson.push(products)
                        res.render("admin-aanpassen", {
                            product: getItToJson.map((product) => product.toJSON()),
                        })
                    }
                    findProduct()
                } else {
                    // User is not logged in as an admin, redirect to the login page
                    res.redirect("/admin-login")
                }
            })
        } else {
            // User is not logged in, redirect to the login page
            res.redirect("/admin-login")
        }
    } catch (error) {
        console.log(error)
    } finally {
        console.log("Got all products for admin")
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
    try {
        if (req.session.loggedIn) {
            const naam = req.session.adminUsername
            Admin.findOne({ naam: naam }).then((admin) => {
                console.log(admin)
                if (admin) {
                    res.render("admin-addProducts")
                } else {
                    // User is not logged in as an admin, redirect to the login page
                    res.redirect("/admin-login")
                }
            })
        } else {
            // User is not logged in, redirect to the login page
            res.redirect("/admin-login")
        }
    } catch (error) {
        console.log(error)
    } finally {
        console.log("Got all products for admin")
    }
})

// voorkeuren pagina
app.get("/voorkeuren", (req, res) => {
    res.render("voorkeuren", { error: "" })
})

// voorkeuren oplaan
app.post("/voorkeuren", (req, res) => {
    const { energielevel, leefstijl, grootte, slaapritme } = req.body
    const gebruikersnaam = req.session.gebruikersnaam

    User.findOneAndUpdate(
        { gebruikersnaam: gebruikersnaam },
        {
            voorkeuren: {
                energielevel: energielevel,
                leefstijl: leefstijl,
                grootte: grootte,
                slaapritme: slaapritme,
            },
        },
        { new: true }
    )
        .then(() => {
            // Preferences updated successfully
            res.redirect("/products")
        })

        .catch((error) => {
            console.error("Error updating preferences:", error)
            res.render("voorkeuren", { error: "Error updating preferences" })
        })
})

// Confirmation page
app.get("/confirm-form/:id", async (req, res) => {
    try {
        // zoekt product op id
        const products = await Product.findById(req.params.id)
        const getItToJson = []
        getItToJson.push(products)

        res.render("confirm-form", {
            doggo: getItToJson.map((product) => product.toJSON()),
        })
    } catch (error) {
        console.log(error)
    } finally {
        console.log("afspraak pagina geladen")
    }
})

//Post the form information
const doggo = {
    naam: "Barry",
    soort: "Golden retriever",
    leeftijd: "1",
    beschrijving: "Barry is een rustige hond die goed met kinderen om kan gaan. Hij houdt erg van buitenspelen en knuffelen.",
}
app.post("/meet", async (req, res, next) => {
    try {
        const person = {
            name: req.body.name,
            date: req.body.date,
            time: req.body.time,
        }
        res.render("confirm", { person, doggo })
    } catch (err) {
        next(err)
    }
})

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

// Configure Passport to use the Google strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if the user already exists in the database
                let user = await User.findOne({ googleId: profile.id })

                if (user) {
                    // User already exists, return it
                    done(null, user)
                } else {
                    // Create a new user in the database
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                    })

                    // Return the newly created user
                    done(null, user)
                }
            } catch (err) {
                done(err, null)
            }
        }
    )
)

// Initialize Passport and session
app.use(passport.initialize())
app.use(passport.session())

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    // Serialize the user object to store in the session
    done(null, user.id)
})

// Deserialize user using async/await
passport.deserializeUser(async (id, done) => {
    try {
        // Deserialize the user object from the session
        const user = await User.findById(id)
        done(null, user)
    } catch (err) {
        done(err, null)
    }
})

// Google authentication route
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))

// Google authentication callback route
app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    // Authentication succeeded, redirect to the desired page
    res.redirect("/products")
})

app.get("/wishlist", async (req, res) => {
    try {
        const user = await User.find({ gebruikersnaam: req.session.gebruikersnaam })
        if (!user) {
            throw new Error("User not found")
        }
        let userWishlist = user[0].wishlist
        const multipleP = await Product.find({ _id: { $in: userWishlist } })
        console.log(multipleP)

        res.render("wishlist", { wishlist: multipleP.map((product) => product.toJSON()) })
    } catch (error) {
        console.error("Error retrieving wishlist products:", error)
        throw error
    }
})

app.post("/wishlist-add/:id", async (req, res) => {
    try {
        const userUpdate = await User.findOneAndUpdate({ gebruikersnaam: req.session.gebruikersnaam }, { $push: { wishlist: req.params.id } })
        console.log(userUpdate)
        res.redirect("/products")
    } catch (error) {
        console.error("Error adding product to wishlist:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

app.post("/wishlist-delete/:id", async (req, res) => {
    try {
        const userUpdate = await User.findOneAndUpdate({ gebruikersnaam: req.session.gebruikersnaam }, { $pull: { wishlist: req.params.id } })
        console.log(userUpdate)
        res.redirect("/wishlist")
    } catch (error) {
        console.error("Error removing product from wishlist:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

app.post("/product-delete/:id", async (req, res) => {
    try {
        const adminUpdate = await Product.findOneAndDelete({ _id: req.params.id })
        console.log(adminUpdate)
        res.redirect("/producten-overzicht")
    } catch (error) {
        console.error("Error removing product from list:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

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
