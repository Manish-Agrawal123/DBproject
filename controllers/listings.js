const Listing = require("../models/listing.js");
const NodeGeocoder = require("node-geocoder");

module.exports.index = async(req,res)=>{
  const allListing = await Listing.find({});
  res.render("./listings/index.ejs",{allListing});
}

module.exports.showListings = async(req,res)=>{
  let {id}=req.params;
  const listing = await Listing.findById(id)
  .populate({path:"reviews",
    populate:{
      path:"author",
    }
  }
  ).populate("owner");
  if(!listing){
    req.flash("error","Listing you request for does not exsist!");
    return res.redirect("/listings");
  }
  res.render("./listings/show.ejs",{listing})
}

module.exports.renderEditListing = async(req,res)=>{
  let {id}=req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error","Listing you request for does not exsist!");
    return res.redirect("/listings");
  }
  
  let orignalImg=listing.image.url;
  orignalImg= orignalImg.replace("/upload","/upload/w_250");

  res.render("./listings/edit.ejs",{listing,orignalImg});
}


module.exports.updateListing = async(req,res)=>{
  let {id}=req.params;
  let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
  if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
  }
  req.flash("success","Listing Updated");
  res.redirect(`/listings/${id}`);
}

module.exports.renderNewListing = (req,res)=>{
  res.render("./listings/new.ejs");
}

module.exports.newListing = async(req,res)=>{
  const address = req.body.listing.location;

const newListing = new Listing(req.body.listing);

const geocoder = NodeGeocoder({
  provider: "openstreetmap"
});

const resp = await geocoder.geocode(address);

if (!resp.length) {
  req.flash("error", "Location not found");
  return res.redirect("/listings/new");
}

const { latitude: lat, longitude: lng } = resp[0];
newListing.geometry = {
  type: "Point",
  coordinates: [lng, lat]
};


  if(!req.file){
    req.flash("error","Image is required");
    return res.redirect("/listings/new")
  }
  let url = req.file.path;
  let filename = req.file.filename;
  newListing.image = {url,filename};
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success","New Listing Created");
  res.redirect("/listings");
}


module.exports.destroyListings = async(req,res)=>{
  let {id}=req.params;
  const listing = await Listing.findById(id);
  await Listing.findByIdAndDelete(id);
  console.log(listing);
  req.flash("success","Listing Delete!");
  res.redirect("/listings");
}

