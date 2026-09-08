/* Translation coverage without a build tool or browser dependency. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const context = { window: { KIO_STORE: { prefs: { language: 'ko' } } } };
vm.createContext(context);
['presets', 'i18n'].forEach(name => {
  vm.runInContext(fs.readFileSync(path.join(root, 'js', name + '.js'), 'utf8'), context);
});
const app = context.window;
const originals = app.KIO_PRESETS.map(p => p.build());
const before = JSON.stringify(originals);
const sources = originals.flatMap(config => [
  ...config.categories.map(c => c.name),
  ...config.menus.flatMap(m => [m.name, m.desc]),
  ...config.optionGroups.flatMap(g => [g.name, ...g.options.map(o => o.name)]),
  ...config.store.headline.split('\n'), config.store.lede
]).filter(source => /[가-힣]/.test(source));
for (const language of ['en', 'ja', 'zh']) {
  app.KIO_STORE.prefs.language = language;
  for (const source of sources) {
    assert(!/[가-힣]/.test(app.KIO_I18N.text(source)), language + ': ' + source);
  }
  assert.equal(app.KIO_I18N.text('직접 작성한 메뉴 <b>새것</b>'), '직접 작성한 메뉴 <b>새것</b>');
  const markup = app.KIO_I18N.html('<button aria-label="뒤로">메뉴 선택</button>');
  assert(!/[가-힣]/.test(markup));
  assert(markup.startsWith('<button aria-label="'));
  assert(markup.endsWith('</button>'));
}
assert.equal(JSON.stringify(originals), before);
for (const language of ['ko', 'unsupported']) {
  app.KIO_STORE.prefs.language = language;
  assert.equal(app.KIO_I18N.text('주문 시작하기'), '주문 시작하기');
  assert.equal(app.KIO_I18N.locale(), 'ko');
}
console.log('번역 누락 없음 · 원본 보존 · 미지원 언어 폴백 정상');
