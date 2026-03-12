import re
import os

with open('styles/globals.css', 'r', encoding='utf-8') as f:
    globals_content = f.read()

with open('styles/theme.css', 'r', encoding='utf-8') as f:
    theme_content = f.read()

# Restore from git just to be totally clean
os.system("git checkout styles/globals.css styles/theme.css")

with open('styles/globals.css', 'r', encoding='utf-8') as f:
    globals_content = f.read()

content = theme_content + "\n" + globals_content

content = re.sub(r'@import .*?;', '', content)
content = re.sub(r'@tailwind .*?;', '', content)

blocks = re.findall(r'(\/\*[\s\S]*?\*\/)?\s*([^{}]+?\{[\s\S]*?\})', content)

base_rules = []
components_rules = []
utilities_rules = []

for comment, rule in blocks:
    rule_text = ""
    if comment: rule_text += comment.strip() + "\n"
    rule_text += rule.strip()

    selector = rule.split('{')[0].strip()

    if selector.startswith('@media'):
        if '.aspect' in rule or '.cv-auto' in rule or '.touch-manipulation' in rule or '.pagination-stable' in rule or '.btn-modern' in rule:
            components_rules.append(rule_text)
        else:
            base_rules.append(rule_text)
        continue

    if selector.startswith('@keyframes'):
        utilities_rules.append(rule_text)
        continue

    if re.match(r'^[a-zA-Z:]', selector) and not selector.startswith('.'):
        base_rules.append(rule_text)
    elif selector.startswith('::-webkit'):
        base_rules.append(rule_text)
    elif '.btn' in selector or '.form' in selector or '.pagination' in selector or '.image-gallery' in selector or '.loading-spinner' in selector:
        components_rules.append(rule_text)
    else:
        utilities_rules.append(rule_text)

new_css = """@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
%s
}

@layer components {
%s
}

@layer utilities {
%s
}
""" % ("\n  ".join(base_rules), "\n  ".join(components_rules), "\n  ".join(utilities_rules))

with open('styles/globals.css', 'w', encoding='utf-8') as f:
    f.write(new_css)

os.remove('styles/theme.css')
print("Merged theme.css into globals.css and layered safely!")
