var express = require("express");
var router = express.Router();

const post_controller = require("../controllers/postController");

// GET request for creating a Post. NOTE This must come before routes that display Post (uses id)
router.get("/create", post_controller.post_create_get);

// POST request for creating Post
router.post("/:id/create", post_controller.post_create_post);

// GET request to delete Post
router.get("/:id/delete", post_controller.post_delete_get);

// POST request to delete Post
router.post("/:id/delete", post_controller.post_delete_post);

// GET request to update Post
router.get("/:id/update", post_controller.post_update_get);

// POST request to update Post
router.post("/:id/update", post_controller.post_update_post);

// GET request for one Post
router.get("/:id", post_controller.post_detail);

/* GET posts listing. */
router.get("/", post_controller.post_list);

module.exports = router;
