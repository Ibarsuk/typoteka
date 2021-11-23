"use strict";

const chalk = require(`chalk`);

const {readContentByLines, writeToTextFile} = require(`../../../utils/fs`);
const {
  MOCK_NOTES_FILE_NAME,
  MOCK_COMMENTS_FILE_NAME,
  MockСomprisingPath,
} = require(`../../../const`);
const {getMockData} = require(`./mockNotes`);

const DEFAULT_NOTES_NUMBER = 1;
const MAX_NOTES_NUMBER = 1000;

const run = async (args) => {
  const notesNum = +args[0] || DEFAULT_NOTES_NUMBER;

  if (notesNum > MAX_NOTES_NUMBER) {
    throw new Error(chalk.red(`Can't be more than ${MAX_NOTES_NUMBER} notes`));
  }

  const [categories, sentences, titles, commentSentences, photos] = await Promise.all([
    readContentByLines(MockСomprisingPath.CATEGORIES),
    readContentByLines(MockСomprisingPath.SENTENCES),
    readContentByLines(MockСomprisingPath.TITLES),
    readContentByLines(MockСomprisingPath.COMMENT_SENTENCES),
    readContentByLines(MockСomprisingPath.PHOTOS),
  ]);

  const {notes, comments} = getMockData(
      notesNum,
      {categories, sentences, titles, commentSentences, photos}
  );

  await Promise.all([
    writeToTextFile(MOCK_NOTES_FILE_NAME, notes),
    writeToTextFile(MOCK_COMMENTS_FILE_NAME, comments),
  ]);
};

module.exports = {
  name: `--generate`,
  run,
};
