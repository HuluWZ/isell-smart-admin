const express = require("express");
const { validateToken } = require("../middleware/authMiddleware");
const {
  createActivity,
  updateActivity,
  deleteActivity,
  getActivity,
  getAllActivity,
  searchActivity,
  filterActivity
} = require("../controllers/Activity.Controller");

const { uploadAnyImages,uploadImage,uploadImages } = require("../middleware/fileUploadMiddleware");

const router = express.Router();

// Activity Router
router.post("/create/", uploadImages,createActivity);
router.put("/update/:id", uploadAnyImages, updateActivity);
router.get("/get/:id", getActivity);
router.get("/get/", getAllActivity);
router.delete("/delete/:id", deleteActivity);
router.get("/search", searchActivity);
router.get("/filter",filterActivity)

module.exports = router;
