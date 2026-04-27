import * as Phaser from 'phaser';
import { buildBoardAnswers } from '../game/boardGenerator';
import { LEVELS } from '../game/levels';
import { generateProblems } from '../game/problemGenerator';
import { levelCompleteBonus, penaltyForWrongAnswer, scoreForCorrectAnswer } from '../game/scoring';
import type { GameSession } from '../game/session';
import type { GameMode, LevelConfig } from '../game/types';
import { announce } from '../ui/accessibility';

interface PlaySceneData {
  mode: GameMode;
  levelIndex: number;
  score: number;
}

interface AnswerTile {
  bg: Phaser.Physics.Arcade.Image;
  outline: Phaser.GameObjects.Image;
  text: Phaser.GameObjects.Text;
  value: number;
  eaten: boolean;
}

export class PlayScene extends Phaser.Scene {
  private session!: GameSession;
  private monster!: Phaser.Physics.Arcade.Sprite;
  private tiles: AnswerTile[] = [];
  private tileByCell = new Map<string, AnswerTile>();
  private currentCell = { row: 0, col: 0 };
  private lastMoveMs = 0;
  private hud!: Phaser.GameObjects.Text;
  private promptText!: Phaser.GameObjects.Text;
  private timerEvent?: Phaser.Time.TimerEvent;
  private timeRemaining = 0;
  private solvedAnswers = new Set<number>();
  private activeProblem?: { prompt: string; answer: number };

  constructor() {
    super('PlayScene');
  }

  create(data: PlaySceneData): void {
    this.resetLevelState();
    const levelConfig = LEVELS[Math.min(data.levelIndex, LEVELS.length - 1)];
    const problems = generateProblems(data.mode, levelConfig.problemCount, levelConfig.minFactor, levelConfig.maxFactor);
    const targetAnswers = [...new Set(problems.map((problem) => problem.answer))];

    this.session = {
      mode: data.mode,
      levelIndex: data.levelIndex,
      score: data.score,
      levelConfig,
      problems,
      targetAnswers,
      startTimeMs: this.time.now,
      wrongAttempts: 0,
    };
    this.timeRemaining = levelConfig.timeLimitSeconds;
    this.cameras.main.setBackgroundColor('#111827');

    this.promptText = this.add.text(24, 16, '', { fontSize: '28px', color: '#fef3c7' });
    this.hud = this.add.text(24, 54, '', { fontSize: '22px', color: '#dbeafe' });

    this.buildBoard(levelConfig, targetAnswers);
    this.spawnMonster();
    this.bindControls(levelConfig);
    this.startTimer();
    this.pickNextProblem();
    this.refreshHud();
    announce(`Level ${levelConfig.level}. Eat the answer and press space to select.`);
  }

  private resetLevelState(): void {
    this.tiles = [];
    this.tileByCell.clear();
    this.currentCell = { row: 0, col: 0 };
    this.lastMoveMs = 0;
    this.solvedAnswers.clear();
    this.activeProblem = undefined;
  }

  private buildBoard(levelConfig: LevelConfig, targetAnswers: number[]): void {
    const tileSize = 82;
    const boardWidth = levelConfig.cols * tileSize;
    const startX = (this.scale.width - boardWidth) / 2 + tileSize / 2;
    const startY = 130;
    const boardValues = buildBoardAnswers(targetAnswers, levelConfig.rows * levelConfig.cols, 1, levelConfig.maxFactor * levelConfig.maxFactor + 10);

    boardValues.forEach((value, index) => {
      const row = Math.floor(index / levelConfig.cols);
      const col = index % levelConfig.cols;
      const x = startX + col * tileSize;
      const y = startY + row * tileSize;
      const bg = this.physics.add.image(x, y, 'tile').setImmovable(true).setDepth(0);
      const outline = this.add.image(x, y, 'tile-outline').setDepth(0.8);
      const text = this.add.text(x, y, String(value), { fontSize: '28px', color: '#f8fafc' }).setOrigin(0.5).setDepth(2);
      const tile: AnswerTile = { bg, outline, text, value, eaten: false };
      this.tiles.push(tile);
      this.tileByCell.set(`${row}-${col}`, tile);
    });
  }

  private spawnMonster(): void {
    const tile = this.tileByCell.get('0-0');
    if (!tile) {
      throw new Error('Missing starting tile');
    }
    this.monster = this.physics.add.sprite(tile.bg.x, tile.bg.y, 'monster-idle');
    this.monster.setDepth(1);
  }

