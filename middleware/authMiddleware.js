import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
    let token;
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            
            const decored = jwt.verify(token, process.env.JWT_SECRET);

            req.veterinario = await Veterinario.findById(decored.id).select("-password -token -confirmado");

            return next();
        } catch (error) {
            const error2 = new Error("Token no válido");
            res.status(403).json({ msg: error2.message });
        }
    } 
    
    if(!token) {
        const error = new Error("Token no válido o inexistente");
        return res.status(403).json({ msg: error.message });    
    }

   
    
    next();

};

export default checkAuth;