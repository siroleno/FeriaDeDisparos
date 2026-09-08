export const TOTAL_ROUNDS = 10;
export const DURATION_PER_ROUND = 60;

export const TYPE = {
    ENEMY: 'enemy',
    ALLY: 'ally',
    OWNER: 'owner'
};

export const SIZE = {
    BIG: 'big',
    MEDIUM: 'medium',
    SMALL: 'small'
};

export const SCORES = {
    [TYPE.ENEMY]: {
        [SIZE.BIG]: 10,
        [SIZE.MEDIUM]: 20,
        [SIZE.SMALL]: 30
    },
    [TYPE.ALLY]: {
        [SIZE.BIG]: -30,
        [SIZE.MEDIUM]: -20,
        [SIZE.SMALL]: -10
    },
    [TYPE.OWNER]: {
        [SIZE.BIG]: 0,
        [SIZE.MEDIUM]: 0,
        [SIZE.SMALL]: 0
    }
};

export const OWNER_STARTS_ROUND = 3;

export const SCALE_PER_SIZE = {
    [SIZE.BIG]: 1.0,
    [SIZE.MEDIUM]: 0.62,
    [SIZE.SMALL]: 0.36
};

export const COLORS = {
    [TYPE.ENEMY]: 0xcc0000,
    [TYPE.ALLY]: 0x00aa00,
    [TYPE.OWNER]: 0x8b00ff
};

export const SPAWN_INTERVAL_BASE = 1000;
export const SPAWN_INTERVAL_DECREASE = 40;

export const SPAWN_WEIGHTS = {
    allyByRound: (round) => Math.min(0.05 + round * 0.02, 0.35),
    sizeWeights: [0.4, 0.35, 0.25]
};

export const OWNER_APPEARANCE_MS = 2000;
export const OWNER_HIDE_MS = 3000;
