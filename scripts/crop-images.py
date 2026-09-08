"""Recreate kiosk JPEG assets from the single GPT-generated contact sheet.

Requires Pillow. Run from any directory: python3 scripts/crop-images.py
The visually checked boundaries account for uneven generated row heights.
"""
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'assets' / 'images'
manifest = json.loads((root / 'manifest.json').read_text())
with Image.open(root / manifest['source']) as source:
    for cell in manifest['cells']:
        col, row = cell['column'], cell['row']
        xs, ys = manifest['xCuts'], manifest['yCuts']
        bounds = (xs[col] + 1, ys[row] + 1, xs[col + 1] - 1, ys[row + 1] - 1)
        source.crop(bounds).convert('RGB').save(
            root / cell['file'], quality=92, optimize=True, progressive=True)
print('Saved %s JPEG assets.' % len(manifest['cells']))
