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

            // This will improve our code to be more readable and shorter
            window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

            this.testDB(window.indexedDB);

            this.requestDB(function () {
                SELF.configureDB();
            });
        },

        requestDB: function (callback) {
            // Now we can open our database
            _request = window.indexedDB.open("Testas", 2); // (dbName, version)

            // Setup error handeling
            _request.onerror = function () {
                throw new Error('db crashed during initialization.');
            };

            // Setup success handeling
            _request.onsuccess = function (e) {
                // Shim for browsers using the old implementation
                if (SELF.hasSetVersion(e)) {
                    var setVer = e.target.result.setVersion(1);
                    setVer.onsuccess = SELF.writeData;
                };

                console.info('DB setup correctly');

                // Store the retrieved database result when its ready
                _db = _request.result;

                callback();
            };

            // Only place you can actually edit the DB
            _request.onupgradeneeded = this.writeData;
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
        writeData: function (e) {
            // If the DB is not set, we need to pull from the DB target immediately, doubles as a shim for old browsers
            var dbWriter = _db || e.target.result;

            var customerData = [
                { ssn: '444-44-4444', name: 'Bill', age: 35, email: 'mailto:bill@company.com' },
                { ssn: '555-55-5555', name: 'Donna', age: 32, email: 'mailto:donna@home.org' }
            ];

            var table = dbWriter.createObjectStore('customers', { keyPath: 'ssn' });
            table.createIndex('name', 'name', { unique: false });
            table.createIndex('email', 'email', { unique: true });

            for (var i in customerData) {
                table.add(customerData[i]);
            }

            console.info('onupgradeneeded event fired');
        },

        testDB: function (dbData) {
            if (dbData === undefined) {
                throw new Error('No Indexed DB support.');
            }
        }
    };
}());