  private bindControls(levelConfig: LevelConfig): void {
    const move = (dx: number, dy: number): void => {
      if (this.time.now - this.lastMoveMs < 110) {
        return;
      }
      const nextRow = Phaser.Math.Clamp(this.currentCell.row + dy, 0, levelConfig.rows - 1);
      const nextCol = Phaser.Math.Clamp(this.currentCell.col + dx, 0, levelConfig.cols - 1);
      this.currentCell = { row: nextRow, col: nextCol };
      const target = this.tileByCell.get(`${nextRow}-${nextCol}`);
      if (target) {
        this.monster.setPosition(target.bg.x, target.bg.y);
      }
      this.lastMoveMs = this.time.now;
      this.highlightCurrentTile();
    };

    this.input.keyboard?.on('keydown-LEFT', () => move(-1, 0));
    this.input.keyboard?.on('keydown-A', () => move(-1, 0));
    this.input.keyboard?.on('keydown-RIGHT', () => move(1, 0));
    this.input.keyboard?.on('keydown-D', () => move(1, 0));
    this.input.keyboard?.on('keydown-UP', () => move(0, -1));
    this.input.keyboard?.on('keydown-W', () => move(0, -1));
    this.input.keyboard?.on('keydown-DOWN', () => move(0, 1));
    this.input.keyboard?.on('keydown-S', () => move(0, 1));
    this.input.keyboard?.on('keydown-SPACE', () => this.eatCurrentTile());
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('MenuScene'));
    this.highlightCurrentTile();
  }

  private highlightCurrentTile(): void {
    const key = `${this.currentCell.row}-${this.currentCell.col}`;
    this.tiles.forEach((tile) => {
      const isCurrent = tile === this.tileByCell.get(key);
      tile.bg.setTint(isCurrent ? 0x38bdf8 : 0xffffff);
      tile.outline.setTint(isCurrent ? 0x67e8f9 : 0xffffff);
    });
  }

  private eatCurrentTile(): void {
    const tile = this.tileByCell.get(`${this.currentCell.row}-${this.currentCell.col}`);
    if (!tile || tile.eaten) {
      return;
    }
    this.monster.play('monster-bite', true);

    if (this.activeProblem && tile.value === this.activeProblem.answer) {
      tile.eaten = true;
      tile.bg.setAlpha(0.2);
      tile.text.setVisible(false);
      this.solvedAnswers.add(tile.value);
      this.session.score += scoreForCorrectAnswer(this.session.levelConfig.level);
      announce(`Correct! ${tile.value} eaten.`);
      this.flashMonster(0x22c55e);
      this.pickNextProblem();
    } else {
      this.session.wrongAttempts += 1;
      this.session.score = Math.max(0, this.session.score - penaltyForWrongAnswer());
      this.timeRemaining = Math.max(0, this.timeRemaining - 2);
      announce('Wrong answer. Try again.');
      this.flashMonster(0xfb7185);
    }

    this.refreshHud();
    this.checkLevelOutcome();
  }

  private flashMonster(color: number): void {
    this.monster.setTint(color);
    this.tweens.add({
      targets: this.monster,
      scale: 1.18,
      duration: 100,
      yoyo: true,
      onComplete: () => this.monster.clearTint(),
    });
  }

  private startTimer(): void {
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.timeRemaining = Math.max(0, this.timeRemaining - 1);
        this.refreshHud();
        if (this.timeRemaining <= 0) {
          this.finishLevel(false);
        }
      },
    });
  }

  private refreshHud(): void {
    this.promptText.setText(`Solve: ${this.activeProblem?.prompt ?? 'All done!'}`);
    this.hud.setText(`Mode: ${this.session.mode}   Level: ${this.session.levelConfig.level}   Score: ${this.session.score}   Time: ${this.timeRemaining}`);
  }

  private pickNextProblem(): void {
    const remainingAnswers = new Set(
      this.tiles.filter((tile) => !tile.eaten).map((tile) => tile.value),
    );
    const unresolved = this.session.problems.filter(
      (problem) => !this.solvedAnswers.has(problem.answer) && remainingAnswers.has(problem.answer),
    );
    this.activeProblem = unresolved[0];
  }

  private checkLevelOutcome(): void {
    if (this.session.targetAnswers.every((value) => this.solvedAnswers.has(value))) {
      this.finishLevel(true);
    }
  }

  private finishLevel(success: boolean): void {
    this.timerEvent?.remove();
    const bonus = success
      ? levelCompleteBonus({
          basePoints: this.session.levelConfig.level * 50,
          timeRemaining: this.timeRemaining,
          wrongAttempts: this.session.wrongAttempts,
        })
      : 0;
    const finalScore = this.session.score + bonus;
    announce(success ? `Level cleared. Bonus ${bonus} points.` : 'Time up. Level over.');
    this.scene.start('ResultsScene', {
      mode: this.session.mode,
      levelIndex: this.session.levelIndex,
      score: finalScore,
      success,
      bonus,
    });
  }
}
