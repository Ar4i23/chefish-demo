from pathlib import Path
import sys

from PIL import Image


root = Path(sys.argv[1]).resolve()
image_root = root / "assets" / "images"
converted = 0

for source in image_root.rglob("*.jpg"):
    destination = source.with_suffix(".webp")
    with Image.open(source) as image:
        image.save(destination, "WEBP", quality=88, method=6)
    converted += 1
    print(f"{destination.relative_to(root)} ({destination.stat().st_size} bytes)")

print(f"Converted {converted} optimized JPEG derivatives to WebP.")
