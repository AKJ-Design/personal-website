"""Rebind the Office theme in a .pptx/.potx to the Field Notes palette.

Why this matters for a template: the theme is what fills PowerPoint's colour
picker and resolves +mj-lt / +mn-lt. Left stock, the picker offers Office blue
and every hyperlink renders #0563C1 -- a second interactive colour, which is
precisely what the accent-thread rule forbids.

PowerPoint demands six accents; a one-accent system doesn't have six. Rather
than invent colours, accents 2-6 are bound to values the system already
defines (accent-light, muted, muted-2, warn, crit), so the picker can only
offer on-system choices and accent1 is always the green.
"""
import re, shutil, sys, zipfile, os, tempfile

ACCENT='204E39'; ACCENT_L='2D6A4F'; INK='141210'; SURFACE='FAF7F2'
MUTED='57514A'; SUNK='F4F0E8'; MUTED2='6B6358'; WARN='8A5A1E'; CRIT='A32E28'
MAJOR='Space Grotesk SemiBold'; MINOR='Calibri'

CLR = (
 '<a:clrScheme name="Field Notes">'
 f'<a:dk1><a:srgbClr val="{INK}"/></a:dk1>'
 f'<a:lt1><a:srgbClr val="{SURFACE}"/></a:lt1>'
 f'<a:dk2><a:srgbClr val="{MUTED}"/></a:dk2>'
 f'<a:lt2><a:srgbClr val="{SUNK}"/></a:lt2>'
 f'<a:accent1><a:srgbClr val="{ACCENT}"/></a:accent1>'
 f'<a:accent2><a:srgbClr val="{ACCENT_L}"/></a:accent2>'
 f'<a:accent3><a:srgbClr val="{MUTED}"/></a:accent3>'
 f'<a:accent4><a:srgbClr val="{MUTED2}"/></a:accent4>'
 f'<a:accent5><a:srgbClr val="{WARN}"/></a:accent5>'
 f'<a:accent6><a:srgbClr val="{CRIT}"/></a:accent6>'
 f'<a:hlink><a:srgbClr val="{ACCENT}"/></a:hlink>'
 f'<a:folHlink><a:srgbClr val="{ACCENT_L}"/></a:folHlink>'
 '</a:clrScheme>'
)

def patch_theme(xml: str) -> str:
    xml = re.sub(r'<a:clrScheme.*?</a:clrScheme>', CLR, xml, count=1, flags=re.S)
    # major/minor latin faces, in document order (majorFont then minorFont)
    def repl_latin(m, face):
        return re.sub(r'<a:latin typeface="[^"]*"(\s+panose="[^"]*")?\s*/>',
                      f'<a:latin typeface="{face}"/>', m, count=1)
    mj = re.search(r'<a:majorFont>.*?</a:majorFont>', xml, re.S)
    if mj: xml = xml[:mj.start()] + repl_latin(mj.group(0), MAJOR) + xml[mj.end():]
    mn = re.search(r'<a:minorFont>.*?</a:minorFont>', xml, re.S)
    if mn: xml = xml[:mn.start()] + repl_latin(mn.group(0), MINOR) + xml[mn.end():]
    xml = xml.replace('<a:themeElements>', '<a:themeElements>', 1)
    return re.sub(r'(<a:theme[^>]*\sname=")[^"]*(")', r'\1Field Notes\2', xml, count=1)

def process(path):
    tmp = tempfile.mkdtemp()
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        z.extractall(tmp)
    n_patched = 0
    for n in names:
        if re.match(r'ppt/theme/theme\d+\.xml$', n):
            fp = os.path.join(tmp, n)
            s = open(fp, encoding='utf-8').read()
            open(fp, 'w', encoding='utf-8').write(patch_theme(s))
            n_patched += 1
    out = path + '.new'
    with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as z:
        for n in names:
            fp = os.path.join(tmp, n)
            if os.path.isdir(fp): continue
            z.write(fp, n)
    shutil.move(out, path)
    shutil.rmtree(tmp)
    print(f'  {os.path.basename(path)}: patched {n_patched} theme part(s)')

for p in sys.argv[1:]:
    process(p)
