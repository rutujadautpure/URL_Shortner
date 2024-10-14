const shortid = require("shortid");
const URL = require("../models/url");


async function handleGenerateNewShortURL(req,res){
    const body = req.body;
    if(!(body.url)){
        return res.render("home",{error : "Please provide url"},)
    }
    const shortId = shortid();
    await URL.create({
        shortId:shortId,
        redirectURL:body.url,
        visitHistory:[],
        createdBy : req.user._id
    })
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return res.render("home",{id:shortId},)
}

module.exports ={
    handleGenerateNewShortURL,
}