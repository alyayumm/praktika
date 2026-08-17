from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets"
OUT.mkdir(parents=True, exist_ok=True)

GRAPHITE = (20, 27, 38)
GRAPHITE_2 = (29, 40, 58)
BLUE = (34, 96, 230)
BLUE_DARK = (21, 70, 172)
ICE = (245, 247, 246)
ICE_BLUE = (220, 236, 252)
WHITE = (255, 255, 255)


def draw_curve(draw: ImageDraw.ImageDraw, points: list[tuple[int, int]], color: tuple[int, int, int], width: int) -> None:
    if len(points) < 2:
        return
    draw.line(points, fill=color, width=width, joint="curve")
    for x, y in points[:: max(1, len(points) // 4)]:
        draw.ellipse((x - width, y - width, x + width, y + width), fill=color)


def organic_frame(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill: tuple[int, int, int], outline: tuple[int, int, int]) -> None:
    x0, y0, x1, y1 = box
    pts = [
        (x0 + 28, y0),
        (x1 - 22, y0 + 12),
        (x1, y0 + 42),
        (x1 - 12, y1 - 28),
        (x1 - 48, y1),
        (x0 + 20, y1 - 8),
        (x0, y1 - 44),
        (x0 + 6, y0 + 34),
    ]
    draw.polygon(pts, fill=fill)
    draw.line(pts + [pts[0]], fill=outline, width=5, joint="curve")


def star(draw: ImageDraw.ImageDraw, center: tuple[int, int], radius: int, color: tuple[int, int, int]) -> None:
    cx, cy = center
    pts = []
    for i in range(10):
        angle = -math.pi / 2 + i * math.pi / 5
        r = radius if i % 2 == 0 else radius * 0.42
        pts.append((cx + math.cos(angle) * r, cy + math.sin(angle) * r))
    draw.polygon(pts, fill=color)


def hero_asset() -> None:
    img = Image.new("RGB", (1200, 1200), GRAPHITE)
    draw = ImageDraw.Draw(img)
    for i in range(1200):
        shade = int(18 + i / 1200 * 14)
        draw.line((0, i, 1200, i), fill=(shade, shade + 6, shade + 18))

    random.seed(7)
    for _ in range(42):
        x = random.randint(20, 1180)
        y = random.randint(20, 1180)
        r = random.randint(1, 3)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=(78, 115, 170))

    organic_frame(draw, (92, 152, 526, 520), (235, 242, 250), BLUE)
    organic_frame(draw, (652, 142, 1098, 520), (38, 58, 86), (122, 170, 248))
    organic_frame(draw, (208, 686, 618, 1018), (42, 62, 88), (122, 170, 248))
    organic_frame(draw, (700, 668, 1042, 1018), (238, 246, 255), BLUE)

    for box, accent in [
        ((150, 205, 470, 470), BLUE),
        ((706, 198, 1050, 474), (112, 167, 246)),
        ((256, 732, 566, 972), (112, 167, 246)),
        ((748, 718, 1000, 968), BLUE_DARK),
    ]:
        x0, y0, x1, y1 = box
        draw.rounded_rectangle(box, radius=22, fill=(255, 255, 255, 18), outline=accent, width=5)
        for k in range(5):
            y = y0 + 42 + k * ((y1 - y0 - 86) // 5)
            draw.line((x0 + 42, y, x1 - 42, y + random.randint(-18, 18)), fill=accent, width=4)

    draw_curve(draw, [(80, 700), (260, 590), (512, 628), (640, 540), (820, 620), (1070, 580)], BLUE, 9)
    draw_curve(draw, [(930, 1040), (740, 900), (642, 800), (520, 820), (450, 720)], (112, 167, 246), 7)
    draw.line((858, 562, 919, 543, 892, 602), fill=BLUE, width=8)
    star(draw, (118, 638), 34, BLUE)
    star(draw, (1065, 675), 26, (112, 167, 246))

    img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=120))
    img.save(OUT / "hero-praktika.png", quality=92)


def direction_asset(name: str, seed: int, motif: str) -> None:
    random.seed(seed)
    img = Image.new("RGB", (900, 680), ICE)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, 900, 220), fill=ICE_BLUE)
    draw.rounded_rectangle((46, 56, 854, 624), radius=24, fill=WHITE, outline=(210, 224, 240), width=4)
    draw.rounded_rectangle((86, 106, 814, 574), radius=18, fill=(242, 247, 252), outline=(34, 96, 230), width=5)

    if motif == "speech":
        for i in range(6):
            x, y = random.randint(120, 650), random.randint(150, 460)
            w, h = random.randint(110, 210), random.randint(54, 92)
            draw.rounded_rectangle((x, y, x + w, y + h), radius=28, outline=BLUE, width=5)
            draw.line((x + 26, y + h, x + 8, y + h + 28), fill=BLUE, width=5)
    elif motif == "road":
        draw_curve(draw, [(110, 520), (220, 380), (390, 420), (520, 235), (740, 170)], BLUE, 16)
        draw_curve(draw, [(130, 560), (260, 420), (420, 465), (560, 280), (770, 220)], GRAPHITE_2, 6)
        draw.line((735, 164, 795, 169, 758, 216), fill=BLUE, width=8)
    elif motif == "circuit":
        for y in [170, 250, 330, 410, 490]:
            draw.line((150, y, 740, y + random.randint(-40, 40)), fill=BLUE, width=5)
            for x in [210, 390, 575, 725]:
                draw.ellipse((x - 14, y - 14, x + 14, y + 14), fill=BLUE)
    elif motif == "formula":
        for i in range(8):
            x, y = random.randint(120, 700), random.randint(150, 500)
            draw.arc((x, y, x + 120, y + 80), 0, 300, fill=BLUE, width=5)
            draw.line((x, y + 42, x + 120, y + 42), fill=GRAPHITE_2, width=3)
    elif motif == "brush":
        for i in range(7):
            x0, y0 = random.randint(100, 420), random.randint(150, 510)
            x1, y1 = x0 + random.randint(180, 360), y0 + random.randint(-60, 60)
            draw.line((x0, y0, x1, y1), fill=BLUE if i % 2 else GRAPHITE_2, width=random.randint(12, 24))
    elif motif == "digital":
        for i in range(7):
            x, y = random.randint(110, 700), random.randint(150, 470)
            draw.rounded_rectangle((x, y, x + 120, y + 72), radius=8, outline=BLUE, width=4)
            draw.rectangle((x, y, x + 120, y + 18), fill=BLUE)

    for _ in range(11):
        star(draw, (random.randint(90, 810), random.randint(96, 590)), random.randint(8, 18), BLUE)
    img.save(OUT / f"direction-{name}.png", quality=92)


if __name__ == "__main__":
    hero_asset()
    direction_asset("languages", 11, "speech")
    direction_asset("driving", 12, "road")
    direction_asset("robotics", 13, "circuit")
    direction_asset("school", 14, "formula")
    direction_asset("creative", 15, "brush")
    direction_asset("digital", 16, "digital")
