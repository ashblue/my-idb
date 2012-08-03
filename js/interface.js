/*
 * IndexedDB Interface to access the API. Contains a library of pre-built math equations, very
 * useful for generating random numbers and simplifying other
 * complex logic.
 * @link https://developer.mozilla.org/en-US/docs/IndexedDB/Using_IndexedDB
 * @author Ash Blue ash@blueashes.com
*/

var db;

(function () {
    /** @type {object} Database request */
    _request = null;

    /** @type {object} Cached instance of a successful DB response */
    _db = null;

    db = {
        init: function () {
            // This will improve our code to be more readable and shorter
            window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

            this.testDB(window.indexedDB);

            // Now we can open our database
            _request = window.indexedDB.open("MyTestDatabase");

            // Setup error handeling
            _request.onerror = function () {
                throw new Error('db crashed during initialization.');
            };

            // Setup success handeling
            _request.onsuccess = function (e) {
                console.info('DB setup correctly');

                // Store the retrieved database result when its ready
                _db = _request.response;
            };
        },

        testDB: function (dbData) {
            if (dbData === undefined) {
                throw new Error('No Indexed DB support.');
            }
        }
    };


}());