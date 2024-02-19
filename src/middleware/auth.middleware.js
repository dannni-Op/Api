import jwt from "jsonwebtoken";
import { prismaClient } from "../app/db.js";

export const authMiddleware = async (req, res, next) => {

    let token = req.headers.authorization;
    if(!token) return res.status(401).json({ errors: "Unauthorized", }).end();
    token = token.split(" ")[1];
    let result;
    try {
        result = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        return res.status(401).json({
            errors: "Unauthorized",
        })
    }

    const user = await prismaClient.users.findFirst({
        where: {
            userId: result.key,
        }
    })
    
    if(!user) return res.status(401).json({ errors: "Unauthorized" })
    req.user = {
        userId: result.key
    };
    next();
}