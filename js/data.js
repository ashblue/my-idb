var defaultDB = [
    {
        table: 'player',
        keyPath: 'info',
        index: [
            {
                name: 'info',
                unique: true
            }
        ],
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
                name: 'asdf',
                id: 1,
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
    }
];