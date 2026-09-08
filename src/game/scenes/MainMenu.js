import { Scene } from 'phaser';
import { TOTAL_ROUNDS } from '../Config';
import { getHighScore } from '../HighScore';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x1a1a2e);

        this.add.text(512, 200, 'FERIA DE DISPAROS', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffd700',
            stroke: '#000000', strokeThickness: 10, align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 330, `High Score: ${getHighScore()}\nCompleta ${TOTAL_ROUNDS} rondas para ganar`, {
            fontFamily: 'Arial', fontSize: 22, color: '#ffffff',
            stroke: '#000000', strokeThickness: 4, align: 'center'
        }).setOrigin(0.5);

        const button = this.add.rectangle(512, 440, 260, 70, 0x2d2d44).setStrokeStyle(3, 0xffd700).setInteractive({ useHandCursor: true });
        this.add.text(512, 440, 'JUGAR', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 5
        }).setOrigin(0.5);

        button.on('pointerover', () => button.setFillStyle(0x3d3d55));
        button.on('pointerout', () => button.setFillStyle(0x2d2d44));
        button.on('pointerdown', () => this.scene.start('Game'));
    }
}
