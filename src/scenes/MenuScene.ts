import * as Phaser from 'phaser';
import { announce } from '../ui/accessibility';
import type { GameMode } from '../game/types';

type MenuOption = { label: string; action: () => void };

export class MenuScene extends Phaser.Scene {
  private options: MenuOption[] = [];
  private labels: Phaser.GameObjects.Text[] = [];
  private selectedIndex = 0;

  constructor() {
    super('MenuScene');
  }

  create(): void {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#0f172a');

    this.add.text(width / 2, 64, 'Kid Math Monster', {
      fontSize: '46px',
      color: '#f8fafc',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, 112, 'Eat the right answers before time runs out!', {
      fontSize: '20px',
      color: '#bfdbfe',
    }).setOrigin(0.5);

    this.options = [
      { label: 'Play Multiplication', action: () => this.startGame('multiplication') },
      { label: 'Play Division', action: () => this.startGame('division') },
      { label: 'How to Play', action: () => this.scene.start('TutorialScene') },
    ];

    this.labels = this.options.map((option, index) =>
      this.add.text(width / 2, 220 + index * 70, option.label, {
        fontSize: '30px',
        color: '#fef08a',
        backgroundColor: '#1e293b',
        padding: { x: 22, y: 12 },
      }).setOrigin(0.5),
    );

    this.add.text(width / 2, height - 36, 'Arrow keys to move menu • Enter to choose', {
      fontSize: '18px',
      color: '#93c5fd',
    }).setOrigin(0.5);

    this.bindKeys();
    this.refreshSelection();
    announce('Main menu. Choose multiplication, division, or how to play.');
  }

  private bindKeys(): void {
    this.input.keyboard?.on('keydown-UP', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-DOWN', () => this.moveSelection(1));
    this.input.keyboard?.on('keydown-ENTER', () => this.options[this.selectedIndex].action());
  }

  private moveSelection(direction: number): void {
    const next = Phaser.Math.Wrap(this.selectedIndex + direction, 0, this.options.length);
    this.selectedIndex = next;
    this.refreshSelection();
    announce(this.options[this.selectedIndex].label);
  }

  private refreshSelection(): void {
    this.labels.forEach((label, index) => {
      label.setScale(index === this.selectedIndex ? 1.08 : 1);
      label.setColor(index === this.selectedIndex ? '#ffffff' : '#fde68a');
      label.setBackgroundColor(index === this.selectedIndex ? '#2563eb' : '#1e293b');
    });
  }

  private startGame(mode: GameMode): void {
    announce(`Starting ${mode} mode.`);
    this.scene.start('PlayScene', { mode, levelIndex: 0, score: 0 });
  }
}
