"""Generates favicons, touch/manifest icons and the default Open Graph card
from the master logo (src/assets/brand/logo-full.png). Run once after a logo
change:  python3 scripts/brand-assets.py   (requires Pillow)."""
from PIL import Image, ImageDraw

SRC = 'src/assets/brand/logo-full.png'
logo = Image.open(SRC).convert('RGBA')


def fit(img, box):
    w, h = img.size
    s = min(box / w, box / h)
    return img.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)


def square(size, pad_ratio, bg):
    canvas = Image.new('RGBA', (size, size), bg)
    mark = fit(logo, round(size * (1 - 2 * pad_ratio)))
    canvas.alpha_composite(mark, ((size - mark.width) // 2, (size - mark.height) // 2))
    return canvas


square(32, 0.02, (0, 0, 0, 0)).save('public/favicon-32.png', optimize=True)
square(512, 0.02, (0, 0, 0, 0)).save('public/favicon.ico', sizes=[(16, 16), (32, 32), (48, 48)])
square(180, 0.14, (10, 22, 34, 255)).convert('RGB').save('public/apple-touch-icon.png', optimize=True)
square(192, 0.14, (10, 22, 34, 255)).save('public/icon-192.png', optimize=True)
square(512, 0.14, (10, 22, 34, 255)).save('public/icon-512.png', optimize=True)
square(512, 0.22, (10, 22, 34, 255)).save('public/icon-maskable-512.png', optimize=True)

# Open Graph card 1200x630: dark brand background, soft teal glow, centred mark.
W, H = 1200, 630
og = Image.new('RGBA', (W, H), (10, 22, 34, 255))
glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(glow)
for i in range(60, 0, -1):
    a = int(3 * (60 - i) / 60 * 4)
    r = i * 7
    d.ellipse((W // 2 - r, H // 2 - r, W // 2 + r, H // 2 + r), fill=(38, 191, 190, a))
og.alpha_composite(glow)
mark = fit(logo, 380)
og.alpha_composite(mark, ((W - mark.width) // 2, (H - mark.height) // 2))
og.convert('RGB').save('src/assets/brand/og-default.jpg', quality=88, optimize=True)
print('brand assets generated')
