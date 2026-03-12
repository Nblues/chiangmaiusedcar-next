import os

def parse_css_blocks(css):
    blocks = []
    current_block = ""
    brace_level = 0
    in_comment = False
    
    i = 0
    while i < len(css):
        char = css[i]
        
        # Handle comments
        if not in_comment and char == '/' and i + 1 < len(css) and css[i+1] == '*':
            in_comment = True
            current_block += char + '*'
            i += 2
            continue
        if in_comment and char == '*' and i + 1 < len(css) and css[i+1] == '/':
            in_comment = False
            current_block += char + '/'
            i += 2
            # If block has no braces and is just a comment followed by whitespace, we might want to attach it to the next block
            # but for simplicity, we just keep accumulating.
            continue
            
        current_block += char
        
        if not in_comment:
            if char == '{':
                brace_level += 1
            elif char == '}':
                brace_level -= 1
                if brace_level == 0:
                    blocks.append(current_block.strip())
                    current_block = ""
        i += 1
        
    if current_block.strip():
        blocks.append(current_block.strip())
        
    return blocks

os.system("git checkout styles/globals.css styles/theme.css")

with open('styles/theme.css', 'r', encoding='utf-8') as f:
    theme_content = f.read()

with open('styles/globals.css', 'r', encoding='utf-8') as f:
    globals_content = f.read()

# Merge safely
content = theme_content + "\n" + globals_content

import re
content = re.sub(r'@import .*?;', '', content)
content = re.sub(r'@tailwind .*?;', '', content)

blocks = parse_css_blocks(content)

base_rules = []
components_rules = []
utilities_rules = []

for block in blocks:
    if not block: continue
    
    if block.startswith('/*') and '{' not in block:
        utilities_rules.append(block)
        continue

    # Extract the selector before the first '{'
    selector_part = block.split('{')[0].strip()
    # Strip comments from selector
    selector = re.sub(r'/\*.*?\*/', '', selector_part).strip()

    if selector.startswith('@media'):
        if '.aspect' in block or '.cv-auto' in block or '.touch-manipulation' in block or '.pagination-stable' in block or '.btn-modern' in block:
            components_rules.append(block)
        else:
            base_rules.append(block)
    elif selector.startswith('@keyframes'):
        utilities_rules.append(block)
    elif re.match(r'^[a-zA-Z:]', selector) and not selector.startswith('.'):
        base_rules.append(block)
    elif selector.startswith('::-webkit') or selector.startswith('*'):
        base_rules.append(block)
    elif '.btn' in selector or '.form' in selector or '.pagination' in selector or '.image-gallery' in selector or '.loading-spinner' in selector:
        components_rules.append(block)
    else:
        utilities_rules.append(block)

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
""" % ("\n\n".join(base_rules), "\n\n".join(components_rules), "\n\n".join(utilities_rules))

with open('styles/globals.css', 'w', encoding='utf-8') as f:
    f.write(new_css)

os.remove('styles/theme.css')
print("Successfully processed with brace tracking!")
