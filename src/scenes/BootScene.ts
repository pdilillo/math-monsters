import * as Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  private drawMonsterFrame(
    graphics: Phaser.GameObjects.Graphics,
    textureKey: string,
    mouthOpen: number,
    tongueVisible = false,
  ): void {
    graphics.clear();

    // Body
    graphics.fillStyle(0x3aa55c, 1);
    graphics.fillEllipse(48, 52, 78, 62);
    graphics.fillStyle(0x2f8a4d, 1);
    graphics.fillEllipse(48, 58, 56, 28);

    // Short legs
    graphics.fillStyle(0x2f8a4d, 1);
    graphics.fillEllipse(28, 78, 22, 14);
    graphics.fillEllipse(68, 78, 22, 14);
    graphics.fillStyle(0x4fc273, 1);
    graphics.fillEllipse(28, 76, 12, 7);
    graphics.fillEllipse(68, 76, 12, 7);

    // Eyes
    graphics.fillStyle(0x4fc273, 1);
    graphics.fillCircle(30, 24, 12);
    graphics.fillCircle(66, 24, 12);
    graphics.fillStyle(0xffffff, 1);
    graphics.fillCircle(30, 24, 8);
    graphics.fillCircle(66, 24, 8);
    graphics.fillStyle(0x111111, 1);
    graphics.fillCircle(30, 24, 3);
    graphics.fillCircle(66, 24, 3);

    // Large mouth; opening amount changes per frame.
    graphics.fillStyle(0x112317, 1);
    graphics.fillEllipse(48, 52, 52, 16 + mouthOpen);
    graphics.fillStyle(0xdb5f83, 1);
    graphics.fillEllipse(48, 56, 46, 10 + mouthOpen);

    if (tongueVisible) {
      graphics.fillStyle(0xff7ba1, 1);
      graphics.fillRoundedRect(39, 54, 18, 18, 8);
    }

    graphics.generateTexture(textureKey, 96, 96);
  }

  create(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 }, false);
    graphics.fillStyle(0x8a5cf6, 1);
    graphics.fillRoundedRect(0, 0, 68, 68, 18);
    graphics.generateTexture('tile', 68, 68);
    graphics.clear();
    graphics.lineStyle(4, 0xdbeafe, 1);
    graphics.strokeRoundedRect(2, 2, 64, 64, 16);
    graphics.generateTexture('tile-outline', 68, 68);

    this.drawMonsterFrame(graphics, 'monster-idle', 0, false);
    this.drawMonsterFrame(graphics, 'monster-bite-1', 10, false);
    this.drawMonsterFrame(graphics, 'monster-bite-2', 22, true);
    this.drawMonsterFrame(graphics, 'monster-bite-3', 8, false);

    if (!this.anims.exists('monster-bite')) {
      this.anims.create({
        key: 'monster-bite',
        frames: [
          { key: 'monster-bite-1' },
          { key: 'monster-bite-2' },
          { key: 'monster-bite-3' },
          { key: 'monster-idle' },
        ],
        frameRate: 18,
        repeat: 0,
      });
    }

    graphics.destroy();

    this.scene.start('MenuScene');
  }
}
