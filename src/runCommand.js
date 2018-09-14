import spawn from 'react-dev-utils/crossSpawn';

let id = 0;

const all = {};

export const killAll = (shouldResolve) => {
  Object.keys(all).forEach((key) => {
    all[key](shouldResolve);
  });
};

const runCommand = (command, cwd = process.cwd(), optsArg = {}) =>
  new Promise((resolve, reject) => {
    const thisID = id;
    id += 1;

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

      const kill = (rejectError) => {
        ls.kill();
        delete all[thisID];

        if (rejectError) {
          reject(rejectError);
        } else {
          resolve();
        }
      };

      all[thisID] = (shouldResolve) => {
        kill(shouldResolve ? null : new Error('Force killed all runCommands'));
      };

      if (getKill) {
        getKill(() => {
          kill();
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
        delete all[thisID];

        if (code) {
          reject(new Error(`runCommand rejected for "${command}"\nIn "${cwd}"\n child process exited with code ${code}\nCheck logs for more info`));
        } else {
          resolve();
        }
      });
    } catch (e) {
      delete all[thisID];
      reject(e);
    }
  });

export default runCommand;
