import os
import re

def process_directory(directory):
    # Regex to match import line: import imgName from "figma:asset/..."
    pattern = re.compile(r'^(\s*)import\s+(\w+)\s+from\s+[\'"]figma:asset/[^\'"]+[\'"];?\s*$', re.MULTILINE)
    
    count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if not file.endswith(('.tsx', '.ts', '.jsx', '.js')):
                continue
            
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            def replacer(match):
                indent = match.group(1)
                var_name = match.group(2)
                
                path_name = var_name
                if path_name.startswith('imgImage'):
                    path_name = path_name[8:]
                elif path_name.startswith('img'):
                    path_name = path_name[3:]
                
                if path_name:
                    path_name = path_name[0].lower() + path_name[1:]
                else:
                    path_name = "asset"
                    
                return f'{indent}const {var_name} = "/{path_name}.png";'
                
            new_content = pattern.sub(replacer, content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filepath}")
                count += 1
                
    print(f"Total files updated: {count}")

if __name__ == "__main__":
    process_directory(r"c:\Users\1sriv\Downloads\file-main\file-main\src")
