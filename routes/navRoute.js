import express from "express";
import fs from "fs";
const router = express.Router();

router.get("/", (req, res) => {
  fs.readFile("public/index.html", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).end(data);
    }
  });
});

router.get("/login", (req, res) => {
  fs.readFile("public/login.html", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).end(data);
    }
  });
});


router.get("/signup", (req, res) => {
  fs.readFile("public/register.html", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).end(data);
    }
  });
});


router.get("/update", (req, res) => {
  fs.readFile("public/update.html", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    } else {
      res.status(200).end(data);
    }
  });
});




export default router;
