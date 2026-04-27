import * as Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    graphics.fillStyle(0x8a5cf6, 1);
    graphics.fillRoundedRect(0, 0, 68, 68, 18);
    graphics.generateTexture('tile', 68, 68);
    graphics.clear();

    graphics.fillStyle(0x37d67a, 1);
    graphics.fillCircle(30, 30, 30);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(20, 22, 8);
    graphics.fillCircle(40, 22, 8);
    graphics.fillStyle(0x111111, 1);
    graphics.fillCircle(20, 22, 3);
    graphics.fillCircle(40, 22, 3);
    graphics.fillStyle(0xff5a7d, 1);
    graphics.fillEllipse(30, 40, 34, 18);
    graphics.generateTexture('monster', 60, 60);
    graphics.destroy();

    this.scene.start('MenuScene');
  }
}
