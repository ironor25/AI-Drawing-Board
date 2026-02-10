import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/db/client"; 
import dotenv from "dotenv";

dotenv.config();

const auth_router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup
auth_router.post("/signup", async (req, res) => {
    try {
        const { username, password, name } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Missing inputs" });
        }

        // Check existing
        const existing = await prismaClient.user.findUnique({ where: { email: username } });
        if (existing) return res.status(409).json({ message: "User exists" });

        // Hash & Create
        const hashed = await bcrypt.hash(password, 10);
        const user = await prismaClient.user.create({
            data: { email: username, password: hashed, name: name || "User" }
        });

        res.status(201).json({ userId: user.id });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Signup failed" });
    }
});

// Signin
auth_router.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await prismaClient.user.findUnique({ where: { email: username } });
        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Invalid credentials" });

        if (!JWT_SECRET) throw new Error("No JWT Secret");

        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1d" });

        res.json({ token });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Signin failed" });
    }
});

export default auth_router;