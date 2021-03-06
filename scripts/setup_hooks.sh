#!/bin/bash

SCRIPTS_DIR="scripts"
HOOKS_DIR="scripts/hooks"

current_directory=${PWD##*/}

if [ $current_directory = $SCRIPTS_DIR ]
then
    cd ../
fi

hooks=($(ls scripts/hooks/ | sed 's/\.sh//'))

for i in "${hooks[@]}"
do
    chmod +x $HOOKS_DIR/$i.sh
    echo "Symlinking $i..."
    ln -s -f ../../scripts/hooks/$i.sh .git/hooks/$i
done
