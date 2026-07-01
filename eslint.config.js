// eslint.config.js — ESLint 9 flat config
// הפרויקט מערבב ESM (brain/mascot/extension entries/tests) עם CommonJS (desktop/main, netlify functions, verify-*.js)

const browserGlobals = {
  window: 'readonly', document: 'readonly', navigator: 'readonly', location: 'readonly',
  console: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly',
  setInterval: 'readonly', clearInterval: 'readonly', fetch: 'readonly',
  MutationObserver: 'readonly', MouseEvent: 'readonly', KeyboardEvent: 'readonly',
  CustomEvent: 'readonly', chrome: 'readonly', localStorage: 'readonly',
  URL: 'readonly', Request: 'readonly',
}

const nodeGlobals = {
  require: 'readonly', module: 'readonly', exports: 'writable', process: 'readonly',
  __dirname: 'readonly', __filename: 'readonly', console: 'readonly', Buffer: 'readonly',
  setTimeout: 'readonly', clearTimeout: 'readonly', global: 'readonly', fetch: 'readonly',
  URL: 'readonly',
}

const jestGlobals = {
  describe: 'readonly', test: 'readonly', it: 'readonly', expect: 'readonly',
  beforeEach: 'readonly', afterEach: 'readonly', beforeAll: 'readonly', afterAll: 'readonly',
}

const baseRules = {
  'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  'no-undef': 'error',
  'no-const-assign': 'error',
  'no-dupe-keys': 'error',
  'no-unreachable': 'error',
  'no-fallthrough': 'error',
}

module.exports = [
  {
    ignores: [
      'node_modules/**',
      '_לסקירה/**',
      'dist-installer/**',
      'dist/**',
      'extension/content/bundle.js',
      'extension/background.js',
      'extension/popup/popup.js',
      'desktop/renderer.js',
      'screenshots/**',
      '.netlify/**',
      'web/**',
      'mobile/**',
      'payments/**',
    ],
  },
  // ESM source: brain / mascot / agent / shared / extension entries+modules
  {
    files: ['brain/**/*.js', 'mascot/**/*.js', 'agent/**/*.js', 'shared/**/*.js',
             'extension/*-entry.js', 'extension/content/*.js', 'extension/popup/*-entry.js',
             'desktop/renderer-entry.js'],
    ignores: ['extension/content/bundle.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: browserGlobals,
    },
    rules: baseRules,
  },
  // Tests (ESM + jest globals)
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...jestGlobals, console: 'readonly' },
    },
    rules: baseRules,
  },
  // CommonJS: desktop main/preload, netlify functions
  {
    files: ['desktop/main.js', 'desktop/preload.js', 'netlify/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: nodeGlobals,
    },
    rules: baseRules,
  },
  // Playwright dev scripts: Node outer scope + inline page.evaluate() browser callbacks
  {
    files: ['verify-*.js', 'show-clippy-live.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...nodeGlobals, ...browserGlobals },
    },
    rules: baseRules,
  },
]
