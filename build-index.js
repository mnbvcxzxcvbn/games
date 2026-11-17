// 完成済みゲーム（games/NNN-slug/index.html が存在するもの）だけを載せた index.html を生成する。
// 使い方: node build-index.js
const fs = require('fs');
const path = require('path');
const games = JSON.parse(fs.readFileSync(path.join(__dirname, 'games.json'), 'utf8'));
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const done = games
  .map(g => ({ ...g, dir: `games/${String(g.id).padStart(3, '0')}-${g.slug}` }))
  .filter(g => fs.existsSync(path.join(__dirname, g.dir, 'index.html')));

const cards = done.map(g => `
    <a class="card" href="${g.dir}/index.html">
      <div class="meta"><span class="no">No.${String(g.id).padStart(3, '0')}</span><span class="dim d${g.dim}">${g.dim}</span></div>
      <h2>${esc(g.title)}</h2>
      <p>${esc(g.desc)}</p>
      <span class="play">あそぶ →</span>
    </a>`).join('');

const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>100個のバカゲー</title>
<style>
  :root{--bg:#fff8e7;--ink:#1d1a16;--sub:#6b6258;--card:#fff;--line:#1d1a16;--accent:#ff4d2e;--y:#ffd43b;--b:#3b82f6}
  @media (prefers-color-scheme:dark){:root{--bg:#17140f;--ink:#f6efe0;--sub:#a99f90;--card:#221e17;--line:#f6efe0}}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font-family:"Hiragino Kaku Gothic ProN","Yu Gothic","Noto Sans JP",system-ui,sans-serif;line-height:1.7}
  header{padding:56px 16px 24px;text-align:center}
  h1{font-size:clamp(34px,8vw,72px);margin:0;letter-spacing:.02em;line-height:1.1;font-weight:900}
  h1 span{background:var(--y);color:#1d1a16;padding:0 .15em;display:inline-block;transform:rotate(-2deg);border:3px solid var(--line)}
  header p{color:var(--sub);margin:16px auto 0;max-width:36em}
  .count{display:inline-block;margin-top:14px;font-weight:700;border:2px solid var(--line);border-radius:999px;padding:2px 14px;font-size:14px}
  main{max-width:1120px;margin:0 auto;padding:16px 16px 80px;display:grid;gap:18px;grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
  .card{display:flex;flex-direction:column;background:var(--card);color:inherit;text-decoration:none;border:3px solid var(--line);border-radius:14px;padding:18px;box-shadow:5px 5px 0 var(--line);transition:transform .12s,box-shadow .12s}
  .card:hover,.card:focus-visible{transform:translate(-3px,-3px) rotate(-.6deg);box-shadow:8px 8px 0 var(--accent);outline:none}
  .meta{display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:var(--sub)}
  .dim{padding:0 8px;border-radius:999px;color:#fff}
  .d2D{background:var(--accent)}.d3D{background:var(--b)}
  h2{font-size:21px;margin:8px 0 6px;line-height:1.35}
  .card p{margin:0;font-size:13.5px;color:var(--sub);display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
  .play{margin-top:auto;padding-top:12px;font-weight:800;color:var(--accent)}
  footer{text-align:center;color:var(--sub);font-size:12px;padding:0 16px 40px}
</style>
</head>
<body>
<header>
  <h1><span>100個</span>のバカゲー</h1>
  <p>独創性・馬鹿馬鹿しさ・変な操作・ちょっとした物語。ブラウザですぐ遊べる一発ネタゲーム集。</p>
  <div class="count">現在 ${done.length} 本 公開中</div>
</header>
<main>${cards}
</main>
<footer>#100個のバカゲー</footer>
</body>
</html>
`;
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log(`index.html: ${done.length} games`);
