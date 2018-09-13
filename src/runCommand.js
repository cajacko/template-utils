import spawn from 'react-dev-utils/crossSpawn';

const runCommand = (command, cwd = process.cwd(), optsArg = {}) =>
  new Promise((resolve, reject) => {
    try {
      const commands = command.split(' ').filter(string => string !== '');
      const firstCommand = commands.splice(0, 1)[0];

      process.chdir(cwd);

      const {
        noLog, logError, onData, getKill, ...opts
      } = optsArg;

      let stdio;

      if (onData) {
        stdio = undefined;
      } else if (noLog) {
        stdio = 'ignore';
      } else {
        stdio = 'inherit';
      }

      const options = Object.assign({ stdio }, opts);

      if (!options.cwd) {
        options.cwd = cwd;
      }

      const ls = spawn(firstCommand, commands, options);

      if (getKill) {
        getKill(() => {
          resolve();
          ls.kill();
        });
      }

      if (onData) {
        ls.stdout.on('data', (string) => {
          onData(string);
        });
      }

      ls.on('error', (e) => {
        if (logError !== false) {
          console.error(`runCommand error for "${command}"\nIn "${cwd}"`);
          console.error(e);
        }
      });

      ls.on('close', (code) => {
        if (code) {
          reject(new Error(`runCommand rejected for "${command}"\nIn "${cwd}"\n child process exited with code ${code}\nCheck logs for more info`));
        } else {
          resolve();
        }
      });
    } catch (e) {
      reject(e);
    }
  });

export default runCommand;
