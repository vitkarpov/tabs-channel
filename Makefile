test:
	node tests/servers.js &
	./node_modules/.bin/phantomjs tests/spec.js
	pkill -f "node tests/servers.js"
