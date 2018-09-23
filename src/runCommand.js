import spawn from 'react-dev-utils/crossSpawn';
import { join } from 'path';
import logger from './logger';

let id = 0;

const all = {};

export const killAll = (shouldResolve) => {
  Object.keys(all).forEach((key) => {
    all[key](shouldResolve);
  });
};

const runCommand = (command, ...args) =>
  new Promise((resolve, reject) => {
    let optsArg = {};
    let cwd = process.cwd();

    if (args[0]) {
      if (typeof args[0] === 'object') {
        [optsArg] = args;
      } else if (typeof args[0] === 'string') {
        [cwd] = args;

        if (typeof args[1] === 'object') {
          [, optsArg] = args;
        }
      }
    }

    const logs = [];

    const logLogs = () => {
      logs.forEach(({ type, message }) => {
        const log = type === 'error' ? logger.error : logger.debug;

        log(`child log: ${message}`, undefined, { stdout: true });
      });
    };

    const thisID = id;
    id += 1;

    try {
      const {
        noLog,
        logError,
        onData,
        getKill,
        vars,
        withNVM,
        ...opts
      } = optsArg;

      const commands = command
        .split(' ')
        .filter(string => string !== '')
        .map((item) => {
          if (!vars) return item;

          return vars[item] || item;
        });

      if (withNVM) {
        commands.unshift(withNVM);
        commands.unshift(`${join(__dirname, '../scripts/loadWithNVM.sh')}`);
      }

      const firstCommand = commands.splice(0, 1)[0];

      process.chdir(cwd);

      let stdio;

      if (onData || noLog) {
        stdio = undefined;
      } else {
        stdio = 'inherit';
      }

      const options = Object.assign({ stdio, env: process.env }, opts);

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

      if (stdio === undefined) {
        ls.stdout.on('data', (string) => {
          logs.push({ type: 'log', message: String(string) });
          if (onData) onData(string);
        });

        ls.stderr.on('data', (string) => {
          logs.push({ type: 'error', message: String(string) });
          if (onData) onData(string);
        });
      }

      ls.on('error', (e) => {
        if (logError !== false) {
          logger.error(`runCommand error for "${command}"\nIn "${cwd}"`);
          logger.error(e);
        }
      });

      ls.on('close', (code) => {
        delete all[thisID];

        if (code) {
          logLogs();
          reject(new Error(`runCommand rejected for "${command}"\nIn "${cwd}"\n child process exited with code ${code}\nCheck logs for more info`));
        } else {
          resolve();
        }
      });
    } catch (e) {
      logLogs();
      delete all[thisID];
      reject(e);
    }
  });

export default runCommand;
