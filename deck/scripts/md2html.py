#!/usr/bin/env python3
"""Minimal markdown -> standalone HTML, for honest before/after screenshots.

Deliberately plain: GitHub-ish typography, one column, no cards, no diagrams.
That is what a developer sees when they open a spec.md.
"""
import html, re, sys

def inline(s):
    s = html.escape(s, quote=False)
    s = re.sub(r"`([^`]+)`", r"<code>\1</code>", s)
    s = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", s)
    s = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', s)
    return s

def convert(md):
    lines, out, i = md.split("\n"), [], 0
    while i < len(lines):
        ln = lines[i]
        if ln.startswith("```"):
            i += 1
            buf = []
            while i < len(lines) and not lines[i].startswith("```"):
                buf.append(lines[i]); i += 1
            out.append("<pre><code>" + html.escape("\n".join(buf)) + "</code></pre>")
            i += 1; continue
        m = re.match(r"^(#{1,6})\s+(.*)$", ln)
        if m:
            lvl = len(m.group(1))
            out.append(f"<h{lvl}>{inline(m.group(2))}</h{lvl}>")
            i += 1; continue
        if ln.startswith(">"):
            buf = []
            while i < len(lines) and lines[i].startswith(">"):
                buf.append(lines[i].lstrip("> ").strip()); i += 1
            out.append("<blockquote>" + inline(" ".join(buf)) + "</blockquote>")
            continue
        if ln.strip().startswith("|") and i + 1 < len(lines) and re.match(r"^\s*\|[\s:|-]+\|\s*$", lines[i+1]):
            rows = []
            header = [c.strip() for c in ln.strip().strip("|").split("|")]
            i += 2
            while i < len(lines) and lines[i].strip().startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")]); i += 1
            t = "<table><thead><tr>" + "".join(f"<th>{inline(c)}</th>" for c in header) + "</tr></thead><tbody>"
            for r in rows:
                t += "<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>"
            out.append(t + "</tbody></table>")
            continue
        m = re.match(r"^\s*[-*]\s+(.*)$", ln)
        if m:
            items = []
            while i < len(lines) and re.match(r"^\s*[-*]\s+", lines[i]):
                items.append(re.sub(r"^\s*[-*]\s+", "", lines[i])); i += 1
            out.append("<ul>" + "".join(f"<li>{inline(x)}</li>" for x in items) + "</ul>")
            continue
        m = re.match(r"^\s*\d+\.\s+(.*)$", ln)
        if m:
            items = []
            while i < len(lines) and re.match(r"^\s*\d+\.\s+", lines[i]):
                items.append(re.sub(r"^\s*\d+\.\s+", "", lines[i])); i += 1
            out.append("<ol>" + "".join(f"<li>{inline(x)}</li>" for x in items) + "</ol>")
            continue
        if ln.strip():
            buf = [ln.strip()]
            i += 1
            while i < len(lines) and lines[i].strip() and not re.match(r"^(#{1,6}\s|\s*[-*]\s|\s*\d+\.\s|>|\||```)", lines[i]):
                buf.append(lines[i].strip()); i += 1
            out.append("<p>" + inline(" ".join(buf)) + "</p>")
            continue
        i += 1
    return "\n".join(out)

CSS = """
:root{--ink:#e8eef4;--dim:#96a2ad;--line:#26313a;--bg:#0b0f13;--code:#121920}
*{box-sizing:border-box;margin:0}
body{background:var(--bg);color:var(--ink);font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;padding:32px 40px 80px;max-width:980px;margin:0 auto}
h1{font-size:1.9rem;line-height:1.25;margin:0 0 8px;padding-bottom:8px;border-bottom:1px solid var(--line);color:#fff}
h2{font-size:1.25rem;margin:28px 0 8px;padding-bottom:6px;border-bottom:1px solid var(--line)}
h3{font-size:1.05rem;margin:20px 0 6px}
p{margin:10px 0}
a{color:#35e0c0}
code{background:var(--code);padding:.15em .35em;border-radius:4px;font:.86em ui-monospace,SFMono-Regular,Menlo,monospace}
pre{background:var(--code);padding:14px 16px;border-radius:6px;overflow-x:auto;margin:12px 0}
pre code{background:none;padding:0;font-size:.82rem;line-height:1.5}
blockquote{border-left:3px solid var(--line);color:var(--dim);padding:2px 14px;margin:12px 0}
table{border-collapse:collapse;width:100%;margin:12px 0;font-size:.9rem}
th,td{border:1px solid var(--line);padding:6px 10px;text-align:left;vertical-align:top}
th{background:var(--code)}
ul,ol{margin:10px 0 10px 22px}
li{margin:4px 0}
"""

if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    title = "spec.md"
    body = convert(open(src).read())
    open(dst, "w").write(
        f'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">'
        f'<meta name="viewport" content="width=device-width, initial-scale=1">'
        f'<title>{title}</title><style>{CSS}</style></head><body>{body}</body></html>'
    )
    print(f"wrote {dst}")
