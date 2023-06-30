const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require("../controllers/events");
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validate-fields');
const { isDate } = require('../helpers/isDate');

//All use validate jwt, in other words, all request are using this validateJWT
router.use(validateJWT)

// get events
router.get(
    '/', 
    // validateJWT 
    getEvents);

//create a new event
router.post(
    '/', 
    [
        check('title','Title is required').not().isEmpty(),
        check('start','start date is required').custom( isDate ),
        check('end','end date is required').custom( isDate ),

        validateFields
    ],
    createEvent);

//updateEvent
router.put('/:id', updateEvent);

//DeleteEvent
router.delete('/:id', deleteEvent);

module.exports = router;