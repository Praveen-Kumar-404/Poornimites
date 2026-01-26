#!/usr/bin/env python3
"""Fix all remaining emoji patterns in index.html"""

import re

file_path = 'index.html'

# Read the file
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all link arrow emojis
replacements = [
    ('Go to Planner ?', 'Go to Planner →'),
    ('Open Tools ?', 'Open Tools →'),
    ('View Notes ?', 'View Notes →'),
    ('Visit Lounge ?', 'Visit Lounge →'),
    ('Explore Career ?', 'Explore Career →'),
    ('View Clubs ?', 'View Clubs →'),
    ('Go to Bazaar ?', 'Go to Bazaar →'),
    ('Open Events ?', 'Open Events →'),
    ('Join Chat ?', 'Join Chat →'),
    ('Play Now ?', 'Play Now →'),
    ('Log In ?', 'Log In →'),
    ('👤?', '🎭'),  # Any remaining user+question mark
]

count = 0
for old, new in replacements:
    if old in content:
        content = content.replace(old, new)
        count += 1
        print(f"✅ Replaced: '{old}' → '{new}'")

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"\n✅ {count} replacements made")

# Final check for any remaining ? or ??
if '??' in content:
    print("⚠️  Still has ?? patterns")
else:
    print("✅ No ?? patterns")

if '👤?' in content:
    print("⚠️  Still has 👤? patterns")  
else:
    print("✅ No 👤? patterns")

# Count remaining standalone ? that might be broken emojis
standalone_q = len(re.findall(r'\s\?\s', content))
print(f"\nℹ️  Standalone ? count: {standalone_q}")
