const express = require("express");
const router = express.Router();

// Load Like model
const Like = require("../../models").Like;

// @route GET api/likes
// @desc get all likes
// @access public
router.get("/", (req, res) => {
    Like.findAll()
        .then(likes => {
            if (!likes) {
                res.json({
                    message: "There are no likes"
                });
            }
            res.json(likes);
        })
        .catch(err => {
            res.status(404).json(err);
        });
});


module.exports = router;