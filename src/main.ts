import * as Phaser from 'phaser';
import './style.css';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { PlayScene } from './scenes/PlayScene';
import { ResultsScene } from './scenes/ResultsScene';
import { TutorialScene } from './scenes/TutorialScene';
import { initAccessibility } from './ui/accessibility';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="layout">
    <header class="topbar">
      <h1>Kid Math Monster</h1>
      <p>Keyboard game for multiplication and division facts</p>
    </header>
    <section class="controls-card" aria-label="Keyboard controls">
      <p><strong>Controls:</strong> Arrows/WASD move, Space eats selected tile, Enter confirms menu, Esc returns.</p>
    </section>
    <section class="game-shell">
      <div id="game-root" tabindex="0" aria-label="Kid Math Monster game board"></div>
    </section>
    <p id="sr-status" class="sr-only" role="status" aria-live="polite"></p>
  </main>
`;

initAccessibility();
document.querySelector<HTMLDivElement>('#game-root')?.focus();

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-root',
  width: 980,
  height: 700,
  backgroundColor: '#0f172a',
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
  scene: [BootScene, MenuScene, TutorialScene, PlayScene, ResultsScene],
};

new Phaser.Game(config);
