import { Router } from "express";
import UserBranchMapService from "../../services/userbranchmap.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/userbranchmap.js";
import { User } from "../../models/init.js";
import { UserBranchMap } from "../../models/init.js";
import UserService from "../../services/user.js";
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: UserBranchMap
 *   description: API for managing UserBranchMap objects
 *
 * /user-branch-map:
 *   get:
 *     tags: [UserBranchMap]
 *     summary: Get all the UserBranchMap objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of UserBranchMap objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserBranchMap'
 */
router.get("/", async (req, res, next) => {
  try {
    const results = await UserBranchMapService.list();
    res.json(results);
  } catch (error) {
    console.error("Error details:", error);
    if (error instanceof Error && error.name === "ClientError") {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});
router.get("/usersWithOrganisationAndBranch/:tenantId", async (req, res) => {
  const { tenantId } = req.params; // Extract tenantId from the request params
  try {
    const usersWithDetails = await Prisma.user.findMany({
      where: {
        tenantId: tenantId, // Filter users by the provided tenantId
      },
      include: {
        tenant: {
          include: {
            branches: true,
          },
        },
      },
    });

    res.json(usersWithDetails);
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

/** @swagger
 *
 * /user-branch-map:
 *   post:
 *     tags: [UserBranchMap]
 *     summary: Create a new UserBranchMap
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserBranchMap'
 *     responses:
 *       201:
 *         description: The created UserBranchMap object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserBranchMap'
 */
router.post("/", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await UserBranchMapService.create(req.validatedBody);
    res.status(201).json(obj);
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /user-branch-map/{id}:
 *   get:
 *     tags: [UserBranchMap]
 *     summary: Get a UserBranchMap by id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: UserBranchMap object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserBranchMap'
 */
router.get("/invited/:id", async (req, res, next) => {
  try {
    const organisationId = parseInt(req.params.id);
    const invitedUsers = await Prisma.userBranchMap.findMany({
      select: {
        email: true,
      },
      where: {
        isInvited: true,
        isAccepted: false,
        organisationId: organisationId,
      },
    });
    if (invitedUsers) {
      res.json(invitedUsers);
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  } catch (error) {
    console.error("Error details:", error);
    if (error instanceof Error && error.name === "ClientError") {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});
router.get("/exist", async (req, res, next) => {
  try {
    const email = req.query.email;

    const organisationId = parseInt(req.query.organisationId);

    // Check if user with the provided email exists
    const existingUser = await Prisma.userBranchMap.findUnique({
      where: {
        email: email,
        organisationId: organisationId,
      },
    });

    // Respond based on user existence
    if (existingUser) {
      res.json({ exists: true }); // Or any other relevant response data
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error details:", error);
    if (error instanceof Error && error.name === "ClientError") {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

router.get("/invited-status/:id", async (req, res, next) => {
  try {
    const organisationId = parseInt(req.params.id);
    const invitedUsers = await Prisma.UserBranchMap.findMany({
      where: {
        isInvited: true,
        organisationId: organisationId,
      },
    });

    if (invitedUsers) {
      res.json(invitedUsers);
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  } catch (error) {
    console.error("Error details:", error);
    if (error instanceof Error && error.name === "ClientError") {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

router.get("/:branchId", async (req, res, next) => {
  try {
    const obj = await UserBranchMapService.noOfChefs(req.params.branchId);
    if (obj) {
      res.json(obj);
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  } catch (error) {
    console.error("Error details:", error);
    if (error instanceof Error && error.name === "ClientError") {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /user-branch-map/{id}:
 *   put:
 *     tags: [UserBranchMap]
 *     summary: Update UserBranchMap with the specified id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserBranchMap'
 *     responses:
 *       200:
 *         description: The updated UserBranchMap object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserBranchMap'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await UserBranchMapService.update(
        req.params.id,
        req.validatedBody
      );
      if (obj) {
        res.status(200).json(obj);
      } else {
        res.status(404).json({ error: "Resource not found" });
      }
    } catch (error) {
      console.error("Error details:", error);
      if (error instanceof Error && error.name === "ClientError") {
        res.status(400).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }
);
//  assign role for a user
router.put(
  "/user/rolebranch",
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const { roleId, branchId, email } = req.body;
      const updatedUserBranchMap = await UserBranchMapService.put(
        email,
        roleId,
        branchId
      );

      if (updatedUserBranchMap) {
        res.status(200).json(updatedUserBranchMap);
      } else {
        res.status(404).json({ error: "Resource not found" });
      }
    } catch (error) {
      console.error("Error details:", error);
      if (error instanceof Error && error.name === "ClientError") {
        res.status(400).json({ error: error.message });
      } else {
        next(error);
      }
    }
  }
);
// deactivate user
router.put("/user/deactivate", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const success = await UserBranchMapService.deactivateUser(email);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "User not found or already deactivated" });
    }
  } catch (error) {
    console.error("Error details:", error);
    if (error instanceof Error && error.name === "ClientError") {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /user-branch-map/{id}:
 *   delete:
 *     tags: [UserBranchMap]
 *     summary: Delete UserBranchMap with the specified id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *        description: OK, object deleted
 */
router.delete("/:id", requireValidId, async (req, res, next) => {
  try {
    const success = await UserBranchMapService.delete(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Not found, nothing deleted" });
    }
  } catch (error) {
    console.error("Error details:", error);
    if (error instanceof Error && error.name === "ClientError") {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

router.get("/usersWithRoles/login/:email", async (req, res, next) => {
  try {
    const results = await UserBranchMapService.getUsersWithRoles(
      req.params.email
    );
    res.json(results);
  } catch (error) {
    console.error("Error details:", error);
    if (error instanceof Error && error.name === "ClientError") {
      res.status(400).json({ error: error.message });
    } else {
      next(error);
    }
  }
});

// Endpoint to get user information based on matching emails and isAccepted=true
router.get("/users/users-with-matching-emails", async (req, res) => {
  try {
    const matchingEmails = await UserBranchMapService.getAcceptedEmail();
    const users = [];

    for (const emailObj of matchingEmails) {
      const email = emailObj.email;
      const user = await UserService.getByEmail(email, {
        includeUserBranchMap: true,
      });

      if (user) {
        users.push(user);
      }
    }
    res.json(users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
