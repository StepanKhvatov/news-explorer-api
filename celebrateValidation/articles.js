const { celebrate, Joi } = require('celebrate');
const { urlRegex } = require('../utils/constants');

module.exports.saveArticleValidation = celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(60),
    text: Joi.string().required().min(2),
    date: Joi.date(),
    source: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(urlRegex),
    image: Joi.string().required().regex(urlRegex),
  }),
});

module.exports.deleteArticleValidation = celebrate({
  params: Joi.object().keys({
    articleId: Joi.string().hex().length(24),
  }),
});
