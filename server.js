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
	googleId: String,
	voorkeuren: {
		energielevel: String,
		leefstijl: String,
		grootte: String,
		slaapritme: String,
	},
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

app.get("/admin-login", async (req, res) => {
	const errorMessage = req.session.error
	req.session.error = "" // Clear the error message from the session
	const gebruikersnaam = req.session.loggedIn ? req.session.gebruikersnaam : "" // Get the username from the session
	res.render("admin-login", { error: errorMessage, gebruikersnaam: gebruikersnaam })
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
		res.redirect("/voorkeuren")
	} else {
		res.render("signUp")
	}
})

// Admin login
app.post("/admin-login", (req, res) => {
	const { gebruikersnaam, wachtwoord } = req.body
	const adminUsername = process.env.ADMIN_USERNAME
	const adminPassword = process.env.ADMIN_PASSWORD

	console.log("Login username:", gebruikersnaam)

	// Check if the provided username and password match the admin credentials
	if (gebruikersnaam === adminUsername && wachtwoord === adminPassword) {
		console.log("Admin login successful")

		// Set loggedIn session variable to true for admin
		req.session.loggedIn = true
		req.session.gebruikersnaam = gebruikersnaam
		req.session.save(() => {
			console.log("Session saved")
			res.redirect("/producten-overzicht")
		})
	} else {
		console.log("Admin login failed")

		// Admin login failed
		req.session.error = "Gebruikersnaam of wachtwoord ongeldig"
		res.redirect("/admin-login")
	}
})

app.post("/admin-logout", (req, res) => {
	req.session.destroy()
	res.redirect("/admin-login")
})

// Regular user login
app.post("/login",(req, res) => {
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

	// Create a new user object with the filled-in information
	const newUser = new User({
		naam: naam,
		email: email,
		leeftijd: leeftijd,
		gebruikersnaam: gebruikersnaam,
		wachtwoord: wachtwoord,
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
		let { naam, soort, leeftijd, image, beschrijving, activiteit, leefstijl, grootte, dag } = req.body
		const newProduct = new Product({
			naam: naam.charAt(0).toUpperCase() + naam.slice(1),
			soort: soort.charAt(0).toUpperCase() + soort.slice(1),
			leeftijd: leeftijd,
			img: req.file ? req.file.filename : null,
			beschrijving: beschrijving.charAt(0).toUpperCase() + beschrijving.slice(1),
			eigenschappen: {
				activiteit: activiteit.charAt(0).toUpperCase() + activiteit.slice(1),
				leefstijl: leefstijl.charAt(0).toUpperCase() + leefstijl.slice(1),
				grootte: grootte.charAt(0).toUpperCase() + grootte.slice(1),
				dag: dag.charAt(0).toUpperCase() + dag.slice(1),
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

// voorkeuren route
app.get("/voorkeuren-opgeslagen", async (req, res) => {
	res.render("voorkeuren-opgeslagen")
})

// Confirmation page
app.get("/confirm", async (req, res) => {
	const doggo = {
		naam: "Barry",
		soort: "Golden retriever",
		leeftijd: "1",
		beschrijving: "Barry is een rustige hond die goed met kinderen om kan gaan. Hij houdt erg van buitenspelen en knuffelen.",
	}

	const today = new Date()
	const weekdays = new Date()
	weekdays.setDate(today.getDate() + 7)

	const tomorrow = new Date()
	tomorrow.setDate(tomorrow.getDate() + 1)

	if (today.getDay() === 5) {
		weekdays.setDate(weekdays.getDate() + 7) // Add additional 7 days if today is Friday
	}

	while (weekdays.getDay() === 0 || weekdays.getDay() === 6) {
		weekdays.setDate(weekdays.getDate() + 1)
	}

	const weekdaysStr = weekdays.toISOString().split("T")[0]

	res.render("confirm", { weekdaysStr, doggo })
})

const GoogleStrategy = require("passport-google-oauth20").Strategy
const GOOGLE_CLIENT_ID = "593422950502-97fr9pua64objfd3htu6n4u4oa6i2usm.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET = "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"

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
app.get(
	"/auth/google/callback",
	passport.authenticate("google", { failureRedirect: "/login" }),
	(req, res) => {
		// Authentication succeeded, redirect to the desired page
		res.redirect("/products")
	}
)

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
