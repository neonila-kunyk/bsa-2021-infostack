import { Router } from 'express';
import { run } from '../../common/helpers/route.helper';
import { signUpSchema, loginSchema } from '../../common/validations';
import {
  login,
  register,
  resetPassword,
  setPassword,
  refreshTokens,
  logout,
  updatePasswordAndFullName,
  loginGoogle,
  getLoginGoogleUrl,
  getLoginGitHubUrl,
} from '../../services/auth.service';
import { validationMiddleware } from '../middlewares';
const router: Router = Router();

router.post(
  '/register',
  validationMiddleware(signUpSchema),
  run((req) => register(req.body)),
);

router.post(
  '/login',
  validationMiddleware(loginSchema),
  run((req) => login(req.body)),
);

router.post(
  '/reset-password',
  run((req) => resetPassword(req.body)),
);

router.post(
  '/set-password',
  run((req) => setPassword(req.body)),
);

router.post(
  '/update-password-and-fullname',
  run((req) => updatePasswordAndFullName(req.body)),
);

router.post(
  '/refresh',
  run((req) => refreshTokens(req.body)),
);

router.post(
  '/logout',
  run((req) => logout(req.body)),
);

router.post(
  '/login/google',
  run((req) => loginGoogle(req.body.code)),
);

router.get(
  '/login/google',
  run((_) => getLoginGoogleUrl()),
);

router.get(
  '/login/github',
  run((_) => getLoginGitHubUrl()),
);

export default router;
