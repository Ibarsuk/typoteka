DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS articles_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS articles_comments;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
  id VARCHAR(15) PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  avatar VARCHAR(15),
  firstName VARCHAR(30) NOT NULL,
  lastName VARCHAR(30) NOT NULL
);

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  text VARCHAR(1000) NOT NULL,
  createdDate TIMESTAMP NOT NULL,
  userId INTEGER NOT NULL,
  FOREIGN KEY (userId) REFERENCES users (id)
    ON DELETE CASCADE
);

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(250) NOT NULL,
  createdDate TIMESTAMP NOT NULL,
  announce VARCHAR(250) NOT NULL,
  fullText VARCHAR(1000),
  photoId VARCHAR(15)
);

CREATE TABLE articles_categories (
  articleId INTEGER NOT NULL,
  categoryId INTEGER NOT NULL,
  CONSTRAINT articles_categories_pk PRIMARY KEY (articleId, categoryId),
  FOREIGN KEY (articleId) REFERENCES articles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (categoryId) REFERENCES categories (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE TABLE articles_comments (
  articleId INTEGER NOT NULL,
  commentId INTEGER NOT NULL,
  CONSTRAINT articles_comments_pk PRIMARY KEY (articleId, commentId),
  FOREIGN KEY (articleId) REFERENCES articles (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  FOREIGN KEY (commentId) REFERENCES comments (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);