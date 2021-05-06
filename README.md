Informational
=============
Authors: Rich Goluszka, Bryan Gabe, Juan Moncada  
Last Updated: 5/5/2021  
Project: Deadline Web Service (RedDragons Final Project)

Originiality
============
Nearly all of the code in this project is our own, excluding the following aspects which we 
cannot take credit for:

CORS
----
The front-end (written in React) interacts with the logic-tier (written in Go) using JavaScript 
fetch() requests. We found some very helpful information about accessing RESTful web APIs and 
CORS from https://flaviocopes.com/golang-enable-cors/, and all credit goes to them for the 
/req-tasks API fetch request on the front-end and the /req-tasks HTTP handler in the logic-tier.

React-Sound
-----------
Although our project did not implement sound within the React app, we did intend to. We ran into 
some issues trying to troubleshoot it and the gloriousKenobis scrum team was kind enough to give 
us access their Mosaic v2 project which did use sound. As mentioned, we ran out of time before 
implementing sound, so we did not use any of their code, but we wished to thank them for their 
willingness to help us.

Sources
=======
The front-end of this webapp is currently hosted on Azure at 
https://lively-rock-0b79e3a10.azurestaticapps.net/, and the source code is available at 
https://github.com/RichGol/ReactDeadline/.  
The logic-tier of this webapp is currently hosted on Azure within a Docker container, and the 
source code is available at https://github.com/BryanGabe00/deadline-web-app-backend/.  
The database of this webapp is MongoDB Atlas, whose website is https://cloud.mongodb.com/, 
although the database is not publicly-accessible.

Build / Execute / Dependency
============================
Required files
--------------
Everything required for the front-end is available from the ReactDeadline GitHub repository. 
Everything required for the logic-tier is available from the deadline-web-app-backend GitHub 
repository.

Build Instructions
------------------
To prepare to run the React front-end locally:
1. Open a terminal
2. Navigate to the directory containing `yarn.lock`
3. Run `yarn`
_Note: To interact with the Go logic-tier, you WILL need to comment-out lines 62, 114, 132,_
_144, 161 and uncomment lines 60, 112, 130, 142, 159 in `src/App.js`._

To prepare to run the Go logic-tier locally:
1. Open a terminal
2. Navigate to your GOROOT path (it should look like `../Go/src/`)
3. Clone the deadline-web-app-backend repository into the current directory or a subdirectory

Execution Instructions
----------------------
To run the React front-end locally:
1. Open a terminal
2. Navigate to the directory containing `yarn.lock`
3. Run `yarn start`

To run the Go logic-tier locally:
1. Open a terminal
2. Navigate to `../Go/src/deadline-web-app-backend`
3. Run `go run deadline-backend.go`

# ReactBasic

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
