import { Router } from "express";

import UserService from "../../services/user.js";
import urls from "../urls.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import {
  registerSchema,
  changePasswordSchema,
  loginSchema,
  userSchema,
} from "../schemas/auth.js";

const router = Router();

/** @swagger
 *
 * tags:
 *   name: Authentication
 *   description: User authentication API
 *
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Authenticate with the service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginSchema'
 *     responses:
 *       200:
 *         description: Successful login, with user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, incorrect login credentials
 */
router.post(urls.auth.login, requireSchema(loginSchema), async (req, res) => {
  const { email, password } = req.validatedBody;

  const user = await UserService.authenticateWithPassword(email, password);

  if (user) {
    res.json({ user });
  } else {
    res.status(401).json({ error: "Authentication failed" });
  }
});

router.get(urls.auth.login, (req, res) => {
  res.status(405).json({ error: "Login with POST instead" });
});

/** @swagger
 *
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Register with the service
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/registerSchema'
 *     responses:
 *       201:
 *         description: Successful registration, with user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request, registration failed
 */
router.post(
  urls.auth.register,
  requireSchema(registerSchema),
  async (req, res, next) => {
    if (req.user) {
      res.json({ user: req.user });
      return;
    }

    try {
      const user = await UserService.createUser(req.validatedBody);
      res.status(201).json({ user });
    } catch (error) {
      if (error.isJoi) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(409).json({ error: error.message });
        next(error);
      }
    }
  }
);

// all auth routes after this can rely on existence of req.user
router.use(requireUser);

/** @swagger
 *
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Log out of the service - invalidate auth token
 *     responses:
 *       204:
 *         description: Successful logout, token invalidated
 */
router.post(urls.auth.logout, async (req, res) => {
  await UserService.regenerateToken(req.user);
  res.status(204).send();
});

router.get(urls.auth.logout, (req, res) => {
  res.status(405).json({ error: "Logout with POST instead" });
});
router.get(`${urls.auth.users}/:id`, requireValidId, async (req, res, next) => {
  try {
    const id = req.params.id;
    const obj = await UserService.get(id);
    if (obj) {
      res.status(200).json(obj);
    } else {
      res.status(404).json({ error: "Resource is not found" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.put(`${urls.auth.users}/:id`, requireValidId, async (req, res) => {
  try {
    const { languageId } = req.body;
    const obj = await UserService.updateLanguage(req.params.id, languageId);
    if (obj) {
      res.status(200).json(obj);
    } else {
      res.status(404).json({ error: "Resource is not found" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post(
  urls.auth.changePassword,
  requireSchema(changePasswordSchema),
  async (req, res) => {
    const { password } = req.validatedBody;

    await UserService.setPassword(req.user, password.toString());
    res.status(204).send();
  }
);

export default router;
