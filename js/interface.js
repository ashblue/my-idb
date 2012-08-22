/*
 * IndexedDB Interface to access the API. Contains a library of pre-built math equations, very
 * useful for generating random numbers and simplifying other
 * complex logic.
 * @link https://developer.mozilla.org/en-US/docs/IndexedDB/Using_IndexedDB
 * @link http://www.w3.org/TR/IndexedDB/
 * @todo Still needs upgrade logic
 * @todo Still needs the ability to set existing data
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

    /** @type {object} Holds a cache of the database. */
    var _cache = null;

    /** @type {array} Cached version of all the write data. */
    var _writeData = null;

    /** @type {timer} Set timeout that checks for the database to be ready. */
    var _updateCheck = null;

    /** @type {boolean} Sets to true only if a database upgrade occurs */
    var _ready = null;

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
            console.log('database set');

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

            _ready = true;
        },

        /**
         * Get data from the database with a cursor for a specific table.
         */
        getTable: function (table, callback) {
            var objectStore = _db.transaction(table).objectStore(table);

            return objectStore.openCursor().onsuccess = callback;
        },

        /**
         * Rebuilds the cache from scratch
         */
        setCache: function() {
            _cache = {};

            // Loop through all of the data items
            for (var i = _writeData.length; i--;) {
                var table = _writeData[i].table;
                _cache[table] = [];

                // getTable for each with a callback that appends to the cache
                _private.getTable(table, function(e) {
                    var cursor = e.target.result;
                    if (cursor) {
                        _cache[cursor.source.name].push(cursor.value);
                        cursor.continue();
                    }
                });
            }
        },

        /**
         * Tests for indexedDB support
         * @todo Create a callback reference in the master object
         */
        testDB: function (dbData) {
            if (dbData === undefined) {
                console.error('No Indexed DB support.');
            }
        }
    };

    db = {
        /**
         * @todo Should be private, only fires once when getDB is called
         */
        init: function () {
            if (typeof SELF !== 'object') {
                return;
            }

            SELF = this;

            // Probebly set indexedDB for all browsers
            window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

            // Verify IndexedDB works in the current browser
            _private.testDB(window.indexedDB);
        },

        /**
         * @type {string} name Name of the database to be opened.
         * @type {number} versoin Version of the database to use.
         * @type {function} writeData Logic executed after the database is retrieved.
         * Must make use of the dbWriter object.
         * @returns {undefined} Don't return anything because the database might not be ready yet
         * @todo Make sure writeData's dbWriter's object is in a proper scope. Might need
         * to be a private var.
         */
        getDB: function (name, version, writeData) {
            this.init();
            _writeData = writeData;

            // Open the database
            _request = window.indexedDB.open(name, version); // (dbName, version)

            // Setup error handeling
            _request.onerror = function () {
                throw new Error('db crashed during initialization.');
            };

            // Setup success handeling
            _request.onsuccess = function (e) {
                // Set the current version
                var currentVersion = parseInt(e.target.result.version, 10);

                // Shim for browsers using the old implementation
                if (_private.hasSetVersion(e)) {
                    // On an upgrade do this!
                    var setVer = e.target.result.setVersion(version);

                    // Logic on successful update
                    setVer.onsuccess = function (e) {
                        console.log(parseInt(e.target.result.db.version, 10), currentVersion);
                        if (parseInt(e.target.result.db.version, 10) > currentVersion ||
                            isNaN(currentVersion)) {
                            console.log('upgrade needed');
                            _private.setDBStructure(writeData, e);
                        }
                    };
                }

                // Store the retrieved database result when its ready
                _db = _request.result;
                _private.configureDB();

                // Set the database cache if the version isn't changing
                if (currentVersion === version) {
                    _private.setCache();
                // Database is still updating, check back later
                } else {
                    var checkStatus = function() {
                        if (_ready) {
                            _private.setCache();
                        } else {
                            _updateCheck = setTimeout(checkStatus, 100);
                        }
                    };
                    _updateCheck = setTimeout(checkStatus, 100);
                }
            };

            // Setup upgrade logic
            _request.onupgradeneeded = function (e) {
                console.log('upgrade needed');
                _private.setDBStructure(writeData, e);
            };

            return;
        },

        /**
         * Accesses the cache and returns the array of data for a table
         * @param {string} table Table to access
         * @returns {array} Each line in the array reprents a line in the database
         */
        getDataTable: function(table) {
            return _cache[table];
        },

        /**
         * Gets and retuns a specific line of a table via a key with a value from
         * the cache.
         * @returns {object} Only returns one line or an empty object
         * @todo Untested
         */
        getDataTableKey: function(table, key, value) {
            var tableData = _cache[table];

            for (var i = tableData.length; i--;) {
                if (tableData[i][key] === value) {
                    return tableData[i];
                }
            }

            return {};
        },

        /**
         * Used to upgrade the database
         * @returns {boolean} True if it exists
         * @todo Make private
         */
        getDataExistence: function(table, keyPathVal) {

        },

        /**
         * Modify an existing line of data in a table.
         * @todo Untested, might not work
         */
        setData: function (table, data, key) {
            // Open the specific table in question
            var transaction = db.transaction([table], IDBTransaction.readwrite);
            var store = transaction.objectStore(table);
            store.put(data, key);

            return this;
        }
    };
}());