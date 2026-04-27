import * as Phaser from 'phaser';
import { LEVELS } from '../game/levels';
import type { GameMode } from '../game/types';
import { announce } from '../ui/accessibility';

interface ResultsData {
  mode: GameMode;
  levelIndex: number;
  score: number;
  success: boolean;
  bonus: number;
}

export class ResultsScene extends Phaser.Scene {
  constructor() {
    super('ResultsScene');
  }

  create(data: ResultsData): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#312e81');
    const title = data.success ? 'Level Cleared!' : 'Try Again!';
    const nextExists = data.success && data.levelIndex + 1 < LEVELS.length;

    this.add.text(width / 2, 120, title, { fontSize: '52px', color: '#fef08a', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(width / 2, 220, `Total Score: ${data.score}`, { fontSize: '34px', color: '#e0e7ff' }).setOrigin(0.5);
    this.add.text(width / 2, 270, `Speed Bonus: ${data.bonus}`, { fontSize: '28px', color: '#bfdbfe' }).setOrigin(0.5);
    this.add.text(
      width / 2,
      height - 56,
      nextExists ? 'Enter: Next level   M: Menu' : 'Enter: Replay level   M: Menu',
      { fontSize: '22px', color: '#dbeafe' },
    ).setOrigin(0.5);

    this.input.keyboard?.on('keydown-ENTER', () => {
      const levelIndex = nextExists ? data.levelIndex + 1 : data.levelIndex;
      this.scene.start('PlayScene', { mode: data.mode, levelIndex, score: data.score });
    });
    this.input.keyboard?.on('keydown-M', () => this.scene.start('MenuScene'));

    announce(`${title} Your score is ${data.score}.`);
  }
}
