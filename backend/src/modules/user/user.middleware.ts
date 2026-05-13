import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "@config/index";

interface jwtPayLoad {
    id: string;
    name?: string;
    email: string;
}

export const userMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        res.status(401).json({
            message: 'Unathorized: No Token Provided'
        });
        return;
    }

    const token = authHeader.split(' ')[1];

    const accessSecret = config.jwt.accessSecret;

    if (!accessSecret) {
        res.status(500).json({
            message: 'Internal Server Error: JWT Secret Not Configure'
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, accessSecret) as jwtPayLoad;

        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
        };

        next();
    }
    catch (error: any) {
        res.status(401).json({
            message: 'Unathorized: Invalid or expired token',
        });
    }
};