import {Request, Response, NextFunction} from 'express';

export const loginValidator = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.status(400).json({message: "All fields are required"});
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({message: "Invalid email"});
        return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({message: "Invalid password"});
        return;
    }

    next();
}