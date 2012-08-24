/**
 * Master server controller for Canvas Prime to run on NodeJS.
 * @author Ash Blue
 * @todo Create a method to combine all the engine files and return them dynamically
 * @todo Break logic up into smaller files?
 * @todo Change file name requests to proper names '.json' instead of '.php' files
 */

var SELF = null;

var server = {
    // Retrieve necessary node components
    fs: require('fs'),
    express: require('express'),

    /**
     * Creates the server with basic settings
     * @returns {undefined}
     */
    init: function () {
        SELF = this;

        this.app = this.express();

        this
            .setFolders()
            .setRoot('index.html');

        this.app.listen(8080);

        return;
    },

    /**
     * Create static folders
     * @todo Looks like the first parameter can be removed from server.use
     * @todo Add switches for different production environments, caching, no-caching, ect.
     * @returns {self}
     */
    setFolders: function () {
        this.app.configure(function () {
            SELF.app.use('/js', SELF.express.static(__dirname + '/js'));
        });

        return this;
    },

    /**
     * Specified file to return on root request
     * @todo Is there a more effecient way to do this?
     */
    /**  */
    setRoot: function (file) {
        this.app.get('/', function (req, res) {
            res.sendfile(file);
        });

        return this;
    }
};

server.init();