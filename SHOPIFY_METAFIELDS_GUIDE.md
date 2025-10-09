# คู่มือการเพิ่ม Metafields ใน Shopify สำหรับ Schema Markup

## 🎯 วัตถุประสงค์

เพื่อเพิ่มข้อมูลเฉพาะของรถยนต์แต่ละคันให้กับ Shopify Products เพื่อให้ Google เข้าใจและแสดง Rich Results ได้ดีขึ้น

---

## 📋 Metafields ที่ต้องเพิ่ม

### Namespace: `spec`

| ชื่อฟิลด์ | คีย์ | ประเภท | ตัวอย่าง | ความสำคัญ |
|-----------|------|---------|----------|-----------|
| เลขไมล์ | `mileage` | Number (integer) | `45000` | 🔴 สูงสุด |
| สีรถ | `color` | Single line text | `ขาว`, `เทา`, `ดำ` | � สูงสุด |
| ประเภทตัวถัง | `body_type` | Single line text | `Sedan`, `SUV`, `Pickup` | � สูงสุด |
| เลขตัวถังรถ (VIN) | `vin` | Single line text | `1HGBH41JXMN109186` | 🟢 ต่ำ (Optional) |
| จำนวนที่นั่ง | `seats` | Number (integer) | `5`, `7` | 🟢 ต่ำ |
| ระบบเกียร์ | `transmission` | Single line text | `Automatic`, `Manual` | 🟢 ต่ำ |
| ประเภทเชื้อเพลิง | `fuel_type` | Single line text | `Gasoline`, `Diesel`, `Hybrid` | 🟢 ต่ำ |
| ขนาดเครื่องยนต์ | `engine` | Single line text | `1.5L`, `2.0L` | 🟢 ต่ำ |

---

## 🔴 Metafields สำคัญที่สุด

### 1. Mileage - เลขไมล์

**ทำไมสำคัญ**:
- เป็นข้อมูลสำคัญที่ผู้ซื้อต้องการทราบ
- Google แสดงใน Rich Results
- ช่วยในการประเมินราคา
- ใช้แยกแยะรถที่เป็นรุ่นเดียวกัน

**วิธีการบันทึก**:
- ใส่เป็นตัวเลขล้วนๆ (ไม่ต้องใส่หน่วย)
- ตัวอย่าง: `45000` (หมายถึง 45,000 กม.)

**⚠️ หมายเหตุ**:
- ระบบจะแปลงเป็น `45,000 กม.` อัตโนมัติ
- ไม่ต้องใส่จุลภาคหรือเครื่องหมายพิเศษ

---

### 2. Color - สีรถ

**ทำไมสำคัญ**:
- ช่วยแยกแยะรถที่เป็นรุ่นเดียวกัน
- ข้อมูลที่ผู้ซื้อต้องการทราบ
- แสดงใน Rich Results

**ตัวอย่าง**:
- `ขาว`, `ดำ`, `เทา`, `เงิน`, `แดง`, `น้ำเงิน`
- `White`, `Black`, `Silver`, `Red`, `Blue`

**คำแนะนำ**:
- ใช้ภาษาไทยหรือภาษาอังกฤษก็ได้
- ควรใช้สีหลักเดียว (เช่น `ขาว` แทน `ขาวมุก`)

---

### 3. Body Type - ประเภทตัวถัง

**ทำไมสำคัญ**:
- ช่วยแยกแยะรถประเภทต่างๆ
- Google เข้าใจประเภทรถได้ดีขึ้น
- แสดงใน Rich Results

**ตัวอย่าง**:
- `Sedan` - รถเก๋งซีดาน
- `SUV` - รถอเนกประสงค์
- `Pickup` - รถกระบะ
- `Hatchback` - รถแฮทช์แบ็ก
- `Van` - รถตู้
- `MPV` - รถอเนกประสงค์ 7 ที่นั่ง

**คำแนะนำ**:
- ใช้ชื่อภาษาอังกฤษตามมาตรฐาน
- Google เข้าใจและแสดงผลได้ดีกว่า

---

## 🟢 Metafields เสริม

### 5. Seats - จำนวนที่นั่ง

