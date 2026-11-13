"""Capture real compiler + SPIM output for the interactive portfolio demo.

Usage: python3 scripts/generate-bik-demo.py /path/to/bik [--compiler /path/to/execute]
Requires a built bik checkout and SPIM on PATH. No image dependencies.
"""
import argparse
import json
from pathlib import Path
import shutil
import subprocess
import tempfile


def run(command):
    return subprocess.run(command, capture_output=True, text=True, check=True, timeout=30)


parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("repository", type=Path)
parser.add_argument("--compiler", type=Path)
args = parser.parse_args()
repo = args.repository.resolve()
compiler = (args.compiler or repo / "build-local/execute").resolve()
spim = shutil.which("spim")
if not spim:
    parser.error("SPIM is required to verify runtime output")

output = Path(__file__).resolve().parents[1] / "public/projects/bik"
output.mkdir(parents=True, exist_ok=True)
examples = [
    ("inheritance", (repo / "tests/programs/inheritance.bik").read_text(),
     "paladin: ready for battle\nhealth: 180, armor: 10\n"
     "enemy after paladin strike: 63\nenemy after mage strike: 36\n"
     "independent health: 75 / 180\nmage mana: 80\n"),
    ("recursion", (repo / "tests/programs/recursion.bik").read_text(), "5040 144 21\n"),
    ("folding", 'answer = (7 + 5) * 3;\nmessage = "computed at compile time";\n\nlog(answer);\nlog("\\n");\nlog(message);\nlog("\\n");\n',
     "36\ncomputed at compile time\n"),
]
captures = []
with tempfile.TemporaryDirectory() as temporary:
    for name, source, expected in examples:
        source_path = Path(temporary) / f"{name}.bik"
        assembly_path = source_path.with_suffix(".asm")
        source_path.write_text(source)
        compiled = run([str(compiler), str(source_path), "-o", str(assembly_path)])
        executed = run([spim, "-file", str(assembly_path)])
        actual = executed.stdout.split("Loaded:", 1)[1].split("\n", 1)[1]
        if actual != expected or executed.stderr:
            raise RuntimeError(f"Unexpected {name} output: {executed.stdout!r} {executed.stderr!r}")
        assembly = assembly_path.read_text()
        if name == "folding" and "answer: .word 36" not in assembly:
            raise RuntimeError("Constant folding was not present in generated assembly")
        (output / f"{name}.bik").write_text(source)
        (output / f"{name}.asm").write_text(assembly)
        captures.append({
            "id": name, "source": source, "assembly": assembly, "output": actual,
            "compile_command": f"./build-local/execute {name}.bik -o {name}.asm",
            "run_command": f"spim -file {name}.asm",
            "compiler_stdout": compiled.stdout, "runtime_stdout": executed.stdout,
        })

commit = run(["git", "-C", str(repo), "rev-parse", "HEAD"]).stdout.strip()
capture = {
    "repository": "https://github.com/Bi1ku/bik", "commit": commit,
    "note": "Captured compiler and SPIM output. Browser playback is a replay, not live compilation or a benchmark.",
    "examples": captures,
}
serialized = json.dumps(capture, indent=2) + "\n"
(output / "capture.json").write_text(serialized)
# Vite bundles application data from outside public/. Keep the public copy
# available for inspecting the complete capture independently of the UI.
(output.parents[2] / "app/bik-capture.json").write_text(serialized)
print(f"Verified and captured {len(captures)} programs from {commit[:7]}")
