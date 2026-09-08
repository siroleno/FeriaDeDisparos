import { TOTAL_ROUNDS, DURATION_PER_ROUND, SCORES } from './Config';

export class GameLogic {
    constructor () {
        this.reset();
    }

    reset () {
        this.score = 0;
        this.round = 1;
        this.gameOver = false;
        this.lossReason = null;
        this.won = false;
        this.roundTimeLeft = DURATION_PER_ROUND;
    }

    get requiredPoints () {
        return this.pointsToAdvance(this.round);
    }

    pointsToAdvance (round) {
        return 100 + 50 * (round - 1);
    }

    scoreFor (type, size) {
        return SCORES[type][size];
    }

    applyScore (type, size) {
        const points = this.scoreFor(type, size);
        this.score += points;
        return points;
    }

    hitOwner () {
        this.lose('dueño');
    }

    lose (reason) {
        this.gameOver = true;
        this.lossReason = reason;
    }

    advanceRound () {
        if (this.round < TOTAL_ROUNDS) {
            this.round += 1;
            this.roundTimeLeft = DURATION_PER_ROUND;
            return true;
        }
        this.won = true;
        this.gameOver = true;
        this.lossReason = null;
        return false;
    }

    tick (dt) {
        if (this.gameOver) return;
        this.roundTimeLeft -= dt;
        if (this.roundTimeLeft <= 0) {
            this.roundTimeLeft = 0;
            if (this.score >= this.requiredPoints) {
                this.advanceRound();
            } else {
                this.lose('tiempo');
            }
        }
    }

    canContinue (){
        return !this.gameOver;
    }
}
