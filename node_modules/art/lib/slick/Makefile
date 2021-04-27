MODULES = 'Source/Slick.Parser.js' \
	'Source/Slick.Finder.js'

FILE = 'slick.js'


test: setup kill_servers
	@python -m SimpleHTTPServer 7777 &> /dev/null &
	@open http://localhost:7777/SlickSpec/Runner/runner.html

kill_servers:
	@ps aux | grep "SimpleHTTPServer 7777" | grep -v grep | awk '{ print $$2 }' | xargs kill -9 &> /dev/null

setup:
	@git submodule update --init --recursive

build:
	@cat ${MODULES} > ${FILE}

