var defaultDB = [
    {
        table: 'player',
        keyPath: 'name',
        data: [
            {
                name: '',
                fullscreen: false, // Enable fullscreen mode automatically if possible
                particles: true
            }
        ]
    },
    {
        table: 'stats',
        keyPath: 'shots',
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