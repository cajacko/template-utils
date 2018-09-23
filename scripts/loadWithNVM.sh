#!/bin/bash

if [ -d "$NVM_DIR" ]
then
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
  nvm use $1
fi

echo "${@:2}"

${@:2}
