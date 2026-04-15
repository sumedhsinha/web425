#!/usr/bin/env python3
"""
Automatically updates the site map in index.html by scanning the project structure.
Scans all HTML files, CSS, JS, images, logos, and sketches.
Run this script from anywhere - it will find the haxscore directory.
"""

import os
import re
from pathlib import Path
from collections import defaultdict

# Change to haxscore directory
script_dir = Path(__file__).parent
os.chdir(script_dir)

def get_html_files():
    """Scan for all HTML files organized by folder."""
    html_structure = defaultdict(list)
    
    # Main index.html
    html_structure['root'].append('index.html')
    
    # Scan subdirectories for HTML files
    for folder in ['how', 'ref', 'reviews', 'src']:
        folder_path = Path(folder)
        if folder_path.exists():
            html_files = sorted([f.name for f in folder_path.glob('*.html')])
            if html_files:
                html_structure[folder] = html_files
    
    return html_structure

def get_code_files():
    """Get CSS and JS files."""
    code_files = {
        'css': [],
        'js': []
    }
    
    css_path = Path('css')
    if css_path.exists():
        code_files['css'] = sorted([f.name for f in css_path.glob('*.css')])
    
    js_path = Path('js')
    if js_path.exists():
        code_files['js'] = sorted([f.name for f in js_path.glob('*.js')])
    
    return code_files

def get_image_files():
    """Scan images folder for all image files organized by subfolder."""
    image_structure = defaultdict(list)
    images_path = Path('images')
    
    if images_path.exists():
        # Root level images
        root_images = sorted([f.name for f in images_path.glob('*.jpeg')] + 
                             [f.name for f in images_path.glob('*.jpg')] +
                             [f.name for f in images_path.glob('*.png')])
        if root_images:
            image_structure['root'] = root_images
        
        # Images in subfolders
        for subfolder in sorted([d.name for d in images_path.iterdir() if d.is_dir()]):
            subfolder_path = images_path / subfolder
            files = sorted([f.name for f in subfolder_path.glob('*.jpeg')] +
                          [f.name for f in subfolder_path.glob('*.jpg')] +
                          [f.name for f in subfolder_path.glob('*.png')])
            if files:
                image_structure[subfolder] = files
    
    return image_structure

def get_logo_files():
    """Scan logos folder for all logo files."""
    logo_structure = defaultdict(list)
    logos_path = Path('logos')
    
    if logos_path.exists():
        # Root level logos
        root_logos = sorted([f.name for f in logos_path.glob('*.svg')] +
                           [f.name for f in logos_path.glob('*.png')])
        if root_logos:
            logo_structure['root'] = root_logos
        
        # Old logos
        old_path = logos_path / 'old'
        if old_path.exists():
            old_logos = sorted([f.name for f in old_path.glob('*.svg')] +
                              [f.name for f in old_path.glob('*.png')])
            if old_logos:
                logo_structure['old'] = old_logos
    
    return logo_structure

def get_sketch_files():
    """Scan sketches folder for all sketch files."""
    sketches_path = Path('sketches')
    if sketches_path.exists():
        return sorted([f.name for f in sketches_path.glob('*.jpeg')] +
                     [f.name for f in sketches_path.glob('*.jpg')] +
                     [f.name for f in sketches_path.glob('*.png')])
    return []

def generate_articles_section(html_files, code_files):
    """Generate the Articles/Code structure section."""
    html = '        <details>\n            <summary><strong>Articles</strong></summary>\n            <ul>\n'
    
    # Index
    html += '                <li><a href="index.html">index.html</a> - Main entry point</li>\n'
    
    # CSS
    if code_files['css']:
        html += '                <li>\n                    <strong>css</strong>\n                    <ul>\n'
        for css_file in code_files['css']:
            html += f'                        <li><a href="css/{css_file}">{css_file}</a></li>\n'
        html += '                    </ul>\n                </li>\n'
    
    # JS
    if code_files['js']:
        html += '                <li>\n                    <strong>js</strong>\n                    <ul>\n'
        for js_file in code_files['js']:
            html += f'                        <li><a href="js/{js_file}">{js_file}</a></li>\n'
        html += '                    </ul>\n                </li>\n'
    
    # Other folders with HTML
    for folder in ['how', 'ref', 'reviews', 'src']:
        if folder in html_files:
            html += f'                <li>\n                    <strong>{folder}</strong>\n                    <ul>\n'
            for html_file in html_files[folder]:
                html += f'                        <li><a href="{folder}/{html_file}">{html_file}</a></li>\n'
            html += '                    </ul>\n                </li>\n'
    
    html += '            </ul>\n        </details>\n'
    return html

