const express = require("express");
const connection = require("../config/connection");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
var auth = require("../services/authentication");

router.use(express.json());


router.get(
    "/get_widgets",
    auth.authenticateToken,
    async (req, res) => {
      const signedin_user = res.locals.id;
      const selectQuery = "SELECT * FROM widgets";
      connection.query(selectQuery,  (err, results) => {
        if (err) {
        //   logger.error(
        //     `- ${signedin_user} - ${new Date()} - Read announcement Cache server history  error:`,
        //     err
        //   );
        return res.status(500).json({ message: err.message });
        } else {
        //   logger.info(
        //     `Widgets fetch Successfully - ${signedin_user} - ${new Date()}`
        //   );
          return res.status(201).json({ results });
        }
      });
    }
  );
  



module.exports = router;