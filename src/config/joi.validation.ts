

import * as	 Joi from 'joi';

export const joiValidationSchema = Joi.object({
    PORT_APP:     Joi.number().required(),
    DB_PORT:      Joi.number().required(),
    DB_PASSWORD:  Joi.string().required(),
    DB_NAME:      Joi.string().required(),
    DB_HOST:      Joi.string().required(),
    DB_USERNAME:  Joi.string().required(),
    JWT_SECRET:   Joi.string().required(),
    API_KEY_TMDB: Joi.string().required(),
});