import { Request, Response } from 'express';
//import httpStatus from 'http-status-codes';
//import catchAsync from '../../shared/utils/catchAsync';
//import sendResponse from '../../shared/utils/sendResponse';
import { loginUser } from '@user/user.service';

export const login = async (
  req: Request,
  res: Response,
): Promise<void> => {

  try {
    const loginResult = await loginUser(req.body);

    if (!loginResult.success) {
      res.status(loginResult.status).json({
        message: loginResult.message
      });

      return;
    }

    res.status(200).json({
      message: 'Login Successful',

      user: loginResult.data.user,

      tokens: {
        accessToken: loginResult.data.accessToken,
        refreshToken: loginResult.data.refreshToken
      },
    });
  }
  catch (err) {
    const messageError = err instanceof Error ? err.message : 'internal server error';

    res.status(500).json({
      message: 'Server Error',
      error: messageError
    });
  }


};