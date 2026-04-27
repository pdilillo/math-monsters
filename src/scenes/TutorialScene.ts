import * as Phaser from 'phaser';
import { announce } from '../ui/accessibility';

const STEPS = [
  'Move your monster with Arrow keys or WASD.',
  'Stand on an answer tile and press Space to eat it.',
  'Correct answers earn points. Wrong answers lose points and time.',
  'Eat all required answers to clear the level and earn speed bonus.',
  'Practice now: move to 12 and press Space.',
];

export class TutorialScene extends Phaser.Scene {
  private stepIndex = 0;
  private cardText!: Phaser.GameObjects.Text;
  private practiceMonster?: Phaser.Physics.Arcade.Sprite;
  private practiceTarget?: Phaser.GameObjects.Text;
  private practiceDone = false;

  constructor() {
    super('TutorialScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#082f49');

    this.add.text(width / 2, 56, 'How to Play', { fontSize: '44px', color: '#f8fafc', fontStyle: 'bold' }).setOrigin(0.5);
    this.cardText = this.add.text(width / 2, 180, '', {
      fontSize: '28px',
      color: '#e0f2fe',
      align: 'center',
      wordWrap: { width: width - 140 },
    }).setOrigin(0.5);

    this.add.text(width / 2, height - 34, 'Left/Right: Step • Enter: Next • Esc: Menu', {
      fontSize: '18px',
      color: '#bae6fd',
    }).setOrigin(0.5);

    this.input.keyboard?.on('keydown-LEFT', () => this.goStep(-1));
    this.input.keyboard?.on('keydown-RIGHT', () => this.goStep(1));
    this.input.keyboard?.on('keydown-ENTER', () => this.goStep(1));
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('MenuScene'));
    this.input.keyboard?.on('keydown-SPACE', () => this.tryPracticeEat());

    this.updateStep();
  }

  private goStep(delta: number): void {
    this.stepIndex = Phaser.Math.Clamp(this.stepIndex + delta, 0, STEPS.length - 1);
    this.updateStep();
  }

  private updateStep(): void {
    this.cardText.setText(`Step ${this.stepIndex + 1}: ${STEPS[this.stepIndex]}`);
    announce(STEPS[this.stepIndex]);
    this.practiceMonster?.destroy();
    this.practiceTarget?.destroy();
    this.practiceMonster = undefined;
    this.practiceTarget = undefined;
    this.practiceDone = false;

    if (this.stepIndex === STEPS.length - 1) {
      this.spawnPractice();
    }
  }

  private spawnPractice(): void {
    const centerX = this.scale.width / 2;
    const y = 300;
    this.practiceMonster = this.physics.add.sprite(centerX - 150, y, 'monster-idle');
    this.practiceTarget = this.add.text(centerX + 120, y - 18, '12', {
      fontSize: '44px',
      color: '#fef08a',
      backgroundColor: '#581c87',
      padding: { x: 20, y: 12 },
    });

    this.input.keyboard?.on('keydown-RIGHT', () => {
      if (!this.practiceMonster || this.stepIndex !== STEPS.length - 1) {
        return;
      }
      this.practiceMonster.x = Math.min(this.practiceMonster.x + 50, centerX + 120);
    });
  }

  private tryPracticeEat(): void {
    if (this.stepIndex !== STEPS.length - 1 || !this.practiceMonster || !this.practiceTarget || this.practiceDone) {
      return;
    }
    if (Math.abs(this.practiceMonster.x - (this.scale.width / 2 + 140)) > 35) {
      announce('Move closer to 12, then press space to eat it.');
      return;
    }
    this.practiceDone = true;
    this.practiceTarget.setText('YUM!');
    announce('Great job! Tutorial complete. Press Escape to return to menu.');
  }
}
