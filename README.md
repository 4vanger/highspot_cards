## Building and running

`npm install` to install dependencies.
`npm start` to run an app in dev mode locally
`npm run build` to build app into `build/` folder so it could be uploaded and served from Web server.

## Considerations

Per requirements loading indicator is displayed in bottom-left corner while data is fetched. It is rather small to not distract user from using the app. Instead I've added a generous threshold for infinite scroll so hopefully user will never see cards loading.
When searching app will first display filtered data from already fetched results for the sake of better user experience. Fetched data will be cached to display faster when search is cleared.

## Future development, TODOs and known bugs

Add Jest unit test per component.
E2E testing seems really excessive in this case but Selenium is always our friend.
`findDOMNode is deprecated in StrictMode.` error in console is a [recent react-bootstrap bug](https://github.com/react-bootstrap/react-bootstrap/issues/5075). Should be fixed in upcoming versions.
Run A/B experiment to find optimal values for constants in `CardsList`
