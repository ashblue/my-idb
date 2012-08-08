var defaultDB = [
    /**
     * First level declares the table
     * @todo Needs a key property
     */
    {
        table: 'player',
        keyPath: 'name',
        data: [
            {
                name: null,
                fullscreen: false, // Enable fullscreen mode automatically if possible
                particles: true
            }
        ]
    },
    {
        table: 'stats',
        data: [
            {
                minionKills: 0,
                bossKills: 0,
                bombs: 0,
                shots: 0,
                playtime: 0,
                lvsComplete: 0,
                deaths: 0,
                gameovers: 0
            }
        ]
    },
    {
        table: 'achievements',
        keyPath: 'name',
        data: [
            {
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
    }
];