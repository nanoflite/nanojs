.PHONY: docs

docs:
	 node ./autodocs/gendocs.js
	 npx prettier ./autodocs/build --write
