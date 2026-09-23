#!/usr/bin/env python3
"""One-off: wire Mojo Mian's real identity, location and profile links into index.html.

Kept as a script (rather than hand edits) so the exact substitutions are reviewable.
"""
import json
import re
import sys

PINTEREST = 'https://au.pinterest.com/mojgraphicdesign/'
LINKEDIN = 'https://www.linkedin.com/in/mojdesign/'
ETSY = 'https://www.etsy.com/shop/MojoDesignCollection'

# Same visual language as the existing icons: currentColor disc, white glyph.
LINKEDIN_ICON = (
    '<a href="' + LINKEDIN + '" aria-label="LinkedIn" rel="me noopener" target="_blank">'
    '<svg viewBox="0 0 46 46" aria-hidden="true" focusable="false">\n'
    '              <circle cx="23" cy="23" r="23" fill="currentColor" />\n'
    '              <circle cx="14.5" cy="15.5" r="2.6" fill="#fff" />\n'
    '              <rect x="12" y="19.5" width="5" height="13.5" fill="#fff" />\n'
    '              <path\n'
    '                d="M19.5 19.5h4.8v1.85h.07c.67-1.2 2.3-2.2 4.3-2.2 4.6 0 5.45 2.85 5.45 '
    '6.55V33h-5v-6.4c0-1.53-.03-3.5-2.13-3.5-2.13 0-2.46 1.66-2.46 3.38V33h-5z"\n'
    '                fill="#fff" />\n'
    '            </svg></a>'
)

path = 'index.html'
s = open(path, encoding='utf-8').read()
orig = s


def must(cond, msg):
    if not cond:
        sys.exit('FAILED: ' + msg)


# --- 1. Real profile URLs -----------------------------------------------------
n = s.count('<a href="#" aria-label="Pinterest">')
must(n == 2, 'expected 2 Pinterest links, found %d' % n)
s = s.replace(
    '<a href="#" aria-label="Pinterest">',
    '<a href="%s" aria-label="Pinterest" rel="me noopener" target="_blank">' % PINTEREST,
)

n = s.count('<a href="#" aria-label="Nixie Dolls Etsy">')
must(n == 1, 'expected 1 Etsy link, found %d' % n)
s = s.replace(
    '<a href="#" aria-label="Nixie Dolls Etsy">',
    '<a href="%s" aria-label="Nixie Dolls Etsy" rel="me noopener" target="_blank">' % ETSY,
)

# --- 2. Add LinkedIn next to Email in both social rows ------------------------
email_open = '<a href="mailto:mojgraphicdesign@gmail.com" aria-label="Email">'
must(s.count(email_open) == 2, 'expected 2 email links')
# insert LinkedIn immediately after each email anchor closes
parts = s.split('</svg></a>')
rebuilt, inserted = [], 0
for i, part in enumerate(parts[:-1]):
    rebuilt.append(part)
    if email_open in part and inserted < 2:
        rebuilt.append('</svg></a>\n          ' + LINKEDIN_ICON.rstrip())
        inserted += 1
    else:
        rebuilt.append('</svg></a>')
rebuilt.append(parts[-1])
s = ''.join(rebuilt)
must(inserted == 2, 'expected to insert 2 LinkedIn icons, did %d' % inserted)

# --- 3. Name + location in the visible metadata -------------------------------
OLD_D = ('Portfolio of Mojdeh (Mojo) - graphic designer, illustrator and UI/UX designer '
         'with 15 years of experience in brand identity, logo design, illustration and character design.')
NEW_D = ('Mojo Mian is a Melbourne-based graphic designer, illustrator and UI/UX designer with '
         '15 years of experience in brand identity, logo design, illustration and character design.')
must(s.count(OLD_D) == 3, 'expected 3 description strings, found %d' % s.count(OLD_D))
s = s.replace(OLD_D, NEW_D)

OLD_T = 'Mojdeh | Graphic Designer, Illustrator &amp; UI/UX Designer'
NEW_T = 'Mojo Mian | Graphic Designer, Illustrator &amp; UI/UX Designer'
must(s.count(OLD_T) == 3, 'expected 3 title strings, found %d' % s.count(OLD_T))
s = s.replace(OLD_T, NEW_T)

s = s.replace('<meta name="author" content="Mojdeh">',
              '<meta name="author" content="Mojo Mian">', 1)

# --- 4. Structured data: identity, sameAs, Melbourne --------------------------
m = re.search(r'(<script type="application/ld\+json">)(.*?)(</script>)', s, re.S)
must(m is not None, 'JSON-LD block not found')
data = json.loads(m.group(2))
graph = {o['@type']: o for o in data['@graph']}

person = graph['Person']
person['name'] = 'Mojo Mian'
person['alternateName'] = ['Mojdeh Mian', 'Mojdeh', 'Mojo']
person['givenName'] = 'Mojdeh'
person['familyName'] = 'Mian'
person['sameAs'] = [LINKEDIN, PINTEREST, ETSY]
person['address'] = {
    '@type': 'PostalAddress',
    'addressLocality': 'Melbourne',
    'addressRegion': 'VIC',
    'addressCountry': 'AU',
}
person['homeLocation'] = {
    '@type': 'Place',
    'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Melbourne',
        'addressRegion': 'VIC',
        'addressCountry': 'AU',
    },
}

biz = graph['ProfessionalService']
biz['sameAs'] = [LINKEDIN, PINTEREST, ETSY]
biz['address'] = {
    '@type': 'PostalAddress',
    'addressLocality': 'Melbourne',
    'addressRegion': 'VIC',
    'addressCountry': 'AU',
}
biz['areaServed'] = [
    {'@type': 'City', 'name': 'Melbourne'},
    {'@type': 'State', 'name': 'Victoria'},
    {'@type': 'Country', 'name': 'Australia'},
]

pretty = json.dumps(data, indent=2, ensure_ascii=False)
pretty = '\n'.join('  ' + ln if ln.strip() else ln for ln in pretty.split('\n'))
s = s[:m.start()] + m.group(1) + '\n' + pretty + '\n  ' + m.group(3) + s[m.end():]

must(s != orig, 'no changes applied')
open(path, 'w', encoding='utf-8', newline='\n').write(s)
print('identity wired: name, Melbourne VIC AU, LinkedIn + Pinterest + Etsy')
