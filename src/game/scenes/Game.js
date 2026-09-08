import * as Phaser from 'phaser';
import { GameLogic } from '../Logic';
import {
    TYPE, SIZE, SCORES, COLORS, SCALE_PER_SIZE,
    OWNER_STARTS_ROUND, OWNER_APPEARANCE_MS, OWNER_HIDE_MS,
    SPAWN_INTERVAL_BASE, SPAWN_INTERVAL_DECREASE, SPAWN_WEIGHTS,
    DURATION_PER_ROUND, TOTAL_ROUNDS
} from '../Config';

export class Game extends Phaser.Scene
{
    constructor ()
    {
        super('Game');
        this.logic = new GameLogic();
    }

    create ()
    {
        this.logic.reset();
        this.cameras.main.setBackgroundColor(0x1a1a2e);

        this.ground = this.add.rectangle(512, 620, 1024, 300, 0x2d2d44);
        this.add.text(512, 60, 'FERIA DE DISPAROS', {
            fontFamily: 'Arial Black', fontSize: 34, color: '#ffd700',
            stroke: '#000000', strokeThickness: 6, align: 'center'
        }).setOrigin(0.5);

        this.buildHud();

        this.crosshair = this.add.graphics().setDepth(100);
        this.input.setDefaultCursor('none');
        this.drawCrosshair(512, 384);
        this.input.on('pointermove', (pointer) => this.drawCrosshair(pointer.x, pointer.y));

        this.targets = this.add.group();
        this.spawnTimer = null;
        this.ownerState = { visible: false, timer: 0, showUntil: 0, target: null };
        this.silhouettes = [];

        this.input.on('pointerdown', (pointer) => this.shoot(pointer));

        this.showRoundIntro();

        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => this.logic.tick(1)
        });
    }

    update (time)
    {
        if (this.logic.gameOver) return;

        this.updateSpawner(time);
        this.updateOwner(time);
        this.updateHud();
    }

    buildHud ()
    {
        this.hud = {
            score: this.add.text(20, 20, '', {
                fontFamily: 'Arial Black', fontSize: 26, color: '#ffffff',
                stroke: '#000000', strokeThickness: 5
            }),
            round: this.add.text(1024 - 20, 20, '', {
                fontFamily: 'Arial Black', fontSize: 26, color: '#ffffff',
                stroke: '#000000', strokeThickness: 5
            }).setOrigin(1, 0),
            timer: this.add.text(512, 20, '', {
                fontFamily: 'Arial Black', fontSize: 26, color: '#ffd700',
                stroke: '#000000', strokeThickness: 5
            }).setOrigin(0.5, 0),
            target: this.add.text(512, 96, '', {
                fontFamily: 'Arial Black', fontSize: 20, color: '#7fd7ff',
                stroke: '#000000', strokeThickness: 4
            }).setOrigin(0.5)
        };
    }

    updateHud ()
    {
        this.hud.score.setText(`Puntos: ${this.logic.score}`);
        this.hud.round.setText(`Ronda ${this.logic.round}/${TOTAL_ROUNDS}`);
        this.hud.timer.setText(`${Math.max(0, this.logic.roundTimeLeft)}s`);
        this.hud.target.setText(`Meta: ${this.logic.requiredPoints}`);
    }

    showRoundIntro ()
    {
        const intro = this.add.text(512, 384, `Ronda ${this.logic.round}\nMeta: ${this.logic.requiredPoints} puntos\nTiempo: ${DURATION_PER_ROUND}s`, {
            fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8, align: 'center'
        }).setOrigin(0.5).setDepth(50);

        this.time.delayedCall(1500, () => intro.destroy());
    }

    get spawnInterval ()
    {
        return Math.max(250, SPAWN_INTERVAL_BASE - (this.logic.round - 1) * SPAWN_INTERVAL_DECREASE);
    }

    updateSpawner (time)
    {
        if (!this.spawnTimer || time >= this.spawnTimer) {
            this.spawnTimer = time + this.spawnInterval;
            this.spawnTarget();
        }
    }

    updateOwner (time)
    {
        const s = this.ownerState;
        if (!s.visible) {
            if (this.logic.round >= OWNER_STARTS_ROUND && time >= s.timer) {
                s.timer = time + OWNER_HIDE_MS;
                s.showUntil = time + OWNER_APPEARANCE_MS;
                s.visible = true;
                s.target = this.createTarget(TYPE.OWNER, SIZE.BIG, true);
            }
        } else if (time >= s.showUntil) {
            s.visible = false;
            if (s.target) { s.target.destroy(); s.target = null; }
        }
    }

    spawnTarget ()
    {
        const type = this.pickType();
        const size = this.pickSize();
        this.createTarget(type, size, false);
    }

    pickType ()
    {
        const roll = Math.random();
        if (roll < SPAWN_WEIGHTS.allyByRound(this.logic.round)) return TYPE.ALLY;
        return TYPE.ENEMY;
    }

    pickSize ()
    {
        const [big, medium] = SPAWN_WEIGHTS.sizeWeights;
        const roll = Math.random();
        if (roll < big) return SIZE.BIG;
        if (roll < big + medium) return SIZE.MEDIUM;
        return SIZE.SMALL;
    }

    createTarget (type, size, isOwner)
    {
        const baseSize = SCALE_PER_SIZE[size];
        const color = COLORS[type];

        const x = Phaser.Math.Between(120, 904);
        const baseY = 560;
        const scaleOffset = (1 - baseSize) * 160;
        const y = baseY - scaleOffset;

        const silhouette = this.add.container(x, y, [
            this.add.ellipse(0, -baseSize * 95, 150 * baseSize, 170 * baseSize, color),
            this.add.rectangle(0, 40 * baseSize, 170 * baseSize, 190 * baseSize, color)
        ]);

        silhouette.setData('type', type);
        silhouette.setData('size', size);
        silhouette.setData('score', isOwner ? 0 : SCORES[type][size]);
        silhouette.setData('isOwner', !!isOwner);
        silhouette.setDepth(10);
        silhouette.setInteractive(new Phaser.Geom.Rectangle(x - 100 * baseSize, y - 100 * baseSize, 200 * baseSize, 200 * baseSize), Phaser.Geom.Rectangle.Contains);
        silhouette.setScale(baseSize);

        this.targets.add(silhouette);
        this.silhouettes.push(silhouette);
        return silhouette;
    }

    drawCrosshair (x, y)
    {
        this.crosshair.clear();
        this.crosshair.lineStyle(3, 0xffffff, 1);
        this.crosshair.strokeCircle(x, y, 14);
        this.crosshair.lineBetween(x - 24, y, x - 8, y);
        this.crosshair.lineBetween(x + 8, y, x + 24, y);
        this.crosshair.lineBetween(x, y - 24, x, y - 8);
        this.crosshair.lineBetween(x, y + 8, x, y + 24);
        this.crosshair.fillStyle(0xff0000, 1);
        this.crosshair.fillCircle(x, y, 2);
    }

    shoot (pointer)
    {
        if (this.logic.gameOver) return;

        const hit = this.findTargetAt(pointer.x, pointer.y);
        if (!hit) return;

        const type = hit.getData('type');
        const size = hit.getData('size');
        const isOwner = hit.getData('isOwner');

        if (isOwner) {
            this.logic.hitOwner();
            this.finishGame();
            return;
        }

        this.logic.applyScore(type, size);
        this.showFloatingScore(hit.getData('score'), pointer.x, pointer.y);
        hit.destroy();
        this.removeTarget(hit);

        this.checkRoundProgress();
        this.updateHud();
    }

    findTargetAt (x, y)
    {
        for (let i = this.silhouettes.length - 1; i >= 0; i--) {
            const t = this.silhouettes[i];
            if (!t.active) continue;
            const rect = new Phaser.Geom.Rectangle(
                t.x - 100 * t.scaleX, t.y - 100 * t.scaleX,
                200 * t.scaleX, 200 * t.scaleX
            );
            if (rect.contains(x, y)) return t;
        }
        return null;
    }

    showFloatingScore (points, x, y)
    {
        const color = points >= 0 ? '#ffffff' : '#ff6666';
        const sign = points > 0 ? '+' : '';
        const text = this.add.text(x, y - 30, `${sign}${points}`, {
            fontFamily: 'Arial Black', fontSize: 24, color,
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(30);

        this.tweens.add({
            targets: text,
            y: y - 70,
            alpha: 0,
            duration: 500,
            onComplete: () => text.destroy()
        });
    }

    removeTarget (target)
    {
        this.silhouettes = this.silhouettes.filter(t => t !== target);
        if (this.ownerState.target === target) this.ownerState.target = null;
    }

    checkRoundProgress ()
    {
        if (this.logic.gameOver) return;

        if (this.logic.roundTimeLeft > 0 && this.logic.score >= this.logic.requiredPoints) {
            if (this.logic.round < TOTAL_ROUNDS) {
                this.clearTargets();
                this.logic.advanceRound();
                this.showRoundIntro();
            } else {
                this.logic.advanceRound();
                this.finishGame();
            }
        }
    }

    clearTargets ()
    {
        for (const t of this.silhouettes) {
            if (t.active) t.destroy();
        }
        this.silhouettes = [];
        this.ownerState.visible = false;
        this.ownerState.target = null;
    }

    finishGame ()
    {
        this.clearTargets();
        this.time.delayedCall(600, () => {
            this.scene.start('GameOver', {
                won: this.logic.won,
                reason: this.logic.lossReason,
                score: this.logic.score,
                round: this.logic.round
            });
        });
    }
}
