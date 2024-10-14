const express = require("express")
const {handleUserSignUp,handleAuthentication,handleLogout} = require("../controllers/user");
// const User = required("../models/user")
const router = express.Router();

router.post('/',handleUserSignUp);
router.post('/login',handleAuthentication);
router.get('/logout',handleLogout);
router.get("/user/login", (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate'); // Set cache control
    res.render("login");
});


module.exports = router;