**ตัวอย่าง**: `5`, `7`, `9`

---

### 6. Transmission - ระบบเกียร์

**ตัวอย่าง**:
- `Automatic` - เกียร์อัตโนมัติ
- `Manual` - เกียร์ธรรมดา
- `CVT` - เกียร์ CVT

---

### 7. Fuel Type - ประเภทเชื้อเพลิง

**ตัวอย่าง**:
- `Gasoline` - น้ำมันเบนซิน
- `Diesel` - น้ำมันดีเซล
- `Hybrid` - ไฮบริด
- `Electric` - ไฟฟ้า

---

### 8. Engine - ขนาดเครื่องยนต์

**ตัวอย่าง**: `1.5L`, `2.0L`, `2.4L`

---

## 🛠️ วิธีเพิ่ม Metafields ใน Shopify

### ขั้นตอนที่ 1: เข้าสู่ Shopify Admin

1. เข้าไปที่ `https://[your-store].myshopify.com/admin`
2. เลือกเมนู **Products**

---

### ขั้นตอนที่ 2: สร้าง Metafield Definition

1. คลิก **Settings** (ขวาล่าง)
2. เลือก **Custom data**
3. เลือก **Products**
4. คลิก **Add definition**

---

### ขั้นตอนที่ 3: เพิ่มแต่ละ Metafield

#### ตัวอย่าง: เพิ่ม VIN

**Name**: `VIN (เลขตัวถังรถ)`  
**Namespace and key**: `spec.vin`  
**Description**: `เลขตัวถังรถ 17 หลัก สำหรับ Schema Markup`  
**Type**: `Single line text`  
**Validation**: (ถ้ามี) `Minimum 17 characters`

#### ตัวอย่าง: เพิ่ม Mileage

**Name**: `Mileage (เลขไมล์)`  
**Namespace and key**: `spec.mileage`  
**Description**: `เลขไมล์รถ (ตัวเลขล้วนๆ ไม่ต้องใส่หน่วย)`  
**Type**: `Integer`  
**Validation**: `Minimum value: 0`

#### ตัวอย่าง: เพิ่ม Color

**Name**: `Color (สีรถ)`  
**Namespace and key**: `spec.color`  
**Description**: `สีหลักของรถ เช่น ขาว, ดำ, เทา`  
**Type**: `Single line text`

#### ตัวอย่าง: เพิ่ม Body Type

**Name**: `Body Type (ประเภทตัวถัง)`  
**Namespace and key**: `spec.body_type`  
**Description**: `ประเภทตัวถังรถ เช่น Sedan, SUV, Pickup`  
**Type**: `Single line text`  
**Options**: (ถ้ามี dropdown)
- `Sedan`
- `SUV`
- `Pickup`
- `Hatchback`
- `Van`
- `MPV`

---

### ขั้นตอนที่ 4: เพิ่มข้อมูลให้กับสินค้า

1. ไปที่ **Products**
2. เลือกรถยนต์ที่ต้องการเพิ่มข้อมูล
3. Scroll ลงมาที่ **Metafields**
4. กรอกข้อมูลในฟิลด์ที่สร้างไว้
5. คลิก **Save**

---

## 📊 ตัวอย่างการกรอกข้อมูล

### Toyota Vios 1.5 E ปี 2016

```
VIN: 1HGBH41JXMN109186
Mileage: 45000
Color: ขาว
Body Type: Sedan
Seats: 5
Transmission: Automatic
Fuel Type: Gasoline
Engine: 1.5L
```

### Honda CR-V 2.0 S ปี 2018

```
VIN: 2HGBH41JXMN109187
Mileage: 62000
Color: เทา
Body Type: SUV
Seats: 7
Transmission: Automatic
Fuel Type: Gasoline
Engine: 2.0L
```

---

## 🔄 การดึงข้อมูล Metafields ใน GraphQL

เว็บไซต์จะดึงข้อมูลผ่าน GraphQL query:

```graphql
query {
  products(first: 10) {
    edges {
      node {
        id
        title
        metafields(namespace: "spec", first: 10) {
          edges {
            node {
              key
              value
            }
          }
        }
      }
    }
  }
}
```

