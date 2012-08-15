/*
 * IndexedDB Interface to access the API. Contains a library of pre-built math equations, very
 * useful for generating random numbers and simplifying other
 * complex logic.
 * @link https://developer.mozilla.org/en-US/docs/IndexedDB/Using_IndexedDB
 * @link http://www.w3.org/TR/IndexedDB/
 * @author Ash Blue ash@blueashes.com
*/

var db;

(function () {
    /** @type {object} Database request */
    var _request = null;

    /** @type {object} Cached instance of a successful DB response */
    var _db = null;

    SELF = null;

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
            // Open the database
            _request = window.indexedDB.open(name, version); // (dbName, version)

            // Setup error handeling
            _request.onerror = function () {
                throw new Error('db crashed during initialization.');
            };

            // Setup success handeling
            _request.onsuccess = function (e) {
                // Shim for browsers using the old implementation
                if (SELF.hasSetVersion(e)) {
                    var setVer = e.target.result.setVersion(1);
                    setVer.onsuccess = function(e) {
                        SELF.setDBStructure(writeData, e);
                    };
                }

                console.info('DB setup correctly');

                // Store the retrieved database result when its ready
                _db = _request.result;
                SELF.configureDB();
            };

            // Setup upgrade logic
            _request.onupgradeneeded = function(e) {
                SELF.setDBStructure(writeData, e);
            };
        },

        // Detects if the browser supports the old draft of IndexedDB
        hasSetVersion: function (e) {
            return e.target.result.__proto__.hasOwnProperty('setVersion');
        },

        configureDB: function () {
            console.log(_db);

            // Setup error handeling
            _db.onerror = function (e) {
                console.error('Database error: ' + e.target.errorCode);
            };
        },

        /**
         * Needs extra logic to make sure it isn't trying to overwrite or re-create things
         */
        getDBWriter: function (e) {
            // If the DB is not set, we need to pull from the DB target immediately, doubles as a shim for old browsers
            return _db || e.target.result;
        },

        setDBStructure: function (data, e) {
            // Set variables used outside of the loop here
            var dbWriter = this.getDBWriter(e),
            tableStore,
            i,
            index,
            line,
            unique;

            // Get all the tables and process each individually
            for (i = data.length; i--;) {
                // Create the table
                console.log(data[i].table);
                tableStore = dbWriter.createObjectStore(data[i].table, { keyPath: data[i].keyPath });

                // Create any necessary indexes
                for (index = data[i].index.length; index--;) {
                    unique = data[i].index[index].unique || false;
                    console.log(data[i].index[index].name);
                    tableStore.createIndex('name', { unique: unique });
                    //tableStore.createIndex(data[i].index[index].name, { unique: unique });
                }

                for (line = data[i].data.length; line--;) {
                    tableStore.add(data[i].data[line]);
                }
            }

            //var customerData = [
            //    { ssn: '444-44-4444', name: 'Bill', age: 35, email: 'mailto:bill@company.com' },
            //    { ssn: '555-55-5555', name: 'Donna', age: 32, email: 'mailto:donna@home.org' }
            //];
            //
            //var table = dbWriter.createObjectStore('customers', { keyPath: 'ssn' });
            //table.createIndex('name', 'name', { unique: false });
            //table.createIndex('email', 'email', { unique: true });
            //
            //for (var i in customerData) {
            //    table.add(customerData[i]);
            //}
        },

        testDB: function (dbData) {
            if (dbData === undefined) {
                throw new Error('No Indexed DB support.');
            }
        }
    };
}());