// Renderizador de Markdown com o subconjunto usado nos conteúdos do site.
// Emite as classes que o site.css já estiliza, em vez de HTML genérico.
//
// Suporta: ## e ###, parágrafos, listas ordenadas e não ordenadas, **negrito**,
// *itálico*, [links](url), > citações (viram .reading-note), --- e HTML cru.
// O primeiro parágrafo recebe .article-lead.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ESC[c]);

/** Marcação de linha: negrito, itálico, código e links. */
function inline(text) {
  let out = esc(text);
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
  // Links externos abrem em nova aba; internos, não.
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) =>
    /^https?:\/\//.test(href)
      ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`
      : `<a href="${href}">${label}</a>`);
  return out;
}

/** Converte um id legível a partir do texto de um heading, para âncoras e sumário. */
export function slugify(text) {
  return String(text)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * @returns {{html: string, headings: {level: number, text: string, id: string}[], words: number}}
 */
export function render(markdown) {
  const lines = String(markdown).replace(/\r\n/g, '\n').split('\n');
  const out = [];
  const headings = [];
  let paragraph = [];
  let list = null;      // {tag: 'ul'|'ol', items: string[]}
  let quote = [];
  let firstParagraphDone = false;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const cls = firstParagraphDone ? '' : ' class="article-lead"';
    firstParagraphDone = true;
    out.push(`<p${cls}>${inline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (!list) return;
    out.push(`<${list.tag}>${list.items.map(i => `<li>${inline(i)}</li>`).join('')}</${list.tag}>`);
    list = null;
  };
  const flushQuote = () => {
    if (!quote.length) return;
    // Citação cujo primeiro trecho é negrito vira nota com título destacado.
    const first = quote[0];
    const m = first.match(/^\*\*(.+?)\*\*\s*(.*)$/);
    const rest = quote.slice(1).join(' ');
    out.push(m
      ? `<div class="reading-note"><strong>${inline(m[1])}</strong><p>${inline([m[2], rest].filter(Boolean).join(' '))}</p></div>`
      : `<div class="reading-note"><p>${inline(quote.join(' '))}</p></div>`);
    quote = [];
  };
  const flushAll = () => { flushParagraph(); flushList(); flushQuote(); };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (!line.trim()) { flushAll(); continue; }

    // HTML cru: passa adiante sem tocar.
    if (/^\s*</.test(line)) { flushAll(); out.push(line.trim()); continue; }

    const heading = line.match(/^(#{2,3})\s+(.*)$/);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      const text = heading[2].trim();
      const id = slugify(text);
      headings.push({ level, text, id });
      out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);
      continue;
    }

    if (/^---+$/.test(line)) { flushAll(); out.push('<hr>'); continue; }

    const q = line.match(/^>\s?(.*)$/);
    if (q) { flushParagraph(); flushList(); quote.push(q[1]); continue; }

    const ul = line.match(/^[-*]\s+(.*)$/);
    const ol = line.match(/^\d+[.)]\s+(.*)$/);
    if (ul || ol) {
      flushParagraph(); flushQuote();
      const tag = ul ? 'ul' : 'ol';
      if (!list || list.tag !== tag) { flushList(); list = { tag, items: [] }; }
      list.items.push((ul || ol)[1]);
      continue;
    }

    flushList(); flushQuote();
    paragraph.push(line.trim());
  }
  flushAll();

  const words = String(markdown).replace(/[#>*\-`[\]()]/g, ' ').split(/\s+/).filter(Boolean).length;
  return { html: out.join(''), headings, words };
}

/**
 * Frontmatter simples, sem dependência de YAML.
 * Chaves repetíveis: `source` (formato `Rótulo | URL`).
 * Listas: `tags` separadas por vírgula.
 */
export function parseFrontmatter(file) {
  const m = String(file).replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error('Arquivo de post sem frontmatter delimitado por ---');
  const meta = { sources: [] };
  for (const line of m[1].split('\n')) {
    if (!line.trim() || /^\s*#/.test(line)) continue;
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!kv) throw new Error('Linha de frontmatter inválida: ' + line);
    let [, key, value] = kv;
    // Aspas só são necessárias quando o valor contém ":"; não fazem parte do dado.
    value = value.replace(/^(["'])([\s\S]*)\1$/, '$2');
    if (key === 'source') {
      const [label, url] = value.split('|').map(s => s.trim());
      if (!label || !url) throw new Error('source precisa do formato "Rótulo | URL": ' + value);
      meta.sources.push({ label, url });
    } else if (key === 'tags') {
      meta.tags = value.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      meta[key] = value.trim();
    }
  }
  return { meta, body: m[2] };
}
