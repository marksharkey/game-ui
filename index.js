const React = require('react');
require('./styles.css');

const h = React.createElement;

function getHubToken() {
  if (typeof window === 'undefined') return '';
  const token = new URLSearchParams(window.location.search).get('hub_token') || localStorage.getItem('hubToken') || '';
  if (token) localStorage.setItem('hubToken', token);
  return token;
}

function hubHeaders() {
  const token = getHubToken();
  return token ? { 'X-Hub-Token': token } : {};
}

async function fetchHasPlayedToday(endpoint, playerName = '') {
  const url = new URL(endpoint, window.location.origin);
  if (playerName) url.searchParams.set('player_name', playerName);
  const response = await fetch(url.toString(), { headers: hubHeaders() });
  if (!response.ok) throw new Error(`Play status request failed: ${response.status}`);
  const data = await response.json();
  const played = data.has_played_today !== undefined ? data.has_played_today : (data.has_played !== undefined ? data.has_played : data.played);
  return typeof played === 'boolean' ? played : undefined;
}

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

function GameHeader({ game, links = [], currentGameKey, homeHref, homeLabel = 'Home', title = '' }) {
  const visibleLinks = currentGameKey ? links.filter((link) => link.key !== currentGameKey) : links;
  return h('header', { className: 'pp-game-header', style: { '--pp-accent': game.accent } },
    h('div', { className: 'pp-game-header-top' }, h(GameBrand, { game, size: 'header' }), title && h('h1', null, title)),
    h('nav', { className: 'pp-game-header-links', 'aria-label': 'Games' },
      visibleLinks.map((link) => h('a', { key: link.key, href: link.href, className: 'pp-game-link', 'data-game': link.key, style: { '--pp-link-color': link.color } },
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

function PrePlayBanner({ game, playHref, howToPlayHref }) {
  return h('div', { className: 'pp-preplay-banner', style: { '--pp-accent': game.accent } },
    h('div', { className: 'pp-preplay-message' }, h('strong', null, '🔒 Today\'s results are hidden until you play.')),
    h('div', { className: 'pp-preplay-actions' },
      playHref && h('a', { className: 'pp-preplay-primary', href: playHref }, 'Play Now'),
      howToPlayHref && h('a', { className: 'pp-preplay-secondary', href: howToPlayHref }, 'How to Play')
    )
  );
}

function AlreadyPlayedPage({ game, title = 'You already played today!', message = 'Come back tomorrow for a new puzzle.', detail = '', icon = '✅', leaderboardHref, homeHref }) {
  return h('main', { className: 'pp-status-page', style: { '--pp-accent': game.accent } },
    h('div', { className: 'pp-status-container' },
      h('section', { className: 'pp-status-card' },
        h(GameBrand, { game, size: 'header' }),
        h('div', { className: 'pp-status-message' },
          h('h1', null, h('span', { className: 'pp-status-icon', 'aria-hidden': 'true' }, icon), title),
          message && h('p', null, message),
          detail && h('p', { className: 'pp-status-detail' }, detail),
          h('div', { className: 'pp-status-actions' },
            leaderboardHref && h('a', { className: 'pp-status-primary', href: leaderboardHref }, 'View Leaderboard'),
            homeHref && h('a', { className: 'pp-status-secondary', href: homeHref }, 'Home')
          )
        )
      )
    )
  );
}

function LeaderboardFooter() {
  return h('footer', { className: 'pp-leaderboard-footer' }, 'PrecisionPros Games');
}

function LeaderboardPanel({ game, subtitle, dateSelector, children }) {
  return h('section', { className: 'pp-leaderboard-panel' },
    h('p', { className: 'pp-leaderboard-subtitle' }, subtitle),
    dateSelector,
    children
  );
}

function LeaderboardFrame({ game, title = 'Leaderboard', links = [], currentGameKey, homeHref, dateSelector, showPrePlayBanner = false, playHref, howToPlayHref, children }) {
  return h('main', { className: 'pp-leaderboard-page', style: { '--pp-accent': game.accent } },
    h('div', { className: 'pp-leaderboard-container' },
      h(GameHeader, { game, title, links, currentGameKey, homeHref }),
      dateSelector,
      showPrePlayBanner && h(PrePlayBanner, { game, playHref, howToPlayHref }),
      children,
      h(LeaderboardFooter)
    )
  );
}

module.exports = { AlreadyPlayedPage, GameBrand, GameHeader, DateSelector, PrePlayBanner, LeaderboardFooter, LeaderboardPanel, LeaderboardFrame, formatLeaderboardDate, getHubToken, hubHeaders, fetchHasPlayedToday };
