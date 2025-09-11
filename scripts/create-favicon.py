#!/usr/bin/env python3
"""
สคริปต์ปรับ favicon.png เดิมให้เป็นวงกลมเต็มขอบสีแดงสำหรับ ครูหนึ่งรถสวย
"""

from PIL import Image, ImageDraw
import os

def create_circular_favicon():
    # ตรวจสอบว่ามี favicon.png เดิมหรือไม่
    favicon_path = '../public/favicon.png'
    
    if not os.path.exists(favicon_path):
        print("❌ ไม่พบไฟล์ favicon.png เดิม")
        return
    
    try:
        # โหลด favicon เดิม
        original_img = Image.open(favicon_path)
        print(f"📂 โหลด favicon เดิมขนาด {original_img.size}")
        
        # แปลงเป็น RGBA ถ้าไม่ใช่
        if original_img.mode != 'RGBA':
            original_img = original_img.convert('RGBA')
        
        # ขนาด favicon มาตรฐาน
        sizes = [16, 32, 48, 96, 144, 192, 256, 384, 512]
        
        # สีแดงสำหรับขอบ
        red_color = (220, 38, 38)  # สีแดง Tailwind red-600
        
        for size in sizes:
            # ใช้ขนาดเต็มโดยไม่หักขอบ
            inner_size = size
            
            # ปรับขนาดรูปเดิมให้เต็มขนาด
            resized_img = original_img.resize((inner_size, inner_size), Image.Resampling.LANCZOS)
            
            # สร้าง canvas ใหม่
            final_img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
            
            # สร้าง mask วงกลมสำหรับรูปภายใน
            mask = Image.new('L', (inner_size, inner_size), 0)
            mask_draw = ImageDraw.Draw(mask)
            mask_draw.ellipse([0, 0, inner_size, inner_size], fill=255)
            
            # ใช้ mask กับรูปที่ปรับขนาด
            masked_img = Image.new('RGBA', (inner_size, inner_size), (0, 0, 0, 0))
            masked_img.paste(resized_img, (0, 0))
            masked_img.putalpha(mask)
            
            # วาง masked รูปลงใน canvas (เต็มขนาด)
            final_img.paste(masked_img, (0, 0), masked_img)
            
            # บันทึกไฟล์
            if size == 512:
                # favicon หลัก
                final_img.save('../public/favicon.png', 'PNG')
                print(f"✅ อัปเดต favicon.png หลัก (512x512)")
            else:
                # favicon ขนาดอื่นๆ 
                output_path = f'../public/favicon-{size}.png'
                final_img.save(output_path, 'PNG')
                print(f"✅ สร้าง favicon-{size}.png เรียบร้อย")
        
        # สร้าง favicon.ico จากขนาดต่างๆ
        create_favicon_ico()
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")

def create_favicon_ico():
    """สร้าง favicon.ico จากรูปที่สร้างแล้ว"""
    try:
        # ขนาดสำหรับ ICO
        icon_sizes = [16, 32, 48]
        icon_images = []
        
        for size in icon_sizes:
            favicon_file = f'../public/favicon-{size}.png'
            if os.path.exists(favicon_file):
                img = Image.open(favicon_file)
                icon_images.append(img)
        
        if icon_images:
            # บันทึกเป็น ICO
            icon_images[0].save('../public/favicon.ico', format='ICO', 
                              sizes=[(img.size[0], img.size[1]) for img in icon_images])
            print("✅ สร้าง favicon.ico เรียบร้อย")
        
    except Exception as e:
        print(f"⚠️ ไม่สามารถสร้าง ICO ได้: {e}")

if __name__ == "__main__":
    print("🎨 กำลังปรับ favicon เดิมให้เป็นวงกลมขอบสีแดงสำหรับ ครูหนึ่งรถสวย...")
    create_circular_favicon()
    print("✅ ปรับ favicon ทั้งหมดเรียบร้อยแล้ว!")