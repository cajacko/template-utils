// @flow

import inquirer from 'inquirer';

const ask = questions => inquirer.prompt(questions);

const wrapSingleAsk = (questions) => {
  if (Array.isArray(questions)) return ask(questions);

  const question = Object.assign({}, questions);

  question.name = 'answer';

  return ask([question]).then(answers => answers[question.name]);
};

export default wrapSingleAsk;
