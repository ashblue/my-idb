define(
    [
        'controller/support',
        'controller/cache'
    ],
    function (support, cache) {
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

        var _writeComplete = false;

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
             * Creates the database structure from the init data
             */
            setStructure: function (e) {
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

                _writeComplete = true;
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

                // Store the retrieved database result
                _private.setDB();

                // Set the database cache if the version isn't changing
                if (_version === _versionPrev) {
                    cache.setCache(_writeData, SELF);

                // Database is still updating, check back later
                } else {
                    cache.setCacheTimer(_writeComplete, _writeData, SELF);
                }
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
            },

            /**
             * Use a retrieved database to open a transaction for a specific table
             */
            getTable: function (table, callback) {
                var objectStore = _db.transaction(table).objectStore(table);

                return objectStore.openCursor().onsuccess = callback;
            },

            /**
             * Accesses the cache and returns the array of data for a table
             * @param {string} table Table to access
             * @returns {array} Each line in the array reprents a line in the database
             */
            getDataTable: function(table) {
                var cacheData = cache.getCache();
                return cacheData[table];
            },

            /**
             * Gets and returns a specific line of a table via a key with a value from
             * the cache.
             * @param {string} table Name of the table such as 'player'
             * @param {string} key Main key for the table, such as 'id'
             * @param {mixed} value Value you are looking for in a specific key,
             * for example you might look for a key of 'name' and value of 'Joe'
             * @returns {object} Only returns one line or an empty object
             */
            getDataTableKey: function(table, key, value) {
                var cacheData = cache.getCache();
                var tableData = cacheData[table];

                for (var i = tableData.length; i--;) {
                    if (tableData[i][key] === value) {
                        return tableData[i];
                    }
                }

                return {};
            },

            /**
             * Modify an existing line of data in a table.
             * @param {string} table Name of the table such as 'player'
             * @param {object} data Object to write, if you wanted to set a
             * 'name' key it might look like {name: 'joe'}
             * @returns {self}
             * @todo Untested
             */
            setData: function (table, key, keyName, writeData) {
                // Update the database
                var dbTransaction = _db.transaction([table], 'readwrite');
                var oStore = dbTransaction.objectStore(table);
                oStore.put(writeData);

                // Update the cache
                cache.setCacheLine(table, key, keyName, writeData);

                return this;
            }
        };

        return dbInterface;
    }
);