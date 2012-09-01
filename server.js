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
            .setCombinedJS('build/js', '/build/all.js')
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
            SELF.app.use('/build', SELF.express.static(__dirname + '/build'));
            SELF.app.use('/tests', SELF.express.static(__dirname + '/tests'));
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
    },

    /**
     * Dynamically combines and returns a JavaScript file when requested.
     * @param folder {string} Location of the JavaScript files
     * @param request {string} Request such as 'engine.js' to the server
     * @returns {self}
     */
    setCombinedJS: function (folder, request) {
        // Retrieve all files
        var fileContents = this.fs.readdirSync(folder),
            filteredContents = [];

        // Verify file data is what you requested
        fileContents.forEach(function (value) {
            if (SELF.getString(value, '.js')) {
                filteredContents.push(value);
            }
        });

        //console.log(filteredContents);
        this.app.get(request, function (req, res) {
            var compiledJS = '';

            filteredContents.forEach(function (value) {
                compiledJS += SELF.fs.readFileSync(folder + '/' + value);
            });

            res.header('Content-Type', 'application/javascript');
            res.send(compiledJS);
        });

        return this;
    },

    /**
     * Test to discover if the needle(s) are present inside
     * a string.
     * @param {string} haystack String you want to search
     * @param {string} needle Item you're looking for in the haystack
     * @returns {boolean} True upon discovery, false upon failure.
     */
    getString: function (haystack, needle) {
        if (Array.isArray(needle)) {
            needle.forEach(function (value) {
                if (haystack.indexOf(value) !== 1) {
                    return true;
                }
            });
        } else if (typeof needle === 'string') {
            return haystack.indexOf(needle) !== -1;
        }

        return false;
    }
};

server.init();