import express, { Router } from "express";
import { prismaClient } from "@repo/db/client";
import asyncHandler from "../utils/asyncHandler.js";

const chats_router: Router = express.Router();

chats_router.get(
  "/:roomId",
  asyncHandler(async (req, res) => {
    const roomId = Number(req.params.roomId);
    if (Number.isNaN(roomId))
      return res.status(400).json({ message: "Invalid room id" });

    const messages = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: { id: "desc" },
      take: 50,
    });
    res.json({ messages });
  }),
);

export default chats_router;
