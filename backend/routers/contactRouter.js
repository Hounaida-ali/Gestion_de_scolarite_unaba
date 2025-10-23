const express = require('express');
const router = express.Router();
const {saveMessage,getAllMessages,message,deleteMessge} = require('../controllers/contactController');

router.post("/saveMessage",saveMessage);
router.get("/getAllMessages",getAllMessages);
router.put("/:id/reply",message);
router.delete("/:id",deleteMessge);

module.exports = router;