"use strict";

const {Router} = require(`express`);

const {api} = require(`../api`);
const upload = require(`../../utils/multer`);
const {adaptArticleToServer} = require(`../../utils/adapter`);

const articlesRouter = new Router();

articlesRouter.get(`/add`, async (_req, res) => {
  const categories = await api.getCategories();
  res.render(`new-post`, {categories});
});

articlesRouter.post(`/add`, [upload.single(`upload`), adaptArticleToServer], async (req, res) => {
  try {
    await api.createArticle(req.body);
    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`back`);
  }
});

articlesRouter.get(`/:id`, (_req, res) => res.render(`post-detail`));

articlesRouter.get(`/category/:id`, (_req, res) =>
  res.render(`articles-by-category`)
);

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, categories] = await Promise.all([
    api.getArticle(id),
    api.getCategories(),
  ]);
  res.render(`edit-post`, {article, categories});
});

articlesRouter.post(`/edit/:id`, [upload.single(`upload`), adaptArticleToServer], async (req, res) => {
  const {id} = req.params;
  try {
    await api.updateArticle(id, req.body);
    res.redirect(`/my`);
  } catch (err) {
    res.redirect(`back`);
  }
});

module.exports = articlesRouter;
