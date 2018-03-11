#!/bin/bash

set -e

if [[ -z "$1" ]]
then
  echo "No arguments supplied!"
  echo "Please specified expo versions..."
  versions=`ls -l ~/.expo/ios-simulator-app-cache | rev | cut -d' ' -f 1 | rev | grep Exponent | cut -d'-' -f 2 | tr ap " "`
  echo "${versions}"
  exit 1
fi

rm -rf e2e/Exponent-*.app
DEST="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )/../e2e/"
EXPO_APP_PATH="$HOME/.expo/ios-simulator-app-cache/Exponent-$1.app"

echo "Copy file from $EXPO_APP_PATH to $DEST"

cp -r $EXPO_APP_PATH $DEST

exit 0