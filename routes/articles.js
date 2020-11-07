const articles = require('express').Router();

const {
  getArticles,
  saveArticle,
  deleteArticle,
} = require('../controllers/articles');

const {
  saveArticleValidation,
  deleteArticleValidation,
} = require('../celebrateValidation/articles');

articles.get('/articles', getArticles);

articles.post('/articles', saveArticleValidation, saveArticle);

articles.delete('/articles/:articleId', deleteArticleValidation, deleteArticle);

module.exports = articles;
