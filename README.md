# generator-iservices (BETA)

## Overview
This package is a generator used with the [Yeoman](http://yeoman.io/) application.  
It can be used to generate different kinds of iServices projects.

## Guide

To get started you will first need to install the Yeoman application if you haven't already.  To install Yeoman run the following
from a terminal.

```
npm install -g yo
```

After you have Yeoman installed you will need to install this package that will be run with Yeoman.
To install this package run the following from a terminal.

```
npm install -g generator-iservices
```

Now that everything has been installed you are ready to create a new iServices project.
The first thing you need to do is create an empty folder that will contain your new project.
From within this newly created folder run the following to start the script that will
walk you through creating a new project.

```
yo iservices
```

The script will ask you for a name and description to give your project.
This will set the name and description in your package.json file of your project.

Next you will be prompted for the type of project you want to create.  
The options right now are as follows.

- `app server` - This is the default and if chosen it will create a project with all the basic configurations
needed for a server that will run server side code as well as serve up client side code for browsers.

- `api server` - This option builds a project that will only run server side code and is intended for servers
that will provide api type interfaces.

- `custom` - This option lets you pick and choose the components to include in your project.  A list of the 
components and their descriptions appears futher on in this document.

Additionaly you can choose to include [Bootstrap](http://getbootstrap.com/) and [FontAwesome](https://fortawesome.github.io/Font-Awesome/) libraries with your project if you
choose the app server option or the asset and style options from the custom menu.

After you have finished selecting all of your options, the necessary project files will be created and `npm install`
will be run for your project to install any required dependencies.  Once this is done your project is ready.

The package.json file that is created for the project includes several useful scripts that can be run using npm.
The following describes the command to execute from the terminal as well as what it does.

- `npm test` - This will execute unit tests within your project and print the results along with a code coverage report to the console.

- `npm run build` - This executes all of the defined build steps in your project.  It is run after every install of your package.

- `npm run watch` - This is a long running task that will listen for changes to files in your project and perform builds when those files change.

## Project Structure

Regardless of which options you choose, the following files and folders will always be created for your project.

- `package.json` - A package.json file with all necessary dependencies defined.

- `gulpfile.js` - [Gulp](http://gulpjs.com/) is used for the build system and this is the main file used to define all of the build tasks that will be run using Gulp.

- `index.js` - The entry point for the server.  It simply prints output to the console.  It's up to you to change this to do something useful.

- `README.md` - A readme file which has a TODO written in it.  It's up to you to update this with meaningful documentation about the project.

- `.gitignore` - If you plan to store this project in a [Git](https://git-scm.com/) repository then this file is useful for defining things to exclude.  
It has all of the possible build outputs defined in it that you would not want to include in source control.

- `.slugignore` - This file defines the parts of the project you would not want to include in a [Heroku](https://www.heroku.com/) slug.

- `src/` - This folder is created for you and is inteded to house any and all code and resources for your project.

### Project Components 

A project is made up of the following optional components which may or many not be installed based on your selections.

If you selected the app server option then all of the components are included.  If you selected the api server option then only
the lint, test, and transform components are included.  The custom option lets you pick and choose the components that will be included.

- `asset` - Used to manage static resources for the project and is implemented using the [build-asset](https://www.npmjs.com/package/build-asset) package.
This component will copy any files and folders found in the src/public/ folder of the project to the dist/*version*/public/ folder where *version* corresponds to the version number defined in the package.json file.
This component can be executed individually with the `gulp asset` terminal command or it will be executed as part of the `npm run build` terminal command.

- `bundle` - Bundles client code that will be downloaded by client browsers.  The [build-bundle](https://www.npmjs.com/package/build-bundle) package is used to perform the bundling.
Any code files found in the src/apps/ folder or any of it's sub folders will be bundled up and output to the dist/*version* and dist/packages/ folders where *version* corresponds to the version number defined in the package.json file.
This component can be executed individually with the `gulp bundle` terminal command or it will be executed as part of the `npm run build` terminal command. 

- `lint` - Adds linting functionality with the [build-lint](https://www.npmjs.com/package/build-lint) package.  A .eslintrc file is created within the root folder of the project and any 
files with an extension of .js found in the src/ folder or any of it's sub folders excluding src/public/ and src/styles/ will be linted with the `gulp lint` terminal command.

- `style` - Compiles [Sass](http://sass-lang.com/) files for the project.  Any files with an extension of .scss found in the src/styles/ folder will be compiled
and output to the dist/*version*/styles folder where *version* corresponds to the version number defined in the package.json file.
This component can be executed individually with the `gulp style` terminal command or it will be executed as part of the `npm run build` terminal command.

- `test` - Runs mocha unit test, code coverage reports, and prints output to the console using the [build-test](https://www.npmjs.com/package/build-test) package.
If the transform component is being used then mocha unit tests are loaded from the lib/tests/ folder and code coverage reports are generated for code found in the lib/ folder excluding the lib/tests/ folder.
If the transform component is not being used then mocha unit tests are loaded from the src/tests/ folder and code coverage reports are generated for code found in the src/ folder excluding the src/tests/, src/styles, and src/public folders.
This component can be executed individually with the `npm test` terminal command.  If you want to run just the unit tests and not the code coverage report you can execute the `gulp test-without-coverage` terminal command.

- `transform` - Transforms ECMAScript 6 compliant javascript code to ECMAScript 5 compliant javascript code using the [build-transform](https://www.npmjs.com/package/build-transform) package.
All files with an extension of .js or .jsx found in the src/ folder or any sub folder excluding src/styles and src/public will be transformed and output to the lib/ folder
This component can be executed individually with the `gulp transform` terminal command or it will be executed as part of the `npm run build` terminal command.



