#!/usr/bin/env python3
import json, glob, os, re
from collections import defaultdict, Counter

BASE = os.path.dirname(os.path.abspath(__file__))
files = sorted(glob.glob(os.path.join(BASE, "*.json")))
print(f"Found {len(files)} JSON files")

errors = []
all_ids = []
stats = {"math": 0, "ela_reading": 0, "ela_revising": 0}
by_difficulty = Counter()
by_category = Counter()
all_math = []
all_ela_reading_q = []
all_ela_reading_passages = []
all_ela_revising = []
passage_ids_seen = set()

REQUIRED = ["id", "category", "difficulty", "type", "stem", "correctAnswer", "explanation", "commonMistakes"]

def classify_file(fname):
    b = os.path.basename(fname)
    if b.startswith("math"): return "math"
    if b.startswith("ela_reading"): return "ela_reading"
    if b.startswith("ela_revising"): return "ela_revising"
    return None

def validate_question(q, section, fname):
    errs = []
    qid = q.get("id", "UNKNOWN")
    
    for f in REQUIRED:
        if f not in q:
            errs.append(f"{qid}: missing field '{f}' in {os.path.basename(fname)}")
    
    # options required for mc
    qtype = q.get("type", "")
    if qtype in ("multiple_choice", "mc") and "options" not in q:
        errs.append(f"{qid}: missing 'options' for mc question")
    
    # difficulty
    diff = q.get("difficulty")
    if diff not in (1, 2, 3):
        errs.append(f"{qid}: invalid difficulty {diff}")
    
    # type validation
    valid_types = {"multiple_choice", "mc", "grid-in", "grid_in"}
    if section != "math":
        valid_types = {"multiple_choice", "mc"}
    if qtype not in valid_types:
        errs.append(f"{qid}: invalid type '{qtype}' for section {section}")
    
    # ELA reading needs passageId
    if section == "ela_reading" and "passageId" not in q:
        errs.append(f"{qid}: ELA reading question missing passageId")
    
    # category dot-notation
    cat = q.get("category", "")
    if not re.match(r'^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$', cat):
        errs.append(f"{qid}: category '{cat}' doesn't follow dot-notation")
    
    return errs

for fpath in files:
    section = classify_file(fpath)
    if section is None:
        continue
    
    with open(fpath) as f:
        data = json.load(f)
    
    questions = []
    if section == "ela_reading":
        # Has passages + questions structure
        if isinstance(data, dict):
            passages = data.get("passages", [])
            questions = data.get("questions", [])
            for p in passages:
                pid = p.get("id")
                if pid not in passage_ids_seen:
                    passage_ids_seen.add(pid)
                    all_ela_reading_passages.append(p)
        else:
            questions = data
    else:
        if isinstance(data, list):
            questions = data
        elif isinstance(data, dict):
            questions = data.get("questions", data.get("items", []))
    
    for q in questions:
        qid = q.get("id", "UNKNOWN")
        all_ids.append(qid)
        
        errs = validate_question(q, section, fpath)
        errors.extend(errs)
        
        diff = q.get("difficulty")
        if diff in (1,2,3):
            by_difficulty[diff] += 1
        by_category[q.get("category", "unknown")] += 1
        
        if section == "math":
            stats["math"] += 1
            all_math.append(q)
        elif section == "ela_reading":
            stats["ela_reading"] += 1
            all_ela_reading_q.append(q)
            # verify passageId exists
            pid = q.get("passageId")
            if pid and pid not in passage_ids_seen:
                errors.append(f"{qid}: passageId '{pid}' not found in any passage list")
        elif section == "ela_revising":
            stats["ela_revising"] += 1
            all_ela_revising.append(q)

# Check duplicates
id_counts = Counter(all_ids)
dupes = {k: v for k, v in id_counts.items() if v > 1}

total = sum(stats.values())
print(f"\nTotal questions: {total}")
print(f"  Math: {stats['math']}")
print(f"  ELA Reading: {stats['ela_reading']}")
print(f"  ELA Revising: {stats['ela_revising']}")
print(f"Duplicates: {len(dupes)}")
print(f"Errors: {len(errors)}")

# Re-check ela_reading passageIds after all passages loaded
for q in all_ela_reading_q:
    pid = q.get("passageId")
    if pid and pid not in passage_ids_seen:
        errors.append(f"{q['id']}: passageId '{pid}' references missing passage")

# Write report
report = f"""# SHSAT Question Bank Validation Report

Generated: 2026-02-17

## File Count
- JSON files found: {len(files)}

## Question Totals
| Section | Count | Expected |
|---------|-------|----------|
| Math | {stats['math']} | 287 |
| ELA Reading | {stats['ela_reading']} | 105 |
| ELA Revising | {stats['ela_revising']} | 110 |
| **Total** | **{total}** | **502** |

## By Difficulty
| Difficulty | Count |
|-----------|-------|
| 1 (Easy) | {by_difficulty[1]} |
| 2 (Medium) | {by_difficulty[2]} |
| 3 (Hard) | {by_difficulty[3]} |

## By Category
| Category | Count |
|----------|-------|
"""
for cat, cnt in sorted(by_category.items()):
    report += f"| {cat} | {cnt} |\n"

report += f"""
## Duplicate IDs
"""
if dupes:
    for did, cnt in sorted(dupes.items()):
        report += f"- `{did}` appears {cnt} times\n"
else:
    report += "None found ✅\n"

report += f"""
## Validation Errors ({len(errors)})
"""
if errors:
    for e in errors:
        report += f"- {e}\n"
else:
    report += "None found ✅\n"

report += f"""
## Passages (ELA Reading)
- Total passages: {len(all_ela_reading_passages)}
- Passage IDs: {', '.join(sorted(p for p in passage_ids_seen if p))}
"""

with open(os.path.join(BASE, "VALIDATION_REPORT.md"), "w") as f:
    f.write(report)

# Write consolidated file
consolidated = {
    "math": all_math,
    "ela_reading": {
        "passages": all_ela_reading_passages,
        "questions": all_ela_reading_q
    },
    "ela_revising": all_ela_revising
}
with open(os.path.join(BASE, "all_questions.json"), "w") as f:
    json.dump(consolidated, f, indent=2)

print(f"\nWrote VALIDATION_REPORT.md and all_questions.json")
if errors:
    print(f"\n⚠️  {len(errors)} errors found. Check report for details.")
else:
    print("\n✅ All validations passed!")
