import { RequestHandler } from "express";
import { check } from "express-validator";
import validatorMiddleware from "../middleware/validatorMiddleware";

export const createContactValidator:RequestHandler[] = [
    check('name')
        .notEmpty().withMessage('name is required')
        .isLength({min:2, max:40}).withMessage('name length must be between 2-10'),

    check('email')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('email must be valid'),
        
    check('phone')
        .notEmpty().withMessage('phone is required')
        .isMobilePhone('ar-EG').withMessage('phone must be valid')

    ,validatorMiddleware
]

export const updateContactValidator:RequestHandler[] = [
    check('name')
        .optional()
        .notEmpty().withMessage('name is required')
        .isLength({min:2, max:40}).withMessage('name length must be between 2-10'),

    check('email')
        .optional()
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('email must be valid'),
        
    check('phone')
        .optional()
        .notEmpty().withMessage('phone is required')
        .isMobilePhone('ar-EG').withMessage('phone must be valid')

    ,validatorMiddleware
]