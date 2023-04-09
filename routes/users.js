var express = require("express");
var router = express.Router();

const user_controller = require("../controllers/userController");

// GET request for creating a Post. NOTE This must come before routes that display Post (uses id)
router.get("/create", user_controller.user_create_get);

// POST request for creating Post
router.post("/create", user_controller.user_create_post);

router.get("/login", user_controller.user_login_get);

router.post("/login", user_controller.user_login_post);

router.get("/logout", user_controller.user_logout_get);

// GET request to delete Post
router.get("/:id/delete", user_controller.user_delete_get);

// POST request to delete Post
router.post("/:id/delete", user_controller.user_delete_post);

// GET request to update Post
router.get("/:id/update", user_controller.user_update_get);

// POST request to update Post
router.post("/:id/update", user_controller.user_update_post);

// GET request for one Post
router.get("/:id", user_controller.user_detail);

/* GET users listing. */
router.get("/", user_controller.user_list);

module.exports = router;
