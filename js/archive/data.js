define(
    [],
    function () {

        var defaultDB = [
            {
                /** @type {string} The table is the section of the database that contains the following data */
                table: 'player',

                /**
                 * @type {string} This is the key that your database uses to lookup info. For
                 * example, to search for a player's name, you would have to request 'name'
                **/
                keyPath: 'info',

                /** @type {object} Declare the index, it will speed up searches */
                index: [
                    {
                        name: 'info',
                        unique: true
                    }
                ],

                /** @type {object} Keypath must be first or all lookup will fail. */
                data: [
                    {
                        info: 'name',
                        data: 'asdf'
                    },
                    {
                        info: 'fullscreen',
                        data: false
                    },
                    {
                        info: 'particles',
                        data: true
                    },
                    {
                        info: 'delete me',
                        data: false
                    },
                    {
                        info: 'delete again',
                        data: false
                    }
                ]
            },
            {
                table: 'stats',
                keyPath: 'info',
                index: [
                    {
                        name: 'info',
                        unique: true
                    }
                ],
                data: [
                    {
                        info: 'minion kills',
                        data: 0
                    },
                    {
                        info: 'boss kills',
                        data: 0
                    },
                    {
                        info: 'special attacks used',
                        data: 0
                    },
                    {
                        info: 'shots',
                        data: 0
                    },
                    {
                        info: 'playtime',
                        data: 0
                    },
                    {
                        info: 'levels complete',
                        data: 0
                    },
                    {
                        info: 'deaths',
                        data: 0
                    },
                    {
                        info: 'game overs',
                        data: 0
                    }
                ]
            },
            {
                table: 'achievements',
                keyPath: 'id',
                index: [
                    {
                        name: 'id',
                        unique: true
                    }
                ],
                data: [
                    {
                        id: 1,
                        name: 'asdf',
                        unlocked: false
                    }
                ]
            },
            {
                table: 'levels',
                keyPath: 'level',
                index: [
                    {
                        name: 'level',
                        unique: true
                    }
                ],
                data: [
                    {
                        level: 1,
                        unlocked: true
                    },
                    {
                        level: 2,
                        unlocked: false
                    },
                    {
                        level: 3,
                        unlocked: false
                    }
                ]
            },
            {
                table: 'delete me',
                keyPath: 'level',
                index: [
                    {
                        name: 'level',
                        unique: true
                    }
                ],
                data: [
                    {
                        level: 1,
                        unlocked: true
                    },
                    {
                        level: 2,
                        unlocked: false
                    },
                    {
                        level: 3,
                        unlocked: false
                    }
                ]
            }
        ];

        return defaultDB;
    }
);