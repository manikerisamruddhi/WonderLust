const express = require("express");
const app = express();
const port = 3001;
const path = require("path");
const mongoose = require("mongoose");
const url = 'mongodb://127.0.0.1:27017/wonderlust';
const Listing = require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync=require("./utils/wrapAsync.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate);

main().then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(`Error occurred in main function: ${err}`);
});

async function main() {
    await mongoose.connect(url);
}

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.get("/listings", async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index", { allListings });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.get("/listings/new", (req, res) => {
    res.render("listings/new");
});

app.post("/listings/new", async (req, res) => {
    try {
        const { title, description, image, price, location, country } = req.body;
        const newListing = new Listing({
            title,
            description,
            image,
            price,
            location,
            country
        });
        await newListing.save();
        console.log(`New listing saved in DB: ${newListing}`);
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.get("/listings/:id/edit", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/edit", { listing });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.put("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image, price, location, country } = req.body;
        const updatedListing = await Listing.findByIdAndUpdate(id, {
            title,
            description,
            image,
            price,
            location,
            country
        }, { new: true });
        if (!updatedListing) {
            return res.status(404).send("Listing not found");
        }
        console.log("Data updated!!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.get("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("listings/show", { listing });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.delete("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`Deleting listing with ID: ${id}`); 
        const deletedList = await Listing.findByIdAndDelete(id);
        if (!deletedList) {
            return res.status(404).send("Listing not found");
        }
        console.log(`Deleted list: ${deletedList}`);
        res.redirect("/listings");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
