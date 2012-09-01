var myDB = myDB || {};

(function (myDB) {
    /**
     * Handles all cross-browser solutions to keep the logic consolidated to
     * a single file. Idea is to make adding/removing support easier as the
     * specification changes.
     */
    myDB.support = {
        /**
         * Configures all the prefixes for browsers that don't properly support indexedDB
         * @returns {self}
         */
        setPrefixes: function () {
            window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
            window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
            return this;
        },

        /**
         * Tests if the current browser can support indexedDB
         * @param {function} Callback executed if loading fails
         * @returns {boolean} True on success, false on failure
         */
        testDb: function (callback) {
            if (window.indexedDB === undefined) {
                callback();
                return false;
            }

            return true;
        },

        /**
         * Detects if the IndexedDB implementation uses setVersion, for older implementations
         */
        hasSetVersion: function (e) {
            return Object.
                getPrototypeOf(e.target.result).
                hasOwnProperty('setVersion');
        },

        /**
         * Upgrade database for old browsers
         */
        upgradeDBFix: function (e, newVersion, prevVersion, callback) {
            if (this.hasSetVersion(e)) {
                // Begin a possible upgrade
                var setVer = e.target.result.setVersion(newVersion);

                // Logic on successful update
                setVer.onsuccess = function (event) {
                    if (newVersion > prevVersion || isNaN(prevVersion)) {
                        callback(event);
                    }
                };
            }
        }
    };

}(myDB));
