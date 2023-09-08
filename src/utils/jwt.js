const JWT = require('jsonwebtoken');
const { promisify } = require('util');

exports.signAccessToken = (id, userType) => {
    const payload = { name: 'access', id, userType };
    const secret = process.env.JWT_ACCESS_SECRET;
    const expiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
    return JWT.sign(payload, secret, { expiresIn });
};

exports.signRefreshToken = (id, userType, refreshSession) => {
    const payload = { name: 'refresh', id, userType, refreshSession };
    const secret = process.env.JWT_REFRESH_SECRET;
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
    return JWT.sign(payload, secret, { expiresIn });
};

exports.verifyToken = async (token, secret) => {
    try {
        return {
            ...(await promisify(JWT.verify)(token, secret)),
            status: true
        };
    } catch (err) {
        if (err instanceof JWT.TokenExpiredError) {
            return { message: 'Token expired.', status: false };
        } else if (err instanceof JWT.JsonWebTokenError) {
            return { message: 'Invalid Token', status: false };
        } else {
            return { message: 'An error occurred', status: false };
        }
    }
};