def generate_assets_section(image_structure, logo_structure, sketches):
    """Generate the Assets section."""
    html = '        <details>\n            <summary><strong>Assets</strong></summary>\n            <ul>\n'
    
    # Images
    html += '                <li>\n                    <strong>images</strong>\n                    <ul>\n'
    
    # Root level images
    if 'root' in image_structure:
        for img in image_structure['root']:
            html += f'                        <li><a href="images/{img}">{img}</a></li>\n'
    
    # Images in subfolders
    for folder in sorted([k for k in image_structure.keys() if k != 'root']):
        html += f'                        <li>\n                            <strong>{folder}</strong>\n                            <ul>\n'
        for img in image_structure[folder]:
            html += f'                                <li><a href="images/{folder}/{img}">{img}</a></li>\n'
        html += '                            </ul>\n                        </li>\n'
    
    html += '                    </ul>\n                </li>\n'
    
    # Logos
    html += '                <li>\n                    <strong>logos</strong>\n                    <ul>\n'
    
    # Root level logos
    if 'root' in logo_structure:
        for logo in logo_structure['root']:
            html += f'                        <li><a href="logos/{logo}">{logo}</a></li>\n'
    
    # Old logos
    if 'old' in logo_structure:
        html += '                        <li>\n                            <strong>old</strong>\n                            <ul>\n'
        for logo in logo_structure['old']:
            html += f'                                <li><a href="logos/old/{logo}">{logo}</a></li>\n'
        html += '                            </ul>\n                        </li>\n'
    
    html += '                    </ul>\n                </li>\n'
    
    # Sketches
    if sketches:
        html += '                <li>\n                    <strong>sketches</strong>\n                    <ul>\n'
        for sketch in sketches:
            html += f'                        <li><a href="sketches/{sketch}">{sketch}</a></li>\n'
        html += '                    </ul>\n                </li>\n'
    
    html += '            </ul>\n        </details>\n'
    return html

def update_sitemap():
    """Read index.html, generate new sitemap, and update the file."""
    
    # Gather all file information
    html_files = get_html_files()
    code_files = get_code_files()
    image_structure = get_image_files()
    logo_structure = get_logo_files()
    sketches = get_sketch_files()
    
    # Generate sections
    articles_section = generate_articles_section(html_files, code_files)
    assets_section = generate_assets_section(image_structure, logo_structure, sketches)
    
    # Read the index.html file
    index_path = Path('index.html')
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Pattern to find the entire sitemap section from first <details> to last </details>
    pattern = r'        <details>.*?        </details>\n        <details>.*?        </details>\n'
    
    # Replace the old sitemap with the new one
    new_sitemap = articles_section + assets_section
    new_content = re.sub(pattern, new_sitemap, content, flags=re.DOTALL, count=1)
    
    # Write back to file
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("Site map updated successfully!")
    print(f"  - Found {len(html_files.get('how', [])) + len(html_files.get('ref', [])) + len(html_files.get('reviews', [])) + len(html_files.get('src', []))} HTML files")
    print(f"  - Found {sum(len(v) for v in image_structure.values())} image files")
    print(f"  - Found {sum(len(v) for v in logo_structure.values())} logo files")
    print(f"  - Found {len(sketches)} sketch files")

if __name__ == '__main__':
    try:
        update_sitemap()
    except Exception as e:
        print(f"Error updating sitemap: {e}")
        import traceback
        traceback.print_exc()
