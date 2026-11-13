"""Capture and render real bik output. Requires Pillow and a built bik checkout.
Usage: python3 scripts/generate-bik-demo.py /path/to/bik
Build the compiler at build-local/execute before running this script.
"""
from pathlib import Path
import json
import shutil
import subprocess
import sys
import tempfile
from PIL import Image, ImageDraw, ImageFont

repo = Path(sys.argv[1]).resolve()
output = Path(__file__).resolve().parents[1] / 'public/projects/bik'
output.mkdir(parents=True, exist_ok=True)
source = '''value = 6 * 7;
message = "hello, world!";

log(value);
log(message);'''
# The entry point reads ../tests/test1.bik. Use an isolated directory so the
# original checkout and its test fixture stay untouched.
with tempfile.TemporaryDirectory() as work:
    root = Path(work)
    (root / 'tests').mkdir()
    (root / 'build-local').mkdir()
    (root / 'tests/test1.bik').write_text(source + '\n')
    shutil.copy2(repo / 'build-local/execute', root / 'build-local/execute')
    result = subprocess.run(['./execute'], cwd=root / 'build-local',
                            capture_output=True, text=True, check=True)
    assembly = (root / 'build-local/output.asm').read_text()
assert 'value: .word 42' in assembly, assembly
commit = subprocess.check_output(['git', '-C', str(repo), 'rev-parse', 'HEAD'], text=True).strip()
(output / 'capture.json').write_text(json.dumps({
    'repository': 'https://github.com/Bi1ku/bik', 'commit': commit,
    'source': source, 'command': 'cd build-local && ./execute',
    'compiler_stdout': result.stdout, 'assembly': assembly,
    'note': 'Actual compiler output. Assembly is generated, not executed. Playback is paced for readability.'
}, indent=2) + '\n')
fontpath = '/System/Library/Fonts/Menlo.ttc'
mono = ImageFont.truetype(fontpath, 18)
small = ImageFont.truetype(fontpath, 15)
heading = ImageFont.truetype(fontpath, 31)
label = ImageFont.truetype(fontpath, 17)
frames = []

def frame(stage, lines, note):
    im = Image.new('RGB', (1280, 760), '#faf9f6')
    d = ImageDraw.Draw(im)
    d.text((42, 30), 'bik', font=heading, fill='#252a2e')
    d.text((42, 78), 'Source → tokens → constant folding → MIPS assembly', font=label, fill='#646970')
    d.line((42, 120, 1238, 120), fill='#dcdedb', width=2)
    d.text((60, 146), 'tests/test1.bik', font=label, fill='#285b75')
    d.text((692, 146), stage, font=label, fill='#285b75')
    d.rounded_rectangle((42, 185, 656, 681), radius=5, fill='#f0f1ee')
    d.rounded_rectangle((674, 185, 1238, 681), radius=5, fill='#f0f1ee')
    for i, line in enumerate(source.splitlines()):
        d.text((57, 205 + i * 29), f'{i+1:2}', font=small, fill='#949a9e')
        d.text((94, 203 + i * 29), line, font=mono, fill='#34556c')
    d.text((65, 525), '6 × 7 is folded to 42 at compile time.', font=small, fill='#285b75')
    d.text((65, 558), 'Target: MIPS · Compiler in progress', font=small, fill='#646970')
    for i, line in enumerate(lines):
        d.text((692, 205 + i * 27), line.expandtabs(2), font=mono, fill='#252a2e')
    d.text((42, 711), note, font=small, fill='#646970')
    frames.append(im)

frame('1 / Run compiler', ['$ cd build-local', '$ ./execute'],
      'Actual compiler output · playback paced for readability')
frame('2 / Inspect tokens', result.stdout.splitlines()[:11] + ['… token output continues'],
      'Token excerpt from the compiler’s standard output')
frame('3 / Inspect output.asm', assembly.splitlines(),
      'Generated assembly · 6 × 7 folded to 42 · assembly not executed in this demo')
frames[-1].save(output / 'demo-poster.png')
frames[0].save(output / 'demo.gif', save_all=True, append_images=frames[1:],
               duration=[3000, 4000, 5000], loop=0, optimize=True)
print(f'{output / "demo.gif"}: 12s, {len(frames)} frames')
