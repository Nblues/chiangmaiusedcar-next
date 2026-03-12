import re

with open('styles/globals.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove early imports or tailwind injects, we'll rewrite them
content = re.sub(r'@import .*?;', '', content)
content = re.sub(r'@tailwind .*?;', '', content)

# Extract blocks based on their selectors
# We split the CSS into "blocks". 
# A block is everything from the start of a selector to the closing brace.
blocks = re.findall(r'(\/\*[\s\S]*?\*\/)?\s*([^{}]+?\{[\s\S]*?\})', content)

base_rules = []
components_rules = []
utilities_rules = []

for comment, rule in blocks:
    rule_text = ""
    if comment: rule_text += comment.strip() + "\n"
    rule_text += rule.strip()

    selector = rule.split('{')[0].strip()

    # Determine category
    # If media query, check what's inside
    if selector.startswith('@media'):
        # Usually utility if it's responsive aspect ratio
        if '.aspect' in rule or '.cv-auto' in rule or '.touch-manipulation' in rule or '.pagination-stable' in rule:
            utilities_rules.append(rule_text)
        else:
            base_rules.append(rule_text)
        continue

    if selector.startswith('@keyframes'):
        utilities_rules.append(rule_text)
        continue

    # Elements
    if re.match(r'^[a-zA-Z:]', selector) and not selector.startswith('.'):
        base_rules.append(rule_text)
    # Scrollbar
    elif selector.startswith('::-webkit'):
        base_rules.append(rule_text)
    # Buttons, Forms, Pagination
    elif '.btn' in selector or '.form' in selector or '.pagination' in selector or '.image-gallery' in selector or '.loading-spinner' in selector:
        components_rules.append(rule_text)
    # Rest are utilities (aspect, line-clamp, focus:not-sr-only, sr-only, cv-auto, fixed-layout, etc)
    else:
        utilities_rules.append(rule_text)

new_css = """@import './theme.css';

@tailwind base;
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

print("globals.css rewritten successfully!")
