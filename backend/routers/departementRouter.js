const express = require("express");
const router = express.Router();
const {
  addDepartement,
  getAllDepartements,
  getDepartementById,
  updateDepartement,
  deleteDepartement,
} = require("../controllers/departementController");

router.post("/", addDepartement);
router.get("/", getAllDepartements);
router.get("/:id", getDepartementById);
router.put("/:id", updateDepartement);
router.delete("/:id", deleteDepartement);

module.exports = router;
