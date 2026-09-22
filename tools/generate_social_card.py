"""Regenerate the branded 1200×630 social image (requires Pillow)."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "social-card.png"


def font(name, size):
    path = Path("C:/Windows/Fonts") / name
    try:
        return ImageFont.truetype(str(path), size)
    except OSError:
        return ImageFont.load_default()


image = Image.new("RGB", (1200, 630), "#102333")
draw = ImageDraw.Draw(image)
draw.rectangle((35, 35, 1165, 595), outline="#8f805f", width=2)
draw.rectangle((58, 58, 1142, 572), outline="#415464", width=1)
draw.line((337, 124, 337, 506), fill="#bfa56f", width=3)
draw.text((100, 208), "RP", font=font("georgia.ttf", 178), fill="#e8dfcf")
draw.text((390, 140), "ADVOCATES & LEGAL CONSULTANTS", font=font("arial.ttf", 22), fill="#c6aa73", spacing=3)
draw.text((385, 238), "Rakesh Puri", font=font("georgia.ttf", 75), fill="#f5f1e9")
draw.text((385, 322), "& Associates", font=font("georgia.ttf", 75), fill="#f5f1e9")
draw.line((390, 432, 1080, 432), fill="#60727c", width=1)
draw.text((390, 466), "LAW  ·  INVESTIGATION  ·  EXPERIENCE", font=font("arial.ttf", 25), fill="#c6aa73")
image.save(OUT, optimize=True)
print(OUT)
