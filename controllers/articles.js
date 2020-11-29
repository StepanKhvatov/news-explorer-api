const ArticleSchema = require('../models/article');
const NotFoundError = require('../errors/NotFoundError(404)');
const ForbiddenError = require('../errors/ForbiddenError(403)');

const getArticles = (req, res, next) => {
  ArticleSchema.find({ owner: req.user._id })
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

const saveArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;

  const owner = req.user._id;

  ArticleSchema.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner,
  })
    .then((article) => res.send({ data: article }))
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  ArticleSchema.findOne({ _id: req.params.articleId }).select('+owner')
    .orFail(() => { throw new NotFoundError('Нет карточки с таким id'); })
    .then((article) => {
      if (`${article.owner}` !== `${req.user._id}`) { // ага, при сравнении id использовать шаблонные строки
        throw new ForbiddenError('У вас не прав для удаления статьи');
      }
      ArticleSchema.findByIdAndRemove(req.params.articleId)
        .orFail(() => { throw new NotFoundError('Нет статьи с таким id'); })
        .then((deletedArticle) => {
          res.send({ data: deletedArticle });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getArticles,
  saveArticle,
  deleteArticle,
};
