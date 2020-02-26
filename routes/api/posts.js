const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Post Model
const Post = require("../../models").Post;

// Load Profile Model
const Profile = require("../../models").Profile;

// Load Like model
const Like = require("../../models").Like;

// Load Comment model
const Comment = require('../../models').Comment;

// validation
const validatePostInput = require("../../validation/post");

// @route GET api/posts/test
// @desc Tests posts route
// @access Public
router.get("/test", (req, res) =>
    res.json({
        message: "Posts Works"
    })
);

// @route POST api/posts
// @desc Create post
// @access Private
router.post(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const {
            errors,
            isValid
        } = validatePostInput(req.body);

        // check validation
        if (!isValid) {
            // if any errors send 400 with errors object
            return res.status(400).json(errors);
        }
        const newPost = {
            user_id: req.user.id,
            text: req.body.text,
            name: req.body.name,
            avatar: req.body.avatar,
            like_id: req.body.like_id,
            comment_id: req.body.comment_id
        };
        Post.create(newPost)
            .then(post => res.json(post))
            .catch(err => {
                res.status(404).json(err);
            });
    }
);

// @route GET api/posts
// @desc get all posts
// @access public
router.get("/", (req, res) => {
    Post.findAll()
        .then(posts => {
            if (!posts) {
                res.json({
                    message: "There are no posts"
                });
            }
            res.json(posts);
        })
        .catch(err => {
            res.status(404).json(err);
        });
});

// @route GET api/posts/:id
// @desc get post by id
// @access public
router.get("/:id", (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            }
        })
        .then(post => {
            if (!post) {
                res.json({
                    message: "The post does not exist"
                });
            }
            res.json(post);
        })
        .catch(err => {
            res.status(404).json(err);
        });
});

// @route DELETE api/posts/:id
// @desc delete post by id
// @access private
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
            where: {
                user_id: req.user.id
            }
        }).then(profile => {
            Post.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                .then(post => {
                    // check post owner
                    if (post.user_id !== req.user.id) {
                        return res.status(401).json({
                            message: "User not authorized"
                        });
                    }
                    // delete
                    Post.destroy({
                            where: {
                                id: req.params.id
                            }
                        })
                        .then(() => {
                            res.json({
                                message: "Post deleted successfully"
                            });
                        })
                        .catch(err => {
                            res.status(400).json(err);
                        });
                })
                .catch(err => {
                    res.status(400).json({
                        message: "Post not found"
                    });
                });
        });
    }
);

// @route POST api/posts/like/:id
// @desc like post by id
// @access private
router.post(
    "/like/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
            where: {
                user_id: req.user.id
            }
        }).then(profile => {
            Post.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                .then(post => {
                    Like.findOne({
                            where: {
                                user_id: req.user.id
                            }
                        })
                        .then(like => {
                            if (!like) {
                                Like.create({
                                        user_id: req.user.id,
                                        post_id: post.id
                                    })
                                    .then(createdLike => {
                                        res.json(createdLike);
                                    })
                                    .catch(err => {
                                        res.status(400).json(err);
                                    });
                            } else {
                                Like.destroy({
                                        where: {
                                            id: like.id
                                        }
                                    })
                                    .then(() => {
                                        res.json({
                                            dislike: "disliked"
                                        });
                                    })
                                    .catch(err => {
                                        res.status(404).json(err);
                                    });
                            }
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(404).json(err);
                        });
                })
                .catch(err =>
                    res.status(404).json({
                        postnotfound: "No post found"
                    })
                );
        });
    }
);

// @route GET api/posts/likes/all
// @desc get all likes
// @access public
router.get("/likes/all", (req, res) => {
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


// @route POST api/posts/comment/:id
// @desc comment on a post by id
// @access private
router.post(
    "/comment/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
            where: {
                user_id: req.user.id
            }
        }).then(profile => {
            Post.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                .then(post => {
                    Comment.create({
                            user_id: req.user.id,
                            post_id: post.id,
                            text: req.body.text,
                            name: req.user.name,
                            avatar: req.user.avatar
                        })
                        .then(comment => {
                            res.json(comment)
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(404).json(err);
                        });
                })
                .catch(err =>
                    res.status(404).json({
                        commenterror: "Cannot comment on the post"
                    })
                );
        });
    }
);

// @route GET api/posts/comments/all
// @desc get all comments
// @access public
router.get("/comments/all", (req, res) => {
    Comment.findAll()
        .then(comments => {
            if (!comments) {
                res.json({
                    message: "There are no comments"
                });
            }
            res.json(comments);
        })
        .catch(err => {
            res.status(404).json(err);
        });
});


// @route DELETE api/posts/comment/:id
// @desc delete a comment
// @access private
router.delete(
    "/comment/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
            where: {
                user_id: req.user.id
            }
        }).then(profile => {
            Comment.findOne({
                    where: {
                        id: req.params.id
                    }
                })
                .then(comment => {
                    Comment.destroy({
                            where: {
                                id: comment.id
                            }
                        })
                        .then(() => {
                            res.json({
                                message: 'comment deleted'
                            })
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(404).json(err);
                        });
                })
                .catch(err =>
                    res.status(404).json({
                        commenterror: "Cannot delete comment"
                    })
                );
        });
    }
);

module.exports = router;