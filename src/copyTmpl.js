import ejs from 'ejs';
import { readFile, writeFile, ensureFile } from 'fs-extra';

const copyTmpl = (path, dest, variables = {}) =>
  readFile(path).then((contents) => {
    const template = ejs.compile(contents.toString());

    const finalContents = template(variables);

    return ensureFile(dest).then(() => writeFile(dest, finalContents));
  });

export default copyTmpl;
