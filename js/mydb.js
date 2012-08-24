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

            setDB: function (dbName, ver, data) {
                getDB.request(dbName, ver, data);
            },

            setNoDBCallback: function () {

            }
        };

        window.myDB.init();
        window.myDB.setDB('test', 1, testData);
    }
);