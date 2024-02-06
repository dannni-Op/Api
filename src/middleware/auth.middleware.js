import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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


    // if(req.body.password){
    //     const result = await bcrypt.compare(req.body.password, result.password);
    //     if(!result) return res.status(401).json({
    //         errors: "Password tidak sama"
    //     })
    // }

    req.user = {
        userId: result.userId,
        userType: result.userType,
        userPermission: result.userPermission,
    };
    next();
}