import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {

    let token = req.headers.authorization;
    if(!token) return res.status(401).json({ errors: "Unauthorized", }).end();
    token = token.split(" ")[1];
    let result;
    try {
        result = jwt.verify(token, "RAHASIA");
    } catch (error) {
        return res.status(401).json({
            errors: "Unauthorized",
        })
    }

    //result berisi data standart user login
    
    next();
}