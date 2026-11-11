"""Build a portable source snapshot plus readable code for a regular ChatGPT chat."""
from pathlib import Path
import hashlib, json, zipfile
root=Path(__file__).resolve().parents[1]
out=root/'handoff'
out.mkdir(exist_ok=True)
combined=out/'MJ-EDITABLE-SOURCE.txt'
# Keep bundled third-party JavaScript, fonts and media out of the readable text.
source_files=sorted(p for p in (root/'site').iterdir() if p.is_file() and (p.suffix in ('.html','.css','.js','.txt') or p.name=='_headers'))
with combined.open('w') as f:
 f.write('MJ LASH PARLOUR — EDITABLE SOURCE SNAPSHOT — 11 NOVEMBER 2026\nActual current source; this file is not a live editor connection. Assets are in the ZIP.\n\n')
 f.write((root/'HANDOFF-START-HERE.md').read_text())
 f.write('\n\nACADEMY & REWARDS CONTEXT\n\n'+(root/'ACADEMY-REWARDS-PLAN.md').read_text())
 for p in source_files:
  f.write('\n\n'+'='*72+'\nFILE: '+str(p.relative_to(root))+'\n'+'='*72+'\n')
  f.write(p.read_text())
paths=[]
for d in ('site','src','scripts','revisions'):
 paths.extend(p for p in (root/d).rglob('*') if p.is_file() and not p.name.startswith('.'))
for name in ('README.md','HANDOFF-START-HERE.md','ACADEMY-REWARDS-PLAN.md','IMAGE-SOURCES.md','DESIGN-REVIEW.md','package.json','MJ-Lash-Parlour.code-workspace','.gitignore'):
 paths.append(root/name)
paths.append(combined)
for name in ('academy-preview.png','quiet-homepage.png','quiet-homepage-mobile.png'):
 p=root/'previews'/name
 if p.exists():paths.append(p)
manifest={str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in paths}
manifest_path=out/'SOURCE-MANIFEST.json'
manifest_path.write_text(json.dumps(manifest,indent=2)+'\n')
paths.append(manifest_path)
archive=out/'MJ-Lash-Parlour-ChatGPT-Handoff.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for p in paths:z.write(p,Path('MJ-Lash-Parlour')/p.relative_to(root))
with zipfile.ZipFile(archive) as z:assert z.testzip() is None
print(f'{len(paths)} files; source ZIP {archive.stat().st_size:,} bytes; readable source {combined.stat().st_size:,} bytes')
