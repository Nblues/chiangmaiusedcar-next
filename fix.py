import sys, re
with open('lib/seo/jsonld.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = re.sub(r'description: offerData\.description,', r'description: offerData.description || รถยนต์มือสองคุณภาพดี แบรนด์  รุ่น  เชียงใหม่,', text)
text = re.sub(r"brand: offerData\.brand \? \{ '@type': 'Brand', name: offerData\.brand \} : undefined,", "brand: { '@type': 'Brand', name: offerData.brand or 'รถมือสองเชียงใหม่' },", text)

with open('lib/seo/jsonld.js', 'w', encoding='utf-8') as f:
    f.write(text)
print('Done!')
