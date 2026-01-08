const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn,isOwner,validateListing } = require("../middlewares.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js"); 
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

router
    .route("/")
    .get( wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.newListing));


//Create rout
router.get("/new",isLoggedIn,(listingController.renderNewListing));

router
    .route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put(isOwner,isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListings));


//Edit rout
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditListing));


module.exports = router;