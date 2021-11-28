const express = require("express");

const viewsController = require("../controllers/viewsController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", viewsController.getHomePage);

router.use(authController.isLoggedIn);

router.use(authController.protect);

router.get("/dashboard", viewsController.getDashboardPage);
router.get("/new-password", viewsController.newPasswordPage);

router.get("/instant-sites", viewsController.getInstantSitePage);
/******INSTANT SITES */
router.get("/instant-sites/sites", viewsController.getAllSitesPage);
router.get("/instant-sites/sites/new", viewsController.getCreateSitePage);
router.get(
  "/instant-sites/sites/new/bulk",
  viewsController.createBulkSitesPage
);
router.get("/instant-sites/sites/:customId/:slug", viewsController.getSitePage);
router.get(
  "/instant-sites/sites/:customId/:slug/edit",
  viewsController.getEditSitePage
);
/******INDUSTRIES */
router.get("/instant-sites/industries", viewsController.getAllIndustriesPage);
router.get(
  "/instant-sites/industries/new",
  viewsController.getCreateIndustryPage
);
router.get("/instant-sites/industries/:slug", viewsController.getIndustryPage);
router.get(
  "/instant-sites/industries/:slug/edit",
  viewsController.getEditIndustryPage
);
/****** USERS */
router.get("/users", viewsController.getAllUsersPage);
router.get("/users/new", viewsController.getCreateUserPage);
router.get("/users/:slug", viewsController.getUserPage);
router.get("/users/:slug/edit", viewsController.getEditUserPage);

module.exports = router;
