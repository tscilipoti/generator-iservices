'use strict';

const generators = require('yeoman-generator');

module.exports = generators.Base.extend({

  // introduction prompt
  initializing: function () {
    this.log('This utility will create a new ControllerView class in');
    this.log(this.destinationRoot());
    this.log('Press ^C at any time to quit.');
    this.log('');

    this.userInput = {};
  },

  // get the configurations
  prompting: function () {
    const prompts = [
    { type: 'input',
      name: 'className',
      message: 'Enter the class name:',
      default: 'MyView'
    }];

    const done = this.async();
    this.prompt(prompts, function (answers) {
      this.userInput = answers;
      done();
    }.bind(this));
  },

  // create file
  writing: function () {
    const fileName = this.userInput.className[0].toLowerCase() + this.userInput.className.slice(1) + '.js';
    this.fs.copyTpl(
      this.templatePath('controllerView.template'),
      this.destinationPath(fileName),
      this.userInput);
  }

});
