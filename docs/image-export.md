# 🎨 Shadows of the Deck – Icon & Card Export Guide

This guide ensures **consistent sizes, naming, and export formats** for all HUD icons, card art, and other in-game graphics.

---

## **1. Icon Assets**
Icons are small, single-symbol graphics used in:
- HUD
- Card symbols
- Map markers
- Buttons

### **Design Size**
- **Master File:** `128×128 px` (at 72+ DPI)
- **Purpose:** Gives enough detail for glow effects, shading, and crisp scaling.

### **Export Sizes**
| Use Case | Size | File Naming Example |
|----------|------|---------------------|
| Buttons / Map / HUD / UI | 48×48 px | `fragment-icon-48.png` |


**Format:** PNG-24 (transparent background)  
**Color Profile:** sRGB

**Naming Convention:**  
`[name]-icon-[size].png`
`[name]-card-[size].png`
Example: `move-card-512.png`, `move-icon-128.png`, `fragment-card-512.png`, `fragment-icon-128.png`


---

## **2. Card Art**
Cards are rectangular, full-graphic assets with or without text overlays.

### **Aspect Ratio**
- **Standard:** 2:3 ratio (portrait orientation)
- **Design Size:** `512×768 px` (double resolution for Retina/4K scaling)

### **Export Sizes**
| Use Case | Size | File Naming Example |
|----------|------|---------------------|
| High-DPI HUD / Cards | 512x768 px | `crux-card-512.png` |

**Format:**  
- PNG for detailed painterly art (supports transparency if needed)
- WebP for final builds to reduce file size (no transparency)

**Naming Convention:**  
`card-[name]-[size].png`  
Example: `crux-card-512.png`, `move-card-512.png`

---

## **3. Batch Export Workflow**
1. **Create Master File**  
   - Vector or high-res raster file at **master size** (128×128 for icons, 512×768 for cards).
   - Save in source format (e.g., `.PSD`, `.AI`, `.Krita`, `.XCF`) in `/assets/source/`.

2. **Export Multiple Sizes**  
   - Use your design program’s export presets for:
     - Icons: 32, 48, 64, 128px
     - Cards: 150, 250, 512 px
   - Save to `/iamges/icons/` and `/images/cards/`.

3. **Naming & Version Control**  
   - Always include name and size in filename.
   - Use lowercase and dashes, no spaces.
   - If updating art, append version:  
     Example: `card-move1-150-v2.png`

4. **Optimize for Web**  
   - Use [ImageOptim](https://imageoptim.com/) or [Squoosh](https://squoosh.app/) for final compression.
   - For builds, replace PNG with WebP (except assets needing alpha channel).

---

## **4. Example Folder Structure**

|images/ in root|
   |-icons/ in images|
   |-cards/ in images|
---

## **5. Quick Reference Table**

| Asset Type | Master Size | Display Sizes | Format |
|------------|-------------|---------------|--------|
| Icon | 128×128 px | 32 / 48 / 64 / 128 px | PNG |
| Card | 512×768 px | 150 / 250 / 512 px | PNG / WebP |

---

## **6. **Image List**  
   - crux-icon-128.png, encounter-icon-128.png, focus-icon-128.png, fragment-icon-128.png, move-icon-128.png, player-icon-128.png
   - crux-card-128.png, focus-card-128.png, fragment-card-128.png, move-card-128.png

---

*Version 1.0 – Standardized export process for all icons & cards*
