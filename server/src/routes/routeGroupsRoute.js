import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/route-groups", async (req, res) => {
  try {
    const routeGroups = await prisma.routeGroup.findMany(); // Replace `routeGroup` with your model name
    res.status(200).json({ routeGroups });
  } catch (error) {
    console.error("Error fetching route groups:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;