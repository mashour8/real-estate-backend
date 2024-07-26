import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
  console.log("router register");
});

export default router;
