"""Package public preview files only; omit internal plans and unused original media."""
from pathlib import Path
import re, shutil, tempfile, zipfile
root = Path(__file__).resolve().parents[1]
site = root/'site'
stage = Path(tempfile.mkdtemp(prefix='mj-academy-release.'))/'public'
stage.mkdir()
files = {p for p in site.iterdir() if p.is_file() and (p.suffix in ('.html','.css','.js') or p.name in ('_headers','robots.txt'))}
# Dynamic hero slides use this directory. All assets here are the current retouched set.
files.update(p for p in (site/'assets/retouched').iterdir() if p.is_file())
for source in list(files):
    if source.suffix in ('.html','.css','.js'):
        for asset in re.findall(r'assets/[\w./-]+',source.read_text()):
            item=site/asset
            if item.is_file(): files.add(item)
files.update((site/'assets'/name) for name in ('sculpture.js','three-LICENSE.txt','instrument-OFL.txt','cormorant-OFL.txt','jakarta-OFL.txt') if (site/'assets'/name).exists())
for source in sorted(files):
    dest=stage/source.relative_to(site)
    dest.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(source,dest)
archive=root/'mj-academy-cloudflare.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as bundle:
    for source in sorted(stage.rglob('*')):
        if source.is_file(): bundle.write(source,source.relative_to(stage))
print(f'{len(files)} public files; {archive.stat().st_size:,} bytes')
print(f'ZIP: {archive}')
print(f'Staged site: {stage}')
