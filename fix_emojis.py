#!/usr/bin/env python3
"""
Emoji Encoding Fix Tool
Fixes broken emoji characters (�� �) in HTML files
"""

import os
import re
from pathlib import Path

# Emoji replacement mapping
EMOJI_FIXES = {
    # Common tools UI text
    '🔄 Unit Converter': ['�� Unit Converter', '?? Unit Converter'],
    '📅 Personal Planner': ['�� Personal Planner', '?? Personal Planner'],
    '📄 PDF Toolkit': ['�� PDF Toolkit', '?? PDF Toolkit'],
    '📝 Notes Workspace': ['�� Notes Workspace', '?? Notes Workspace'],
    '💻 Developer Suite': ['�� Developer Suite', '?? Developer Suite'],
    '🧮 Calculator': ['�� Calculator', '?? Calculator'],
    '📊 GPA Calc': ['�� GPA Calc', '?? GPA Calc'],
    '🔄 Universal Conv.': ['�� Universal Conv.', '?? Universal Conv.'],
    '⏰ Pomodoro': ['�� Pomodoro', '?? Pomodoro'],
    '🗺️ Campus Map': ['��� Campus Map', '??? Campus Map', '�� Campus Map', '?? Campus Map'],
    '🚌 Bus Routes': ['�� Bus Routes', '?? Bus Routes'],
    '❤️ by Students': ['�� by Students', '?? by Students'],
    '📋 Copy Result': ['�� Copy Result', '?? Copy Result'],
    
    # Profile page icons
    '👤': ['��', '??'],
    '📊': ['��'],
    '🎓': ['��'],
    '⚙️': ['��'],
    '🔔': ['��'],
    '📧': ['��'],
    '🔒': ['��'],
    '💼': ['��'],
    '🎯': ['��'],
    '🔗': ['��'],
    '🌐': ['��'],
    '📱': ['��'],
}

def fix_emojis_in_file(file_path):
    """Fix emoji encoding in a single file."""
    try:
        # Read file
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        original_content = content
        replacements = 0
        
        # Apply all replacements
        for correct_emoji, broken_versions in EMOJI_FIXES.items():
            for broken in broken_versions:
                if broken in content:
                    content = content.replace(broken, correct_emoji)
                    replacements += 1
        
        # Write back if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, replacements
        
        return False, 0
        
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False, 0

def main():
    """Main function to process all HTML files."""
    print("\n" + "="*50)
    print("  🔧 Emoji Encoding Fix Tool")
    print("="*50 + "\n")
    
    # Find all HTML files
    html_files = list(Path('.').rglob('*.html'))
    print(f"📁 Found {len(html_files)} HTML files\n")
    
    files_fixed = 0
    total_replacements = 0
    
    # Process each file
    for html_file in html_files:
        fixed, count = fix_emojis_in_file(html_file)
        if fixed:
            files_fixed += 1
            total_replacements += count
            print(f"✅ Fixed: {html_file.name} ({count} replacements)")
    
    # Summary
    print("\n" + "="*50)
    print(f"  📊 Summary")
    print("="*50)
    print(f"  Files modified: {files_fixed}")
    print(f"  Total replacements: {total_replacements}")
    print("="*50 + "\n")
    
    # Check for remaining issues
    print("🔍 Checking for remaining issues...\n")
    remaining_issues = []
    
    for html_file in html_files:
        try:
            with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Count remaining ?? patterns
            count = content.count('??')
            if count > 0:
                remaining_issues.append((html_file, count))
        except:
            pass
    
    if remaining_issues:
        print("⚠️  Files with remaining ?? patterns:\n")
        for file_path, count in remaining_issues:
            print(f"  - {file_path.name}: {count} occurrences")
            print(f"    Path: {file_path}")
    else:
        print("✅ All emojis fixed successfully!")
    
    print("\n")

if __name__ == '__main__':
    main()
