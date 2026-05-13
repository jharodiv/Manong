import express from 'express';
import { authLimiter } from 'limiter/server/server.limiter';
import { loginValidator } from 'validator/auth.validator';
import { login } from './user.controller';

const router = express.Router();

router.post('/login', authLimiter, loginValidator, login);

export const UserRoutes = router;