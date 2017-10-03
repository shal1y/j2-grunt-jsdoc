/**

 file-name       : doc.js
 project-name    : j2-grunt-jsdoc

 Created by SS Virk on 28 Jan, 2017.
 Copyright (c) 2017, J2 Innovation Inc. All Rights Reserved

 */

var path    = require('path');
var chalk   = require('chalk');

module.exports  = function(grunt) {
	'use strict'

	var errorCode   = {
		generic : 1,
		task    : 3
	};

	grunt.registerMultiTask('doc', 'Generates jsdoc documentation and saves it to a json file', function() {

		var gtr     = require(path.resolve('node_modules/grunt-text-replace/lib/grunt-text-replace'));
		var spawn   = require('child_process').spawn;

		var done            = this.async();
		var projName        = this.data.options.projectName ? this.data.options.projectName : 'pod';
		var optsFilePath    = this.data.options.configPath;
		var destFilePath    = !this.data.options.destination || this.data.options.destination == '.' ? '' : this.data.options.destination;
		var jsdoc           = (function(g) {
			var i, binPath, paths;

			paths = [
				'node_modules/.bin/jsdoc',
				'node_modules/jsdoc/jsdoc.js',
				'jsdoc/jsdoc.js'
			];

			for (i in paths) {
				binPath = path.resolve(paths[i]);
				if (g.file.exists(binPath) && g.file.isFile(binPath)) {
					return binPath;
				}
			}

			return;
		})(grunt);

		//check if jsdoc npm module is installed
		if (jsdoc === undefined) {
			grunt.log.error('Unable to locate jsdoc');
			grunt.fail.warn('Wrong installation/environnement', errorCode.generic);
		}

		// convert jsdoc path to relative path
		jsdoc = path.relative('.', jsdoc);

		//  check for windows
        if (/^win/.test(process.platform))
            jsdoc   += '.cmd';

		grunt.log.debug('Using jsdoc from : ' + jsdoc);

		//check the existence of the options file
		var configPath;
		if (!optsFilePath || optsFilePath.length === 0) {
			grunt.log.error('jsdoc config file path does not exist');
			grunt.fail.warn('Wrong configuration', errorCode.generic);
		} else {
			var cFile   = path.resolve(optsFilePath);
			if (grunt.file.exists(cFile) && grunt.file.isFile(cFile))
				configPath  = cFile;
			else {
				grunt.log.error('jsdoc config file path does not exist');
				grunt.fail.warn('Wrong configuration', errorCode.generic);
			}
		}

		grunt.log.debug('generating jsdoc.....');

		var p               = spawn(jsdoc, ['-c', configPath])
		var buffer          = [];
		var bufferLength    = 0;
		var err             = null;

		p.stdout.on('data', function(data) {
			buffer.push(data);
			bufferLength    += data.length;
		});

		p.stderr.on('data', function(data) {
			err = data;
		});

		p.on('close', function(code) {
			if (code === 0) {
				var dirPath = path.resolve(destFilePath);

				if (!grunt.file.exists(dirPath))
					grunt.file.mkdir(dirPath);

				var json    = JSON.parse(Buffer.concat(buffer, bufferLength).toString());

				if (json) {

					json.sort(function(a, b) {
						var ma  = a.meta;
						var mb  = b.meta;

						if (!ma && mb)
							return 1;
						else if (ma && !mb)
							return -1;
						else if (!ma && !mb)
							return 0;

						if (ma.filename == mb.filename)
							return ma.lineno - mb.lineno
						else {
							if (ma.filename > mb.filename)
								return 1
							else
								return -1;
						}
					});

					//  remove all undocumented stuff
					json    = json.filter(function(item) {
					    return item && !item.undocumented;
                    });
				}

				grunt.file.write(dirPath+path.sep+ 'doc.json', JSON.stringify(json, null, 4));

				gtr.replace({
					src             : [dirPath+path.sep+ 'doc.json'],
					overwrite       : true,
					replacements    : [{
						from    : /event:/g,
						to      : ''
					}, {
						from        : /{@link (.*?)}/g,
						to          : function(match) {

							var link    = match.replace('@link', '').replace(/[{}]/g, '').trim();
							var parts   = link.indexOf('|') != -1 ? link.split('|') : link;

							if (!parts || parts.length < 1)
								return "";

							var link    = parts[0];
							var name    = parts.length > 1 ? parts[1] : parts[0];

							if (parts[0].indexOf('module:') == 0) {
								link    = '#doc?id=' +projName+ '_' +parts[0].replace('module:', '').replace(/[\/~.]/g, '_');

								if (name.charAt(0) == '#')
									name    = name.substring(1);
							}

							return '<a href=\'' +link+ '\' class=\'reference\'>' +name+ '</a>';
						}
					}, {
						from    : /module:/g,
						to      : projName+ '_'
					}]
				});

				grunt.log.ok("Documentation generated @ " +chalk.green(dirPath)+ chalk.green(path.sep) + chalk.green('doc.json'));
				done(true);
			} else {
				grunt.log.warn("jsdoc terminated with a non-zero exit code ", code);
				grunt.log.warn("Ze error ", err.toString('utf8'));
				done();
			}
		});
	});

}
