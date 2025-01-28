import jwt from "jsonwebtoken";

const signJWTToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: '1d'
        }
    );
}

export {
    signJWTToken
}

