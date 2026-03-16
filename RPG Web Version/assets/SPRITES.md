# Sprite Setup Guide

Use these specs for the first pass so the game stays lightweight and easy to swap in.

## Recommended format

- Best overall: transparent `.webp`
- Safe fallback: transparent `.png`
- Avoid `.jpg` for tiles, characters, enemies, treasure, vendors, and walls because JPG has no transparency

## Size and style

- Make each tile sprite square: `96x96` or `128x128`
- Keep the subject centered and leave a little breathing room near the edges
- Use a top-down view for everything
- Give walls and floors a seamless tile look if possible
- Use transparent background for everything except full ground textures if you want the tile to fill the whole square

## Naming

Put sprites in `assets/sprites/` using these names:

- `player.webp`
- `wall.webp`
- `floor.webp`
- `market.webp`
- `vendor.webp`
- `treasure.webp`
- `gold.webp`
- `stairs.webp`
- `orc-scout.webp`
- `rat-swarm.webp`
- `skeleton.webp`
- `crypt-hound.webp`
- `ash-cultist.webp`
- `wraith.webp`
- `orc-brute.webp`
- `bone-knight.webp`

## Photoshop export notes

- Color mode: `sRGB`
- Background: transparent
- Export size: keep all tiles the same dimensions
- If you want crisp retro art, export at exact size with no blur
- If you want painted art, still keep the canvas square and centered

## Current hook-up

The prototype already looks for these files in `game.js` inside the `SPRITE_CONFIG` object. If a file is missing, it falls back to colored blocks automatically.
