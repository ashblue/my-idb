/**
 * @todo configure upgrade logic
 */
define(
    [
        'controller/support',
        'controller/get-db',
        'archive/data'
    ],
    function (support, getDB, testData) {
        /** @type {object} Reference to the db singleton */
        var SELF = null;

        /** @type {boolean} Whether or not to enable the debugger */
        var _debug = false;

        var _private = {
            /**
             * Callback in-case IndexedDB fails to initialize
             */
            loadFailure: function () {
                return alert('Your browser does not support IndexedDB');
            }
        };

        /** @type {object} Public interface for working with myDB. Directly attached to the window */
        window.myDB = {
            init: function () {
                if (SELF !== null) {
                    return;
                }

                SELF = this;

                support
                    .setPrefixes()
                    .testDb(_private.loadFailure);
            },

            /**
             * Set and get the database, should only be called once per page load.
             * @param {string} dbName Name of the database you want to retrieve
             * @param {number} ver Version of the database you want, newer versions trigger
             * an upgrade
             * @param {object} data Data you want to use to create or upgrade
             * your database, see example for more info
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
             * @returns {self}
             */
            setDB: function (dbName, ver, data) {
                getDB.request(dbName, ver, data);

                return this;
            },

            /**
             * Overwrite the callback that fires if indexedDB fails to load
             */
            setNoDBCallback: function (callback) {
                _private.loadFailure = callback;

                return this;
            },

            /**
             * Retrive a specific table
             * @param {string} table Name of the table you want to get
             */
            getTable: function (table) {
                return getDB.getDataTable(table);
            },

            /**
             * Gets and returns a specific line of a table via a key with a value from
             * the cache.
             * @param {string} table Name of the table such as 'player'
             * @param {string} key Main key for the table, such as 'name'
             * @param {mixed} value Value you are looking for in a specific key,
             * for example you might look for a key of 'name' and value of 'Joe'
             * @returns {object} Only returns one line or an empty object
             */
            getTableLine: function (table, key, value) {
                return getDB.getDataTableKey(table, key, value);
            },

            /**
             * Modify an existing line of data in a table.
             * @param {string} table Name of the table such as 'player'
             * @param {object} data Object to write, if you wanted to set a
             * 'name' key it might look like {name: 'joe'}
             * @returns {self}
             */
            setTableLine: function (table, key, keyName, value) {
                getDB.setData(table, key, keyName, value);
                return this;
            }
        };

        window.myDB.init();
        window.myDB.setDB('atest', 1, testData);
    }
);