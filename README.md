# j2-grunt-jsdoc

Task to generate js-doc documentation into json file that can be consumed later.

## Generate your documentation

## Install 
If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install j2-grunt-jsdoc --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```javascript
grunt.loadNpmTasks('grunt-j2-grunt-jsdoc');
```

### Configuration

First, add the `doc` entry to the options of the `initConfig` method of your Gruntfile.js :

```javascript
grunt.initConfig({
    doc : {
        dist : {
        	options : {
        		configPath  : 'doc.config.json',
        		destination : 'build/',
        		projectName : 'myAwesomeProject'
        	}
        }
    }
});
```

The supported options are
* `configPath`  : Is the path to the jsdoc [config](http://usejsdoc.org/about-configuring-jsdoc.html) file.
* `destination` : Is the path for the destination directory. This is where the task will generate a `doc.json` file
* `projectName` : Is the name of the current project. Just so the links etc are relative to the project

## Generation

To generate the documentation, you need to call the `doc` task:

```shell
$>grunt doc
```

or integrate it to your build sequence:

```javascript
grunt.registerTask('default', ['lint', 'test', 'doc']);
```

## License
Copyright (c) 2017 SS Virk, J2 Innovation Inc.
Licensed under the ISC license.