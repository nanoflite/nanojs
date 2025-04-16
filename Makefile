.PHONY: docs cdn

docs:
	 node ./autodocs/gendocs.js
	 npx prettier ./autodocs/build --write

cdn:
	npm run build
	git checkout cdn
	git pull
	git add dist/nanojs.mjs dist/nano.css
	git commit -m 'Update CDN build'
	git push
	git checkout main