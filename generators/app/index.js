'use strict';

const generators = require('yeoman-generator');
const fs = require('fs');

module.exports = generators.Base.extend({

  // introduction prompt
  initializing: function () {
    this.log('This utility will walk you through setting up an iservices project in');
    this.log(this.destinationRoot());
    this.log('Press ^C at any time to quit.');
    this.log('');

    this.userInput = {};
  },

  // get the project name
  promptingProjectName: function () {
    const prompts = [
    { type: 'input',
      name: 'projectName',
      message: 'Enter the project name:',
      default: this.appname
    },
    { type: 'input',
      name: 'projectDescription',
      message: 'Enter the project description:',
      default: ''
    },
    { type: 'list',
      name: 'projectType',
      message: 'Select the project type:',
      choices: ['app server', 'api server', 'custom'],
      default: 'app server'
    },
    { type: 'checkbox',
      name: 'projectTypeCustomChoices',
      message: 'Select the components to include in your project:',
      choices: ['asset', 'bundle', 'lint', 'style', 'test', 'transform'],
      default: [],
      when: function (answers) { return answers.projectType === 'custom'; }
    }];

    const done = this.async();
    this.prompt(prompts, function (answers) {
      this.userInput = answers;
      done();
    }.bind(this));
  },

  // create project files
  writing: function () {
    const values = {
      projectName: this.userInput.projectName,
      projectDescription: this.userInput.projectDescription,
      projectScriptTest: 'echo \\"Error: no test specified\\" && exit 1',
      projectDependencies: ['"gulp": "^3.9.0"'],
      projectDevDependencies: [],
      gulpHeaders: [],
      gulpBodies: [],
      gulpWatchTasks: [],
      gulpBuildTasks: []
    };

    let components = [];
    switch (this.userInput.projectType) {
      case 'app server':
        components = ['asset', 'bundle', 'lint', 'style', 'test', 'transform'];
        break;
      case 'api server':
        components = ['lint', 'test', 'transform'];
        break;
      case 'custom':
        components = this.userInput.projectTypeCustomChoices;
        break;
      default:
        break;
    }

    fs.mkdirSync(this.destinationPath('src/'));

    components.forEach(function (component) {
      switch (component) {
        case 'asset':
          fs.mkdirSync(this.destinationPath('src/public/'));
          values.gulpHeaders.push('gulpAssetHeader.template');
          values.gulpBodies.push('gulpAssetBody.template');
          values.gulpWatchTasks.push('\'watch-asset\'');
          values.gulpBuildTasks.push('\'asset\'');
          values.projectDependencies.push('"build-asset": "^1.0.0"');
          break;
        case 'bundle':
          fs.mkdirSync(this.destinationPath('src/apps/'));
          values.gulpHeaders.push('gulpLintHeader.template');
          values.gulpBodies.push('gulpLintBody.template');
          values.gulpWatchTasks.push('\'watch-bundle\'');
          values.gulpBuildTasks.push('\'bundle\'');
          values.projectDependencies.push('"build-bundle": "^1.0.0"');
          break;
        case 'lint':
          this.fs.copy(
            this.templatePath('eslintrc.template'),
            this.destinationPath('.eslintrc'));
          values.gulpHeaders.push('gulpBundleHeader.template');
          values.gulpBodies.push('gulpBundleBody.template');
          values.gulpWatchTasks.push('\'watch-lint\'');
          values.projectDevDependencies.push('"build-lint": "^1.0.0"');
          break;
        case 'style':
          fs.mkdirSync(this.destinationPath('src/styles/'));
          values.gulpHeaders.push('gulpStyleHeader.template');
          values.gulpBodies.push('gulpStyleBody.template');
          values.gulpWatchTasks.push('\'watch-style\'');
          values.gulpBuildTasks.push('\'style\'');
          values.projectDependencies.push('"build-style": "^1.0.0"');
          break;
        case 'test':
          fs.mkdirSync(this.destinationPath('src/tests/'));
          values.projectScriptTest = 'gulp test-with-coverage';
          values.gulpHeaders.push('gulpTestHeader.template');
          if (components.find(function (element) { return element === 'transform'; })) {
            values.gulpBodies.push('gulpTestTransformBody.template');
          } else {
            values.gulpBodies.push('gulpTestBody.template');
          }
          values.projectDevDependencies.push('"build-test": "^1.0.0"');
          break;
        case 'transform':
          fs.mkdirSync(this.destinationPath('src/local/'));
          values.gulpHeaders.push('gulpTransformHeader.template');
          values.gulpBodies.push('gulpTransformBody.template');
          values.gulpWatchTasks.push('\'watch-transform\'');
          values.gulpBuildTasks.push('\'transform\'');
          values.projectDependencies.push('"build-transform": "^1.0.0"');
          break;
        default:
          break;
      }
    }.bind(this));

    values.gulpWatchTasks = values.gulpWatchTasks.join(', ');
    values.gulpBuildTasks = values.gulpBuildTasks.join(', ');
    values.projectDependencies = values.projectDependencies.join(',\n    ');
    values.projectDevDependencies = values.projectDevDependencies.join(',\n    ');

    this.fs.copyTpl(
      this.templatePath('package.template'),
      this.destinationPath('package.json'),
      values);

    this.fs.copyTpl(
      this.templatePath('gulpfile.template'),
      this.destinationPath('gulpfile.js'),
      values);

    this.fs.copy(
      this.templatePath('gitignore.template'),
      this.destinationPath('.gitignore'));

    this.fs.copy(
      this.templatePath('slugignore.template'),
      this.destinationPath('.slugignore'));

    this.fs.copy(
      this.templatePath('README.template'),
      this.destinationPath('README.md'));

    this.fs.copy(
      this.templatePath('index.template'),
      this.destinationPath('index.js'));
  },

  // do npm installs
  install: function () {
    this.installDependencies({
      npm: true,
      bower: false,
      skipMessage: true
    });
  }

});