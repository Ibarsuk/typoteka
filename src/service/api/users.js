"use strict";

const {Router} = require(`express`);

const {StatusCode} = require(`../../const`);
const errorMessages = require(`../../utils/error-messages`);
const hash = require(`../../utils/hash`);
const jwt = require(`../../utils/jwt`);

const validateNewUser = require(`../middlewares/validation/validateNewUser`);
const validateBody = require(`../middlewares/validation/validateBody`);
const {loginSchema} = require(`../validationSchemas/user`);

const route = new Router();

module.exports = (app, usersService, tokensService) => {
  app.use(`/users`, route);

  route.post(`/`, validateNewUser(usersService), async (req, res) => {
    const isUserCreated = !!(await usersService.create(req.body));
    return res.status(StatusCode.CREATED).send(isUserCreated);
  });

  route.post(`/auth`, validateBody(loginSchema), async (req, res) => {
    const {email, password} = req.body;

    const user = await usersService.findByEmail(email);

    if (!user) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .send(errorMessages.user.userNotExists);
    }

    const isPasswordCorrect = await hash.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res
        .status(StatusCode.BAD_REQUEST)
        .send(errorMessages.user.wrongPassword);
    }

    const tokens = await tokensService.create(user.id, {id: user.id});

    return res.status(StatusCode.OK).json(tokens);
  });

  route.post(`/refresh`, async (req, res) => {
    let userData;

    try {
      userData = jwt.verify(req.body.token, process.env.JWT_REFRESH_SECRET);
    } catch (e) {
      return res.sendStatus(StatusCode.UNAUTHORIZED);
    }

    const tokens = await tokensService.create(userData.id, {id: userData.id});
    return res.status(StatusCode.OK).json(tokens);
  });
};