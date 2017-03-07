#!/bin/bash

RED='\033[1;31m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
PINK='\033[1;35m'
NC='\033[0m'

read -r -d '' Banner <<EOF
${BLUE}########  ######## ${GREEN} ######     ###    ${RED}##       ########  ${PINK} #######  ##     ##
${BLUE}##     ## ##       ${GREEN}##    ##   ## ##   ${RED}##       ##     ## ${PINK}##     ##  ##   ##
${BLUE}##     ## ##       ${GREEN}##        ##   ##  ${RED}##       ##     ## ${PINK}##     ##   ## ##
${BLUE}########  ######   ${GREEN}##       ##     ## ${RED}##       ########  ${PINK}##     ##    ###
${BLUE}##   ##   ##       ${GREEN}##       ######### ${RED}##       ##     ## ${PINK}##     ##   ## ##
${BLUE}##    ##  ##       ${GREEN}##    ## ##     ## ${RED}##       ##     ## ${PINK}##     ##  ##   ##
${BLUE}##     ## ######## ${GREEN} ######  ##     ## ${RED}######## ########  ${PINK} #######  ##     ##${NC}
EOF

echo -e "$Banner"
echo

echo -e "${YELLOW}Compiling ${BLUE}re${GREEN}ca${RED}lb${PINK}ox${YELLOW} - web manager${NC}"
echo

echo -e "${BLUE}Installing building dependencies...${NC}"
npm run -s installboth

echo -e "${BLUE}Building sources ${RED}(be patient!)${BLUE}...${NC}"
npm run -s buildboth

echo -e "${BLUE}Copying files into release directory...${NC}"
rm -rf release
mkdir -p release/config
mkdir -p release/client
mkdir -p release/locales

cp -R client/build release/client
find . -type f -name '*.map' -exec rm {} + # removing useless "map files"
cp config/default.js release/config
cp config/production.js release/config
cp -R dist release
cp locales/*.json release/locales
cp package.json release

echo -e "${BLUE}Installing production dependencies...${NC}"
cd release

npm install --production

echo
echo -e "${YELLOW}Compilation done! All you need is inside the release folder!${NC}"
