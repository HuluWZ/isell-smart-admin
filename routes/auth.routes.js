const express = require("express");
const { validateToken } = require("../middleware/authMiddleware");
const {
  createAccount,
  login,
  updateAccount,
  deleteAccount,
  getUser,
  getCurrentUser,
  getAll,
  logOut,
  changePassword
} = require("../controllers/Auth.Controller");

const router = express.Router();
// User Account Router
router.post("/create/", createAccount);
router.post("/login/", login);
router.put("/update/:id", updateAccount);
router.get("/currentuser/",validateToken,getCurrentUser);
router.get("/get/:id", getUser);
router.get("/get/", getAll);
router.delete("/delete/:id", deleteAccount);
router.get("/logout", validateToken,logOut);
router.put("/change/password/", validateToken, changePassword);

module.exports = router;
