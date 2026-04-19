"""
블로그 이미지 텍스트 오버레이 모듈 (Pillow 기반)

이미지에:
1. 밝기를 약 15% 낮춤 (AI 이미지 특유의 과한 채도 완화)
2. 하단에 어두운 그라디언트 오버레이
3. 텍스트(제목/H2) 삽입

사용법:
  python image_overlay.py <input_path> <output_path> <text> [--font-size=40]
  python image_overlay.py cover.png cover_out.webp "블로그 제목입니다"

또는 모듈로 import:
  from image_overlay import add_text_overlay
  result_bytes = add_text_overlay(image_bytes, "텍스트", font_size=40)
"""

import sys
import io
import os
import textwrap
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter

# 폰트 경로 (맑은 고딕 Bold)
FONT_PATHS = [
    "C:/Windows/Fonts/malgunbd.ttf",   # 맑은 고딕 Bold
    "C:/Windows/Fonts/malgun.ttf",     # 맑은 고딕
    "C:/Windows/Fonts/GOTHICB.TTF",    # Gothic Bold
    "C:/Windows/Fonts/GOTHIC.TTF",
]


def get_font(size: int) -> ImageFont.FreeTypeFont:
    for path in FONT_PATHS:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def add_text_overlay(
    image_bytes: bytes,
    text: str,
    font_size: int = 40,
    brightness: float = 0.85,
    position: str = "bottom",  # "bottom" | "top"
) -> bytes:
    """
    이미지 바이트에 텍스트 오버레이를 추가하고 WebP 바이트로 반환.

    Args:
        image_bytes: 원본 이미지 (PNG/JPEG/WebP)
        text: 삽입할 텍스트
        font_size: 폰트 크기 (픽셀)
        brightness: 밝기 조정 (1.0=원본, 0.85=15% 어둡게)
        position: 텍스트 위치
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGBA")
    w, h = img.size

    # 1. 밝기 낮추기
    enhancer = ImageEnhance.Brightness(img.convert("RGB"))
    img_dark = enhancer.enhance(brightness).convert("RGBA")

    # 2. 그라디언트 오버레이 생성 (하단 40%)
    overlay_h = int(h * 0.42)
    gradient = Image.new("RGBA", (w, overlay_h), (0, 0, 0, 0))
    draw_grad = ImageDraw.Draw(gradient)

    for y in range(overlay_h):
        # 위에서 아래로 갈수록 진하게 (0 → 200 알파)
        alpha = int((y / overlay_h) ** 1.4 * 200)
        draw_grad.line([(0, y), (w, y)], fill=(0, 0, 0, alpha))

    if position == "bottom":
        img_dark.paste(gradient, (0, h - overlay_h), gradient)
    else:
        # 상단 오버레이 (위아래 반전)
        gradient_flipped = gradient.transpose(Image.FLIP_TOP_BOTTOM)
        img_dark.paste(gradient_flipped, (0, 0), gradient_flipped)

    # 3. 텍스트 렌더링
    draw = ImageDraw.Draw(img_dark)
    padding = 28
    max_chars = max(12, int(w / font_size * 1.6))

    lines = textwrap.wrap(text, width=max_chars)
    if not lines:
        lines = [text[:max_chars]]

    font = get_font(font_size)
    line_height = font_size + 10

    total_text_h = len(lines) * line_height
    if position == "bottom":
        text_y = h - overlay_h + (overlay_h - total_text_h) // 2 + 10
    else:
        text_y = padding

    for i, line in enumerate(lines):
        y = text_y + i * line_height

        # 그림자 효과
        for dx, dy in [(-2, -2), (2, -2), (-2, 2), (2, 2), (0, 3)]:
            draw.text((padding + dx, y + dy), line, font=font, fill=(0, 0, 0, 180))

        # 본문 텍스트 (흰색)
        draw.text((padding, y), line, font=font, fill=(255, 255, 255, 255))

    # 4. WebP로 출력
    result = img_dark.convert("RGB")
    buf = io.BytesIO()
    result.save(buf, format="WEBP", quality=88, method=6)
    return buf.getvalue()


def main():
    import argparse

    parser = argparse.ArgumentParser(description="블로그 이미지 텍스트 오버레이")
    parser.add_argument("input", help="입력 이미지 경로")
    parser.add_argument("output", help="출력 이미지 경로 (.webp)")
    parser.add_argument("text", help="삽입할 텍스트")
    parser.add_argument("--font-size", type=int, default=40)
    parser.add_argument("--brightness", type=float, default=0.85)
    parser.add_argument("--position", choices=["bottom", "top"], default="bottom")
    args = parser.parse_args()

    with open(args.input, "rb") as f:
        image_bytes = f.read()

    result = add_text_overlay(
        image_bytes,
        args.text,
        font_size=args.font_size,
        brightness=args.brightness,
        position=args.position,
    )

    with open(args.output, "wb") as f:
        f.write(result)

    size_kb = len(result) // 1024
    print(f"Done: {args.output} ({size_kb}KB)")


if __name__ == "__main__":
    main()
