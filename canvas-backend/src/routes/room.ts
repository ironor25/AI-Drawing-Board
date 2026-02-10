import express, { Router } from "express";
import { CreateroomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import asyncHandler from "../utils/asyncHandler.js";

const room_router: Router = express.Router();

room_router.post(
  "/create-room",
  asyncHandler(async (req, res) => {
    const parsed = CreateroomSchema.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ message: "Incorrect inputs" });

    const slug = parsed.data.name.trim().toLowerCase().replace(/\s+/g, "-"); //trimming the input
    const adminId = (req as any).userId;

    try {
      const room = await prismaClient.room.create({
        data: { slug, adminId },
      });
      res.status(201).json({ roomId: room.id });
    } catch (e) {
      // handle unique constraint
      res.status(409).json({ message: "Room already exists" });
    }
  }),
);

room_router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const slug = String(req.params.slug);
    const room = await prismaClient.room.findFirst({ where: { slug: slug } });

    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ id: room.id });
  }),
);

export default room_router;
