define(
    ['controller/support'],
    function (support) {
        /** @type {object} Reference to master database object */
        var SELF = null;

        /** @type {string} Name of the database */
        var _name = null;

        /** @type {number} Version of the database */
        var _version = null;

        /** @type {number} Previous version of the database */
        var _versionPrev = null;

        /** @type {object} JSON object source used to create the database and upgrade it */
        var _writeData = null;

        /** @type {object} Instance of the database */
        var _db = null;

        /** @type {object} Record the original request data */
        var _request = null;

        var _private = {
            /**
             * Retrieves the data necessary to write to the database
             */
            getWriter: function (e) {
                return _db || e.target.result;
            },

            /**
             * Request the database
             */
            requestDB: function () {
                return window.indexedDB.open(_name, _version);
            },

            /**
             * Use a retrieved database to open a transaction for a specific table
             */
            getTable: function (table, callback) {
                //var objectStore = _db.transaction(table).objectStore(table);
                //
                //return objectStore.openCursor().onsuccess = callback;
            },

            /**
             * Creates the database structure from the init data
             */
            setStructure: function (e) {
                console.log('structure setting');
                var tableStore, index, line, unique, indexString;
                for (var i = _writeData.length; i--;) {
                    // Create the table
                    tableStore = _private
                        .getWriter(e)
                        .createObjectStore(_writeData[i].table, { keyPath: _writeData[i].keyPath });

                    // Create necessary index
                    if (_writeData[i].index) {
                        for (index = _writeData[i].index.length; index--;) {
                            unique = _writeData[i].index[index].unique || false;
                            indexString = _writeData[i].index[index].name;
                            tableStore.createIndex(indexString, indexString, { unique: unique });
                        }
                    }

                    // Insert lines
                    for (line = _writeData[i].data.length; line--;) {
                        tableStore.add(_writeData[i].data[line]);
                    }
                }
            },

            /**
             * Sets the previous version retrieved form the database
             */
            setVersionPrev: function (ver) {
                _versionPrev = parseInt(ver, 10);
            },

            /**
             * Logic for upgrading the database if a structure is already in place
             */
            upgradeStructure: function () {
                console.info('insert upgrade logic here');
            },

            /**
             * Sets up database error handeling and records the current database
             */
            setDB: function () {
                _db = _request.result;

                _db.onerror = function (e) {
                    console.error('Database error: ' + e.target.errorCode);
                };
            }
        };

        var _events = {
            /**
             * Request error handeling
             */
            requestError: function (e) {
                console.error ('IndexedDB request crashed, database asked for could not be retrieved');
            },

            /**
             * Request upgrade needed
             */
            requestUpgrade: function (e) {
                try {
                    _private.setStructure(e);
                } catch (error) {
                    _private.upgradeStructure(e);
                }
            },

            /**
             * Request was successful
             */
            requestSuccess: function (e) {
                _private.setVersionPrev(e.target.result.version);

                // For older browsers that need to upgrade the DB during success
                support.upgradeDBFix(e, _version, _versionPrev, _events.requestUpgrade);


            }
        };

        var dbInterface = {
            init: function (name, version, writeData) {
                if (SELF !== null) {
                    return this;
                }

                SELF = this;

                _name = name;
                _version = version;
                _writeData = writeData;

                return this;
            },

            request: function (name, version, writeData) {
                this.init(name, version, writeData);

                // Create the request
                _request = _private.requestDB();

                // Attach error handeling
                _request.onerror = _events.requestError;

                // Attach upgrade logic
                _request.onupgradeneeded = _events.requestUpgrade;

                // Attach success handeling
                _request.onsuccess = _events.requestSuccess;

                return this;
            }
        };

        return dbInterface;
    }
);