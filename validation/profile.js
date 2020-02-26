const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
    let errors = {};

    data.handle = !isEmpty(data.handle) ? data.handle : '';
    data.status = !isEmpty(data.status) ? data.status : '';
    data.skill_id = !isEmpty(data.skill_id) ? data.skill_id : '';


    if (!Validator.isLength(data.handle, {min: 2, max: 40})) {
        errors.handle = 'Handle must be at least 2 characters';
    }

    if (Validator.isEmpty(data.handle)) {
        errors.handle = 'Profile handle field is required';
    }

    if (Validator.isEmpty(data.status)) {
        errors.status = 'Status field is required';
    }
    
    if (Validator.isEmpty(data.skill_id)) {
        errors.skill_id = 'Skill field is required';
    }

    if(!isEmpty(data.website)){
        if(!Validator.isURL(data.website)){
            errors.website = 'Not a valid URL';
        }
    }
    
    return {
        errors,
        isValid: isEmpty(errors)
    }
}