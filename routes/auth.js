const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { createUser, loginUser, revalidToken} = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

router.post(
    '/new',
    [//middlewares
        check('name','Name is required').not().isEmpty(),
        check('email','Email is required').isEmail(),
        check('password','Password must have 6 letters').isLength({ min: 6 }),
        validateFields
    ]
    , 
    createUser);

router.post(
    '/',
    [
        check('email','Email is required').isEmail(),
        check('password','Password must have 6 letters').isLength({ min: 6 }),
        validateFields
    ],
    loginUser) 

router.get(
    '/renew',
    [
        validateJWT
    ],
    revalidToken) 

module.exports = router;