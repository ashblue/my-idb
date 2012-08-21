/*
 * IndexedDB Interface to access the API. Contains a library of pre-built math equations, very
 * useful for generating random numbers and simplifying other
 * complex logic.
 * @link https://developer.mozilla.org/en-US/docs/IndexedDB/Using_IndexedDB
 * @link http://www.w3.org/TR/IndexedDB/
 * @todo Still needs upgrade logic
 * @author Ash Blue ash@blueashes.com
*/

var db;

(function () {
    /** @type {object} Reference to the db singleton */
    var SELF = null;

    /** @type {boolean} Whether or not to enable the debugger */
    var _debug = true;

    /** @type {object} Database request */
    var _request = null;

    /** @type {object} Cached instance of a successful DB response */
    var _db = null;

    var _private = {
        /**
         * Detects if the IndexedDB implementation uses setVersion
         */
        hasSetVersion: function (e) {
            return Object.
                getPrototypeOf(e.target.result).
                hasOwnProperty('setVersion');
        },

        /**
         * Sets up error and success handles for the current databse.
         * @todo Add success handler
         * @todo Make it a universal method that adds a callback to success and failure for a given object
         */
        configureDB: function () {
            if (_debug) console.log(_db);

            // Setup error handeling
            _db.onerror = function (e) {
                console.error('Database error: ' + e.target.errorCode);
            };
        },

        /**
         * Provides a cross-browser database writing solution that works for
         * older and newer implementations of IndexedDB
         */
        getDBWriter: function (e) {
            // If the DB is not set, we need to pull from the DB target immediately, doubles as a shim for old browsers
            return _db || e.target.result;
        },

        /**
         * Allows the user to create a database structure from JSON data.
         * @param {object} data JSON data to be turned into a database
         * @param {event} e Database transaction event
         * @example
         * var dbData = {
         *     table: 'player',
         *     keyPath: 'name',
         *     data: [
         *         {
         *              name: null,
         *              fullscreen: false,
         *              particles: true
         *         }
         *     ]
         * };
         */
        setDBStructure: function (data, e) {
            // Set variables used outside of the loop here
            var dbWriter = _private.getDBWriter(e),
                tableStore,
                index,
                line,
                insertData,
                unique,
                indexString;

            // Get all the tables and process each individually
            for (var i = data.length; i--;) {
                // Create the table
                tableStore = dbWriter.createObjectStore(data[i].table, { keyPath: data[i].keyPath });

                // Create any necessary indexes
                if (data[i].index) {
                    for (index = data[i].index.length; index--;) {
                        unique = data[i].index[index].unique || false;
                        indexString = data[i].index[index].name;
                        tableStore.createIndex(indexString, indexString, { unique: unique });
                    }
                }

                for (line = data[i].data.length; line--;) {
                    insertData = data[i].data[line];
                    tableStore.add(insertData);
                }
            }
        }
    };

    db = {
        init: function () {
            if (typeof SELF !== 'object') {
                return;
            }

            SELF = this;

            // Probebly set indexedDB for all browsers
            window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

            // Verify IndexedDB works in the current browser
            this.testDB(window.indexedDB);
        },

        /**
         * @type {string} name Name of the database to be opened.
         * @type {number} versoin Version of the database to use.
         * @type {function} writeData Logic executed after the database is retrieved.
         * Must make use of the dbWriter object.
         * @todo Make sure writeData's dbWriter's object is in a proper scope. Might need
         * to be a private var.
         */
        getDB: function (name, version, writeData) {
            this.init();

            // Open the database
            _request = window.indexedDB.open(name, version); // (dbName, version)

            // Setup error handeling
            _request.onerror = function () {
                throw new Error('db crashed during initialization.');
            };

            // Setup success handeling
            _request.onsuccess = function (e) {
                // Shim for browsers using the old implementation
                if (_private.hasSetVersion(e)) {
                    var setVer = e.target.result.setVersion(version);
                    setVer.onsuccess = function (e) {
                        if (parseInt(e.target.result.db.version, 10) !== version) {
                            SELF.setDBStructure(writeData, e);
                        }
                    };
                }

                console.info('DB setup correctly');

                // Store the retrieved database result when its ready
                _db = _request.result;
                _private.configureDB();
            };

            // Setup upgrade logic
            _request.onupgradeneeded = function (e) {
                SELF.setDBStructure(writeData, e);
            };
        },

        /**
         * Get data from the database normally.
         */
        getData: function (table, keyPath) {

        },

        /**
         * Get all the data from a single table using a cursor.
         */
        getAllData: function (table, callback) {

        },

        /**
         * Add new data to the database for specific file.
         */
        setNewData: function (table, data) {

        },

        /**
         * Modify an existing line of data in a table.
         */
        setData: function (table, data) {

        },

        testDB: function (dbData) {
            if (dbData === undefined) {
                throw new Error('No Indexed DB support.');
            }
        }
    };
}());