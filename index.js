const React = require('react');
require('./styles.css');

const h = React.createElement;

function formatLeaderboardDate(value) {
  if (!value) return 'Today';
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function GameBrand({ game, size = 'header', markOnly = false, className = '' }) {
  return h('div', { className: `pp-game-brand pp-game-brand-${size} ${markOnly ? 'pp-game-brand-mark-only' : ''} ${className}`.trim(), style: { '--pp-accent': game.accent } },
    h('div', { className: 'pp-game-brand-badge', style: { color: game.badgeColor || '#fff' } }, game.badge),
    !markOnly && h('div', { className: 'pp-game-brand-wordmark' },
      h('span', null, game.wordmarkMain || game.name),
      h('span', null, game.wordmarkAccent || 'Pro'),
      game.wordmarkSuffix && h('span', { className: 'pp-game-brand-wordmark-suffix' }, game.wordmarkSuffix)
    )
  );
}

function GameHeader({ game, links = [], homeHref, homeLabel = 'Home', title = '' }) {
  return h('header', { className: 'pp-game-header', style: { '--pp-accent': game.accent } },
    h('div', { className: 'pp-game-header-top' }, h(GameBrand, { game, size: 'header' }), title && h('h1', null, title)),
    h('nav', { className: 'pp-game-header-links', 'aria-label': 'Games' },
      links.map((link) => h('a', { key: link.key, href: link.href, className: 'pp-game-link', 'data-game': link.key, style: { '--pp-link-color': link.color } },
        h('b', null, link.letter), h('span', null, link.played ? 'LB' : 'Play')
      )),
      h('a', { className: 'pp-game-home-link', href: homeHref }, homeLabel)
    )
  );
}

function DateSelector({ dateLabel, onPrevious, onNext, onToday, showToday = false }) {
  return h('div', { className: 'pp-date-selector' },
    h('button', { type: 'button', onClick: onPrevious }, 'Prev'),
    h('strong', null, dateLabel),
    h('button', { type: 'button', onClick: onNext }, 'Next'),
    showToday && h('button', { type: 'button', onClick: onToday }, 'Today')
  );
}

function LeaderboardPanel({ game, subtitle, dateSelector, children }) {
  return h('section', { className: 'pp-leaderboard-panel' },
    h('p', { className: 'pp-leaderboard-subtitle' }, subtitle),
    dateSelector,
    children
  );
}

function LeaderboardFrame({ game, title = 'Leaderboard', links = [], homeHref, dateSelector, children }) {
  return h('main', { className: 'pp-leaderboard-page' },
    h('div', { className: 'pp-leaderboard-container' },
      h(GameHeader, { game, title, links, homeHref }),
      dateSelector,
      children
    )
  );
}

module.exports = { GameBrand, GameHeader, DateSelector, LeaderboardPanel, LeaderboardFrame, formatLeaderboardDate };
