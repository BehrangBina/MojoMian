#!/usr/bin/env python3
"""Regenerate sitemap.xml, declaring portfolio images for Google Images.

Google Images is a primary discovery surface for illustration work, so every
portfolio image is listed with a title and caption. Re-run after adding work:

    python tools/build-sitemap.py
"""
import os
import re
import html

BASE = 'https://mojgraphicdesign.com/'

# (directory, label used in image:title, caption)
GROUPS = [
    ('src/Logos', 'Logo design', 'Logo design by Mojdeh'),
    ('src/Branding', 'Brand identity', 'Brand identity project by Mojdeh'),
    ('src/Posters', 'Poster illustration', 'Illustrative poster by Mojdeh'),
    ('src/Nixie-Dolls', 'Character design', 'Nixie Dolls character design by Mojdeh'),
    ('src/Gallary', 'Illustration', 'Illustration by Mojdeh'),
]

EXTRAS = [
    ('src/img/Illustrations.png', 'Illustration collection',
     'Whimsical illustration collection by Mojdeh'),
    ('src/img/nixie.png', 'Nixie Dolls', 'Nixie Dolls character design by Mojdeh'),
]

SKIP_DIRS = ('Bar-Logo',)          # UI sprites, not portfolio work
EXTS = ('.jpg', '.jpeg', '.png')


def collect():
    seen, out = set(), []
    for root, label, caption in GROUPS:
        if not os.path.isdir(root):
            continue
        for dirpath, _dirs, files in os.walk(root):
            if any(skip in dirpath for skip in SKIP_DIRS):
                continue
            for name in sorted(files):
                if not name.lower().endswith(EXTS):
                    continue
                rel = os.path.join(dirpath, name).replace(os.sep, '/')
                if rel in seen:
                    continue
                seen.add(rel)
                pretty = re.sub(r'[-_]+', ' ', os.path.splitext(name)[0]).strip()
                out.append((rel, '{}: {}'.format(label, pretty), caption))
    for rel, title, caption in EXTRAS:
        if os.path.exists(rel) and rel not in seen:
            seen.add(rel)
            out.append((rel, title, caption))
    return out


def build(images):
    e = html.escape
    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
        '  <url>',
        '    <loc>{}</loc>'.format(BASE),
        '    <changefreq>monthly</changefreq>',
        '    <priority>1.0</priority>',
    ]
    for rel, title, caption in images:
        lines += [
            '    <image:image>',
            '      <image:loc>{}{}</image:loc>'.format(BASE, e(rel)),
            '      <image:title>{}</image:title>'.format(e(title)),
            '      <image:caption>{}</image:caption>'.format(e(caption)),
            '    </image:image>',
        ]
    lines += ['  </url>', '</urlset>', '']
    return '\n'.join(lines)


if __name__ == '__main__':
    imgs = collect()
    with open('sitemap.xml', 'w', encoding='utf-8', newline='\n') as fh:
        fh.write(build(imgs))
    print('sitemap.xml written: {} portfolio images declared'.format(len(imgs)))
