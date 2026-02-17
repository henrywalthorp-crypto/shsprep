# Question Bank Validation Report

> Generated: 2026-02-17 01:21 EST

## Totals

| Section | Count | Files |
|---------|-------|-------|
| Math | 287 | 6 batches (math-001 to math-287) |
| ELA Reading | 105 | 5 batches, 15 passages (ela-rc-001 to ela-rc-105) |
| ELA Revising | 110 | 4 batches (ela-re-001 to ela-re-110) |
| **Total** | **502** | **15 files** |

## Validation Results

- ✅ No duplicate IDs
- ✅ All required fields present (id, category, difficulty, type, stem, options, correctAnswer, explanation, commonMistakes)
- ✅ All difficulties are 1, 2, or 3
- ✅ All types are "mc" or "grid-in"
- ✅ All ELA reading questions have valid passageIds
- ✅ Category naming standardized (34 hyphen→underscore fixes applied)

## Consolidated File

`all_questions.json` — single file with structure:
```json
{
  "meta": { "total": 502, "generated": "2026-02-17" },
  "math": [...],
  "ela_reading": { "passages": [...], "questions": [...] },
  "ela_revising": [...]
}
```
