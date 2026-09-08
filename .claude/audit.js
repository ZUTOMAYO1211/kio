/* 마크업에 쓰였는데 CSS 에 규칙이 없는 클래스를 찾는다.
   리팩터로 CSS 만 새로 쓰고 마크업을 두면 레이아웃이 조용히 깨지는데,
   그게 눈에 보이기 전에 잡으려고 만들었다.
   실행: node .claude/audit.js */
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readdirSync(path.join(root, 'css'))
  .filter(f => f.endsWith('.css'))
  .map(f => fs.readFileSync(path.join(root, 'css', f), 'utf8'))
  .join('\n');

const used = new Set();
for (const m of html.matchAll(/class="([^"]+)"/g)) {
  m[1].split(/\s+/).forEach(c => c && used.add(c));
}

/* 화면 블록 이름은 .screen 에서 전부 상속받으므로 자기 규칙이 없어도 정상 */
const inherited = new Set(['otype', 'cart', 'pay']);

const orphans = [...used]
  .filter(c => !inherited.has(c))
  .filter(c => !new RegExp('\\.' + c.replace(/-/g, '\\-') + '(?![\\w-])').test(css));

if (orphans.length) {
  console.log('CSS 규칙이 없는 클래스:');
  orphans.forEach(c => console.log('  .' + c));
  process.exit(1);
}
console.log('고아 클래스 없음');
