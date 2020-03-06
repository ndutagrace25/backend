const express = require("express");
const sequelize = require("sequelize");
const Op = sequelize.Op;
const router = express.Router();
const passport = require("passport");

// Load Profile Model
const Profile = require("../../models").Profile;

// load Input validation
const validateProfileInput = require('../../validation/profile');


// Load User Model
const User = require("../../models").User;

// Load Skills
const Skill = require("../../models").Skill;

// @route GET api/profile/test
// @desc Tests profile route
// @access Public
router.get("/test", (req, res) =>
    res.json({
        message: "Profile Works"
    })
);

// @route GET api/profile/
// @desc Get current users profile
// @access Private
router.get(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const errors = {};
        Profile.findOne({
                atrributes: [
                    "id",
                    "user_id",
                    "handle",
                    "company",
                    "website",
                    "location",
                    "status",
                    "skill_id",
                    "bio",
                    "experience",
                    "githubusername",
                    [sequelize.col('user.name'), 'user_name'],
                    [sequelize.col('skill.skill_name'), 'skill_name']
                ],
                // raw: true,
                where: {
                    user_id: req.user.id
                },
                include: [{
                        model: User,
                        as: 'user',
                        atrributes: []
                    },
                    {
                        model: Skill,
                        as: 'skill',
                        atrributes: ['skill_name']
                    }
                ]
            })
            .then(profile => {
                if (!profile) {
                    errors.noprofile = "There is no profile for this user";
                    return res.status(404).json(errors);
                }
                res.json(profile);
            })
            .catch(err => res.status(404).json(err));
    }
);

// @route GET api/profile/handle/:handle
// @desc Get profile by hundle
// @access Public
router.get('/handle/:handle', (req, res) => {
    const errors = {};
    Profile.findOne({
        where: {
            handle: req.params.handle
        },
        include: [{
            model: User,
            as: 'user',
            atrributes: ['name', 'avatar']
        }]
    }).then(profile => {
        if (!profile) {
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        }
        res.json(profile);
    }).catch(err => {
        res.status(404).json(err);
    })
});

// @route GET api/profile/user/:user_id
// @desc Get profile by user id
// @access Public
router.get('/user/:user_id', (req, res) => {
    const errors = {};
    Profile.findOne({
        where: {
            user_id: req.params.user_id
        },
        include: [{
            model: User,
            as: 'user',
            atrributes: ['name', 'avatar']
        }]
    }).then(userProfile => {
        if (!userProfile) {
            errors.noprofile = 'There is no profile for this user';
            res.status(404).json(errors);
        }
        res.json(userProfile);
    }).catch(err => {
        res.status(404).json(err);
    })
});

// @route GET api/profile/profiles
// @desc Get all profiles
// @access Public
router.get('/all', (req, res) => {
    const errors = {};
    Profile.findAll({
        include: [{
            model: User,
            as: 'user',
            atrributes: ['name', 'avatar']
        }]
    }).then(profiles => {
        if (!profiles) {
            errors.noprofile = 'No profiles found';
            res.status(404).json(errors);
        }
        res.json(profiles);
    }).catch(err => {
        res.status(404).json(err);
    })
});

// @route GET api/profile/skills
// @desc Get all skills
// @access Public
router.get('/skills', (req, res) => {
    const errors = {};
    Skill.findAll().then(skills => {
        if (!skills) {
            errors.noskills = 'No skills found';
            res.status(404).json(errors);
        }
        res.json(skills);
    }).catch(err => {
        console.log(err)
        res.status(404).json(err);
    })
});



// @route POST api/profile
// @desc Create users profile
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
        } = validateProfileInput(req.body);
        if (!isValid) {
            // retun any errors with 400 status
            return res.status(400).json(errors);
        }

        // Get fields
        const profileFields = {};
        profileFields.user_id = req.user.id;
        if (req.body.handle) profileFields.handle = req.body.handle;
        if (req.body.company) profileFields.company = req.body.company;
        if (req.body.website) profileFields.website = req.body.website;
        if (req.body.location) profileFields.location = req.body.location;
        if (req.body.status) profileFields.status = req.body.status;
        if (req.body.skill_id) profileFields.skill_id = req.body.skill_id;
        if (req.body.bio) profileFields.bio = req.body.bio;
        if (req.body.experience) profileFields.experience = req.body.experience;
        if (req.body.githubusername)
            profileFields.githubusername = req.body.githubusername;

        Profile.findOne({
            where: {
                user_id: req.user.id
            }
        }).then(profile => {
            if (profile) {
                // update
                Profile.update(profileFields, {
                    where: {
                        id: profile.id
                    }
                }).then(profile => res.json(profile));
            } else {
                // create
                // Check if handle exists
                Profile.findOne({
                    where: {
                        handle: profileFields.handle
                    }
                }).then(profile => {
                    if (profile) {
                        errors.handle = "That handle already exists";
                        res.status(400).json(errors);
                    }

                    // Save profile
                    Profile.create(profileFields).then(profile => {
                        res.json(profile);
                    });
                });
            }
        });
    }
);

// @route DELETE api/profile
// @desc delete user and profile
// @access Private
router.delete('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.destroy({
        where: {
            user_id: req.user.id
        }
    }).then(() => {
        User.destroy({
            where: {
                id: req.user.id
            }
        }).then(() => {
            res.json({
                message: 'Profile deleted successful'
            })
        }).catch(err => {
            res.status(404).json(err);
        })

    }).catch(err => {
        res.status(404).json(err);
    })
})

module.exports = router;