'use strict';


var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    demo: 'demo',
    dist: 'dist',
    component: require('./bower.json').name
  };

  try {
    yeomanConfig.demo = require('./bower.json').demoPath || yeomanConfig.demo;
  } catch (e) {}

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      compass: {
        files: ['demo/styles/{,*/}*.{scss,sass}', 'component/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },
      templates: {
        files: ['component/templates/*.html', 'demo/views/*.html']
      },
      livereload: {
        files: [
          'demo/{,*/}*.html',
          'component/{,*/}*.html',
          '.tmp/styles/{,*/}*.css',
          'demo/styles/{,*/}*.scss',
          'demo/scripts/{,*/}*.js',
          'component/scripts/{,*/}*.js',
          'demo/images/{,*/}*.{png,jpg,jpeg}'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      livereload: {
        options: {
          port: 9000,
          // Change this to '0.0.0.0' to access the server from outside.
          hostname: '0.0.0.0',
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, ''),
              mountFolder(connect, yeomanConfig.demo)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test'),
              mountFolder(connect, 'component')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:3501'
      }
    },
    clean: {
      dist: ['.tmp', 'dist/*.js', 'dist/*.scss', 'dist/*.css'],
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'component/scripts/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      ci: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS', 'Firefox']
      }
    },
    compass: {
      options: {
        sassDir: './',
        cssDir: '.tmp/styles',
        imagesDir: 'demo/images',
        javascriptsDir: 'demo/scripts',
        fontsDir: 'demo/styles/fonts',
        importPath: ['demo/components', 'component/styles'],
        relativeAssets: true
      },
      dist: {
        files: {
          'dist/<%= yeoman.component %>.scss' : [
            'component/styles/**/*.scss'
          ]
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    ngtemplates: {
      build: {
        options: {
          base: 'component/templates',
          prepend: 'component/templates/',
          module: 'alch-templates'
        },
        src: ['component/templates/*.html'],
        dest: '.tmp/templates/<%= yeoman.component %>.templates.js'
      }
    },
    concat: {
      dist: {
        files: {
          'dist/<%= yeoman.component %>.js': [
            '.tmp/templates/*.js', //must be first
            'component/scripts/**/*.js'
          ]
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          'dist/<%= yeoman.component %>.css': [
            '.tmp/styles/{,*/}*.css'
          ]
        }
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/scripts',
          src: '*.js',
          dest: 'dist/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/<%= yeoman.component %>.min.js': [
            'dist/*.js'
          ],
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'demo',
          dest: 'dist',
          src: [
            '*.{ico,txt}',
            '*.{ico,txt}'
          ]
        },
        {
          expand: true,
          dot: true,
          cwd: 'component/styles',
          dest: 'dist',
          src: [
            './**/*.scss'
          ]
        }]
      }
    },
    releaseTask: {},
    checkVersion: {},
    docular: {
      groups: [{
        groupTitle: 'Alchemy',
        groupId: 'alchemy',
        sections: [{
          id: '<%= yeoman.component %>',
          title: 'Base',
          scripts: ['component/scripts/']
        }]
      }],
      showDocularDocs: false,
      showAngularDocs: false
    }
  });

  grunt.registerTask('checkVersion', 'Checks the version attempting to be built against previously built versions.', function() {
    var done = this.async(),
        version = grunt.file.readJSON('./bower.json').version,

        fetchTags = function() {
            grunt.util.spawn({
                cmd: 'git',
                args: ['fetch', '--tags']
            }, function(err, result) {
                if (err) {
                    grunt.fail.fatal(result.stdout);
                    done(false);
                } else {
                    checkVersion();
                }
            });
        },

        checkVersion = function() {
            grunt.util.spawn({
                cmd: 'git',
                args: ['tag']
            }, function(err, result) {
                if (result.stdout.indexOf(version) !==  -1) {
                    grunt.fail.fatal('The version you are trying to create a release for already exists. Please bump bower.json, commit and try again.');
                    done(false);
                } else {
                    done();
                }
            });
        };

    grunt.log.writeln('Fetching remote tags.');
    fetchTags();
  });

  grunt.registerTask('releaseTask', 'Creates a release branch based off of the dist directory.', function() {
    var done = this.async(),
        version = grunt.file.readJSON('./bower.json').version,

        copyComponentFile = function() {
            grunt.util.spawn({
                cmd: 'cp',
                args: ['bower.json', 'dist/']
            }, function(err, result) {
                if (!err) {
                    grunt.log.writeln('Component file copied to build directory.');
                    checkoutRelease();
                } else {
                    grunt.log.error(result.stdout);
                    done(false);
                }
            });
        },

        checkoutRelease = function() {
            grunt.util.spawn({
                cmd: 'git',
                args: ['checkout', 'release']
            }, function(err, result) {
                if (!err) {
                    grunt.log.writeln('Release branch checked out.');
                    copyBuild();
                } else {
                    grunt.log.error(result.stdout);
                    done(false);
                }
            });
        },

        copyBuild = function() {
            grunt.file.recurse('dist/', function(abspath, rootdir, subdir, filename) {
                grunt.file.copy(abspath, rootdir + '../' + filename);
            });
            addFiles();
        },

        addFiles = function() {
            grunt.util.spawn({
                cmd: 'git',
                args: ['add', './']
            }, function(err, result) {
                if (!err) {
                    grunt.log.writeln('Added any new files to release.');
                    commitBuild();
                } else {
                    grunt.log.error(result.stdout);
                    done(false);
                }
            });
        },

        commitBuild = function() {
            grunt.util.spawn({
                cmd: 'git',
                args: ['commit', '-a', '-m', 'Automatic commit of build at [' + version + ']']
            }, function(err, result) {
                if (!err) {
                    grunt.log.writeln('Automatic commit of build at [' + version + ']');
                    tagRelease();
                } else {
                    grunt.log.error(result.stdout);
                    done(false);
                }
            });
        },

        tagRelease = function() {
            grunt.util.spawn({
                cmd: 'git',
                args: ['tag', version]
            }, function(err, result) {
                if (!err) {
                    grunt.log.writeln('Tagging release.');
                    done();
                } else {
                    grunt.log.error(result.stdout);
                    done(false);
                }
            });
        };

    copyComponentFile();
  });

  grunt.renameTask('regarde', 'watch');
  // remove when mincss task is renamed
  grunt.renameTask('mincss', 'cssmin');

  grunt.registerTask('server', [
    'clean:server',
    'compass:server',
    'ngtemplates',
    'livereload-start',
    'connect:livereload',
    'open',
    'watch'
  ]);

  grunt.registerTask('test', function(arg1){
    var taskList = [
      'clean:server',
      'compass',
      'ngtemplates',
      'jshint',
      'connect:test'
    ];

    if (arg1 === 'ci') {
      taskList.push('karma:ci');
    } else {
      taskList.push('karma:unit');
    }

    grunt.task.run(taskList);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'jshint',
    'test',
    'compass:dist',
    'ngtemplates',
    'concat',
    'copy',
    'ngmin',
    'uglify'
  ]);

  grunt.registerTask('release', [
    'checkVersion',
    'build',
    'releaseTask'
  ]);

  grunt.registerTask('default', ['build']);
};
