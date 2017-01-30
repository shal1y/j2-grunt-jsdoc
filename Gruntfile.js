/**

 file-name       : Gruntfile.js.js
 project-name    : j2-grunt-jsdoc

 Created by SS Virk on 30 Jan, 2017.
 Copyright (c) 2017, J2 Innovation Inc. All Rights Reserved

 */

'use strict'

module.exports  = function(grunt) {
	grunt.loadTasks('tasks');

	grunt.initConfig({
		doc : {
			test    : {
				options : {
					configPath     : 'tests/doc.config.json'
				}
			}
		}
	});

	grunt.registerTask('default', 'doc');
}