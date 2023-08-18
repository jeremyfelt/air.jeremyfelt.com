module.exports = function( grunt ) {
    grunt.initConfig( {
        pkg: grunt.file.readJSON( "package.json" ),

        watch: {
            styles: {
                files: [ "*.html", "src/css/*.css", "src/js/*.js" ],
                option: {
                    livereload: 8000
                }
            }
        },

        connect: {
            server: {
                options: {
                    open: true,
                    port: 8000,
                    hostname: "localhost"
                }
            }
        }

    } );

    grunt.loadNpmTasks( "grunt-contrib-connect" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );

    grunt.registerTask( "serve", [ "connect", "watch" ] );
};
