const express = require("express");

const siteController = require("../controllers/siteController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/read-csv", siteController.readCsv);

router.use(authController.protect);

router
  .route("/")
  .get(siteController.getAllSites)
  .post(siteController.createSite)
  .delete(siteController.deleteAllSites);

router
  .route("/:id")
  .get(siteController.getSite)
  .patch(siteController.updateSite)
  .delete(siteController.deleteSite);

router.use(authController.restrictTo("Super Admin"));

router.post("/:id/send-instant-site", siteController.sendInstantSite);

router.get("/next", siteController.nextCount);
router.post("/reset", siteController.resetCount);
router.post("/fake", siteController.addFakeData);
router.post("/fake/:number", siteController.addMultipleFakeData);

module.exports = router;
