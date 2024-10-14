const User = require("../models/user")
const {v4: uuidv4} = require("uuid")
const {setUser,getUser} = require("../service/auth")


async function handleUserSignUp(req,res){
    const {name, email, password}= req.body;
    if(!name){
        return res.json("Enter your name");
    }
    else if(!email){
        return res.json("Enter your email");
    }
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@coeptech\.ac\.in$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
        return res.json("Enter a valid email ID");
    }

    else if(!password){
        return res.json("Enter your password");
    }
    else if (password.length < 7){
        return res.json("Password should be at least 7 characters");
    }
    await User.create({
        name,
        email,
        password,
    });
    return res.render("login");
}

async function handleAuthentication(req,res){
    const {email , password} = req.body;
    if(!email){
        return res.json("Enter your email");
    }
    else if(!password){
        return res.json("Enter your password");
    }
    const user = await User.findOne({email, password});
    if(!user){
        return res.render("login",{
            error:"Invalid username or password"
        })
    }
    const token = setUser(user);
    res.cookie("uid",token);
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return res.redirect("/");
}

async function handleLogout(req, res) {
    res.clearCookie("uid"); // Replace "uid" with the actual cookie name if different
    
    // Optionally, you can also perform any additional cleanup or session termination here
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    // Redirect to the login page or home page after logout
    return res.redirect("/user/login"); // Change the redirect path as necessary
}


module.exports = {
    handleUserSignUp,
    handleAuthentication,
    handleLogout,
}

