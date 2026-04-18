import sys
with open('lib/seo/jsonld.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'description: offerData.description,' in line:
        lines[i] = '    description: offerData.description || "รถใช้งานเชียงใหม่ สภาพดี",\n'
    if "brand: offerData.brand ? { '@type': 'Brand', name: offerData.brand } : undefined," in line:
        lines[i] = '    brand: { \'@type\': \'Brand\', name: offerData.brand or "รถมือสองเชียงใหม่" },\n'

with open('lib/seo/jsonld.js', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print('Modified buildCarJsonLd')
