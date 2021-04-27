#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail

MAPPING_DIR=node_modules/jetifier/src
MAPPING_FILE=$MAPPING_DIR/androidx-class-mapping.csv
MAPPING_SED=$MAPPING_DIR/androidx-class-mapping.sed
PROJECT_DIR=node_modules
DIRECTION=forward

W=20

for j in "$@"
do
  case $j in
    -w=*|--workers=*)
      W="${j#*=}"
      shift
      ;;
    -r)
      DIRECTION=reverse
      shift
      ;;
    *)
      # unknown option
      ;;
  esac
done

if [ "${BASH_VERSINFO}" -lt 5 ]; then
  echo "INFO: bash version lower than 5.x. Performance is better with 5.x"
fi

rm -f $MAPPING_SED
echo "Creating new sed command from $MAPPING_FILE"
while IFS=, read -r from to
do
  if [ "$DIRECTION" == "forward" ]; then
    echo "s/$from/$to/g;" >> $MAPPING_SED
  else
    echo "s/$to/$from/g;" >> $MAPPING_SED
  fi
done <<< "$(cat $MAPPING_FILE)"

# renderscript needs conversion, but is not an official conversion, add it
if [ "$DIRECTION" == "forward" ]; then
  echo "s/android.support.v8.renderscript/android.renderscript/g;" >> $MAPPING_SED
else
  echo "s/android.renderscript/android.support.v8.renderscript/g;" >> $MAPPING_SED
fi

echo "Command file for sed ready. Searching for files to $DIRECTION-jetify..."

jetify() {
  echo "$DIRECTION-jetifying file $1"
  sed -i".bak" -f $MAPPING_SED $FILE
  rm -f "$FILE.bak"
}

for FILE in `find $PROJECT_DIR \( -name "*.java" -o -name "*.kt" -o -name "*.xml" \) -type f -not -path '*/\.git*' ! -path "*/android/app/build/*" ! -path "*/android/build/*"`; do
  (
  jetify $FILE
  ) &
  if [[ $(jobs -r -p | wc -l) -gt $W ]]; then
    # If bash is 4.3 or greater, do a fancy wait
    if [ "${BASH_VERSINFO}" -lt 5 ]; then
      wait
    else
      wait -n
    fi
  fi
done
