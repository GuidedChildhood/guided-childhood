"""
RUN ALL SIMULATIONS
=======================================================================

Part 8 of The Algorithm Literacy Project (Guided Childhood).

Runs all seven simulations in sequence and reports where each PNG was
saved. Each simulation is self-contained and can also be run on its own.

    python run_all.py
"""

import os
import sys
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, "output")

# The seven simulations, in a sensible reading order.
SCRIPTS = [
    "how_an_algorithm_learns.py",
    "echo_chamber.py",
    "viral_spread.py",
    "outrage_spread.py",
    "misinformation_spread.py",
    "healthy_recommendation_spread.py",
    "one_click_vs_fifty_clicks.py",
]


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print("Running all seven Part 8 simulations...\n")

    results = []
    for name in SCRIPTS:
        script_path = os.path.join(HERE, name)
        print("-" * 70)
        print(f"RUNNING: {name}")
        print("-" * 70)
        # Use the same Python interpreter that launched this script.
        completed = subprocess.run([sys.executable, script_path])
        png_name = name.replace(".py", ".png")
        png_path = os.path.join(OUT_DIR, png_name)
        ok = completed.returncode == 0 and os.path.exists(png_path)
        results.append((name, png_path, ok))
        print()

    print("=" * 70)
    print("ALL DONE. Summary of saved visualisations:")
    print("=" * 70)
    for name, png_path, ok in results:
        status = "OK " if ok else "FAILED"
        print(f"  [{status}] {png_path}")

    failed = [r for r in results if not r[2]]
    if failed:
        print(f"\n{len(failed)} simulation(s) failed. See output above.")
        sys.exit(1)
    print(f"\nAll {len(results)} PNGs saved in: {OUT_DIR}")


if __name__ == "__main__":
    main()
