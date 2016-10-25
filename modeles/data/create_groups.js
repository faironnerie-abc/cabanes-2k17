'use strict';

let groups = [
    {
        "id": "E6",
        "x": 0,
        "y": 0,
        "angle" : 18
    },
    {
        "id": "E5",
        "x": 38,
        "y": 0,
        "angle" : 18
    },
    {
        "id": "E4",
        "x": 73,
        "y": 0,
        "angle" : 18
    },
    {
        "id": "E3",
        "x": 114,
        "y": 0,
        "angle" : 18
    },
    {
        "id": "E2",
        "x": 152,
        "y": 0,
        "angle" : 18
    },
    {
        "id": "E1",
        "x": 192,
        "y": 0,
        "angle" : 18
    },

    {
        "id": "P",
        "x": 0,
        "y": 0,
        "angle" : 0
    },

    {
        "id": "R1",
        "x": 144,
        "y": 1,
        "angle" : -90
    },
    {
        "id": "R2",
        "x": 152,
        "y": 1,
        "angle" : -90
    },
    {
        "id": "R3",
        "x": 160,
        "y": 1,
        "angle" : -90
    },
    {
        "id": "R4",
        "x": 168,
        "y": 1,
        "angle" : -90
    },
    {
        "id": "R5",
        "x": 176,
        "y": 1,
        "angle" : -90
    },
    {
        "id": "R6",
        "x": 184,
        "y": 1,
        "angle" : -90
    },

    {
        "id": "R7",
        "x": 246,
        "y": 1,
        "angle" : -90
    },
    {
        "id": "R8",
        "x": 254,
        "y": 1,
        "angle" : -90
    },
    {
        "id": "R9",
        "x": 262,
        "y": 1,
        "angle" : -90
    },
    {
        "id": "R10",
        "x": 270,
        "y": 1,
        "angle" : -90
    },
    {
        "id": "R11",
        "x": 278,
        "y": 1,
        "angle" : -90
    },
    {
        "id": "R12",
        "x": 286,
        "y": 1,
        "angle" : -90
    },

    {
        "id": "R13",
        "x": 356,
        "y": 1.5,
        "angle" : -90
    },
    {
        "id": "R14",
        "x": 364,
        "y": 1.5,
        "angle" : -90
    },
    {
        "id": "R15",
        "x": 372,
        "y": 1.5,
        "angle" : -90
    },
    {
        "id": "R16",
        "x": 380,
        "y": 1.5,
        "angle" : -90
    },
    {
        "id": "R17",
        "x": 388,
        "y": 1.5,
        "angle" : -90
    },
    {
        "id": "R18",
        "x": 396,
        "y": 1.5,
        "angle" : -90
    },

    {
        "id": "R19",
        "x": 454,
        "y": 1.5,
        "angle" : -90
    },
    {
        "id": "R20",
        "x": 462,
        "y": 1.5,
        "angle" : -90
    },
    {
        "id": "R21",
        "x": 470,
        "y": 1.5,
        "angle" : -90
    },
    {
        "id": "R22",
        "x": 478,
        "y": 1.5,
        "angle" : -90
    },
    {
        "id": "R23",
        "x": 486,
        "y": 1.5,
        "angle" : -90
    },
    {
        "id": "R24",
        "x": 494,
        "y": 1.5,
        "angle" : -90
    },

    {
        "id": "R25",
        "x": 528,
        "y": 13,
        "angle" : -90
    },
    {
        "id": "R26",
        "x": 536,
        "y": 13,
        "angle" : -90
    },
    {
        "id": "R27",
        "x": 544,
        "y": 9,
        "angle" : -90
    },
    {
        "id": "R28",
        "x": 552,
        "y": 9,
        "angle" : -90
    },
    {
        "id": "R29",
        "x": 560,
        "y": 9,
        "angle" : -90
    },
    {
        "id": "R30",
        "x": 568,
        "y": 9,
        "angle" : -90
    }
];


function completeGroups() {
    // first rotate and shift épis
    let alpha =  -Math.PI / 10;
    for (let i = 0; i < 6; i++) {
        let r = groups[i].x;
        groups[i].x = r * Math.cos(alpha) - 264;
        groups[i].y = r * Math.sin(alpha) + 66;
    }

    // cabin ids
    // E6 - E2
    let count = [10, 12, 14, 13, 13];
    for (let i = 0; i < 5; i++) {
        groups[i].cabids = Array.from({length : count[i]}, (v, k) => count[i] - k);
    }
    // E2
    groups[4].cabids.push(0);
    // E1
    groups[5].cabids = Array.from({length : 27}, (v, k) => 30 - k);
    groups[5].cabids.splice(18, 0, '12b');
    // P
    groups[6].cabids = Array.from({length : 49}, (v, k) => k - 2);
    groups[6].cabids.splice(22, 0, '19b');
    // R1 - R30
    count = [11, 16, 18, 24, 27];
    let start = [0, 1, 1, 0, 0];
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 6; j++) {
            groups[7 + 6 * i + j].cabids = Array.from({length : count[i]}, (v, k) => start[i] + k);
        }
    }
    // R25 and R26
    groups[31].cabids.splice(0, 2);
    groups[32].cabids.splice(0, 2);

    // gaps
    groups.forEach(g => {
        g.gaps = Array.from(g.cabids, (v, k) => 0);
        g.gaps[0] = 1;
        g.gaps.push(1);
    });
    // E1
    groups[5].gaps[18] = 2;
    // P
    groups[6].gaps[23] = 11;
    // R7 - R18
    for (let r = 7; r <= 18; r++) groups[6 + r].gaps[9] = 1;
    // R19 - R24
    for (let r = 19; r <= 24; r++) groups[6 + r].gaps[11] = 1;
    // R25 - R26
    groups[6 + 25].gaps[8] = groups[6 + 26].gaps[8] = 1;
    // R27 - R30
    for (let r = 27; r <= 30; r++) groups[6 + r].gaps[10] = 1;

    // doors
    // E6 - E1, P
    for (let i = 0; i <= 6; i++) groups[i].doors = Array.from(groups[i].cabids, (v, k) => 0);
    // R1 - R30
    for (let i = 7; i <= 36; i++) {
        groups[i].doors = Array.from(groups[i].cabids, (v, k) => 2);
        groups[i].doors[groups[i].doors.length - 1] = 1;
    }
}

completeGroups();
console.log(JSON.stringify({groups: groups}));