**ผลลัพธ์**:
```json
{
  "metafields": [
    { "key": "vin", "value": "1HGBH41JXMN109186" },
    { "key": "mileage", "value": "45000" },
    { "key": "color", "value": "ขาว" },
    { "key": "body_type", "value": "Sedan" }
  ]
}
```

---

## ✅ Checklist การตรวจสอบ

เมื่อเพิ่ม Metafields เสร็จแล้ว ตรวจสอบ:

- [ ] VIN มี 17 หลัก (หรือใช้เลขทะเบียนแทน)
- [ ] Mileage เป็นตัวเลขล้วนๆ (ไม่มีจุลภาค)
- [ ] Color ใช้ชื่อสีที่เข้าใจง่าย
- [ ] Body Type ตรงกับประเภทรถ
- [ ] Seats เป็นตัวเลข
- [ ] Transmission เป็น Automatic/Manual
- [ ] Fuel Type ถูกต้อง
- [ ] Engine มีหน่วย (L)

---

## 🚀 หลังจากเพิ่มข้อมูลแล้ว

### 1. ทดสอบการดึงข้อมูล

ไปที่ Shopify Admin → Apps → Storefront API Explorer

Run query:
```graphql
{
  product(id: "gid://shopify/Product/[ID]") {
    metafield(namespace: "spec", key: "vin") {
      value
    }
  }
}
```

### 2. ตรวจสอบใน Schema

1. Deploy เว็บไซต์ใหม่
2. ไปที่หน้ารถยนต์
3. View Page Source
4. ค้นหา `application/ld+json`
5. ตรวจสอบว่ามีฟิลด์ใหม่ปรากฏ:
   - `vehicleIdentificationNumber`
   - `mileageFromOdometer`
   - `color`
   - `bodyType`

### 3. ทดสอบ Rich Results

ไปที่: `https://search.google.com/test/rich-results`

ใส่ URL: `https://www.chiangmaiusedcar.com/car/[handle]`

ตรวจสอบว่า:
- ✅ Car Type ถูกต้อง
- ✅ ข้อมูลครบถ้วน
- ✅ ไม่มี Error/Warning

---

## ❓ FAQ

### Q: ถ้าไม่มี VIN จริง จะทำอย่างไร?

**A**: ไม่ต้องกรอก! VIN เป็น optional (ไม่บังคับ) ระบบจะใช้ mileage, color, body_type แยกแยะรถแทน

### Q: ต้องกรอกทุกฟิลด์หรือไม่?

**A**: ไม่จำเป็น ฟิลด์ที่สำคัญที่สุดคือ **mileage, color, body_type** ฟิลด์อื่นๆ กรอกได้ตามข้อมูลที่มี

### Q: ถ้ากรอก Mileage เป็น "45,000" จะเป็นอย่างไร?
**A**: ระบบจะตัดจุลภาคออกอัตโนมัติ แต่ควรกรอกเป็น `45000` เพื่อความแม่นยำ

### Q: สีรถควรใช้ภาษาไทยหรืออังกฤษ?
**A**: ใช้ได้ทั้งสองภาษา แต่แนะนำให้ใช้ภาษาไทยเพื่อให้ตรงกับเว็บไซต์

### Q: Body Type ต้องเขียนตัวพิมพ์ใหญ่หรือเปล่า?
**A**: ควรเขียนตามมาตรฐาน เช่น `Sedan`, `SUV` (ตัวแรกพิมพ์ใหญ่)

---

## 📞 ติดต่อสอบถาม

หากมีปัญหาหรือข้อสงสัยเกี่ยวกับการเพิ่ม Metafields:

- 📧 Email: dev@chiangmaiusedcar.com
- 💬 LINE: @krunueng_usedcar
- 📱 โทร: 094-064-9018

---

## 📚 เอกสารเพิ่มเติม

- [Shopify Metafields Documentation](https://shopify.dev/docs/apps/custom-data/metafields)
- [Schema.org Car Documentation](https://schema.org/Car)
- [Google Vehicle Structured Data](https://developers.google.com/search/docs/appearance/structured-data/vehicle)

---

**อัพเดทล่าสุด**: 9 ตุลาคม 2025
