#!/usr/bin/env python3
"""Fix specific emojis in index.html"""

import os

file_path = 'index.html'

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make replacements
replacements = [
    ('👤 Student Toolkit', '🛠️ Student Toolkit'),
    ('👤 Study Resources', '📚 Study Resources'),
    ('👤 Student Lounge', '☕ Student Lounge'),
    ('👤 Growth Zone', '🌱 Growth Zone'),
    ('👤? Clubs & Societies', '🎭 Clubs & Societies'),
    ('👤 Clubs & Societies', '🎭 Clubs & Societies'),  # In case the ? is already gone
    ('👤 Student Bazaar', '🛍️ Student Bazaar'),
    ('👤 Event Hub', '📅 Event Hub'),
    ('👤 Chat', '💬 Chat'),
    ('👤 Break Zone', '🎮 Break Zone'),
    ('👤 Faculty Details', '👨‍🏫 Faculty Details'),
]

count = 0
for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        count += 1
        print(f"✅ Replaced: {old} → {new}")

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n✅ {count} replacements made in index.html")

# Verify
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

print("\n📋 Current headings in index.html:")
import re
headings = re.findall(r'<h2>(.*?)</h2>', content)
for h in headings:
    print(f"  {h}")
