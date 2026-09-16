#!/usr/bin/env python3
"""Insert the animated-logo preloader into index.html.

The logo SVG is inlined (so its paths can be animated) with `pathLength="1"` on
each path, which normalises every path to the same length. That lets a single
CSS rule drive the stroke-draw across all 16 paths regardless of their real
geometry, and gives each path an `--i` index for the stagger.
"""
import re
import sys

SVG = 'src/assets/ui/logo-mojo.svg'
HTML = 'index.html'

svg = open(SVG, encoding='utf-8').read()

# Inner content of the <svg>, minus the wrapper and the clip-path defs.
inner = re.search(r'<svg[^>]*>(.*)</svg>', svg, re.S).group(1)
inner = re.sub(r'<defs>.*?</defs>', '', inner, flags=re.S)
inner = re.sub(r'\sclip-path="url\([^)]*\)"', '', inner)

# Tag each path with a stagger index and a normalised length.
counter = {'n': 0}


def tag(m):
    t = m.group(0).rstrip('/>').rstrip()
    i = counter['n']
    counter['n'] += 1
    return '%s pathLength="1" style="--i:%d"/>' % (t, i)


inner = re.sub(r'<path\b[^>]*?/>', tag, inner)
if counter['n'] == 0:
    sys.exit('FAILED: no paths matched')

inner = '\n      '.join(ln.strip() for ln in inner.strip().splitlines() if ln.strip())

block = '''  <div class="preloader" id="preloader" aria-hidden="true">
    <svg class="preloader-logo" viewBox="0 0 232 134" xmlns="http://www.w3.org/2000/svg"
      role="presentation" focusable="false">
      %s
    </svg>
  </div>

''' % inner

html = open(HTML, encoding='utf-8').read()
if 'class="preloader"' in html:
    sys.exit('FAILED: preloader already present')

# Head script: mark the document before first paint if the splash was already
# shown this session, so returning visitors never see a flash of it.
head_script = '''  <script>
    // Show the splash once per browsing session only. Runs before first paint,
    // so a repeat visit never flashes the overlay.
    try {
      if (sessionStorage.getItem('mojo-splash-seen')) {
        document.documentElement.className += ' no-preload';
      } else {
        sessionStorage.setItem('mojo-splash-seen', '1');
      }
    } catch (e) { /* private mode: just show it */ }
  </script>
'''
marker = '  <link rel="stylesheet" href="src/css/header.css">'
if marker not in html:
    sys.exit('FAILED: stylesheet link not found')
html = html.replace(marker, head_script + marker, 1)

m = re.search(r'<body[^>]*>\n', html)
if not m:
    sys.exit('FAILED: <body> not found')
html = html[:m.end()] + block + html[m.end():]

open(HTML, 'w', encoding='utf-8', newline='\n').write(html)
print('preloader inserted: %d paths tagged' % counter['n'])
