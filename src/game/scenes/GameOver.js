import { Scene } from 'phaser';
import { saveHighScore, getHighScore } from '../HighScore';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    init (data)
    {
        this.result = data || {};
    }

    create ()
    {
        const won = this.result.won;
        const reason = this.result.reason;
        const score = this.result.score || 0;
        const round = this.result.round || 1;

        const best = saveHighScore(score);

        this.cameras.main.setBackgroundColor(0x1a1a2e);

        this.add.text(512, 160, won ? '¡VICTORIA!' : 'GAME OVER', {
            fontFamily: 'Arial Black', fontSize: 64, color: won ? '#ffd700' : '#ff4444',
            stroke: '#000000', strokeThickness: 10, align: 'center'
        }).setOrigin(0.5);

        const lines = [
            `Puntaje final: ${score}`,
            `Ronda alcanzada: ${round}`,
            `High Score: ${best}`
        ];

        if (!won && reason) {
            lines.unshift(reason === 'dueño' ? '¡Disparaste al dueño!' : 'Se acabó el tiempo sin alcanzar la meta');
        }

        this.add.text(512, 320, lines.join('\n'), {
            fontFamily: 'Arial', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        }).setOrigin(0.5);

        const button = this.add.rectangle(512, 480, 260, 60, 0x2d2d44).setStrokeStyle(3, 0xffd700).setInteractive({ useHandCursor: true });
        this.add.text(512, 480, 'MENÚ', {
            fontFamily: 'Arial Black', fontSize: 26, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5);

        button.on('pointerover', () => button.setFillStyle(0x3d3d55));
        button.on('pointerout', () => button.setFillStyle(0x2d2d44));
        button.on('pointerdown', () => this.scene.start('MainMenu'));
    }
}
