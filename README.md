
Added:

- [x] Api-hw10 Folder (folder with Homework NR10)

- [x] DTO folder

- [x] LoadDto.ts

- [x] PostLoanDto.ts - with api tests

Post /loan-calc/decision endpoint checklist

| # | Test name | Status | Comment |
| --- | --- | --- | --- |
||Test cases from Homework 10||
| 1 | Positive decision with Low Risk "200" | Pass   |
| 2 | Positive decision with Medium Risk "200" | Pass   |
| 3 | Negative decision due to High Risk "200" | Pass  |
| 4 | Negative decision due to invalid age | Fault   | - must be code status "400" but some reason we get "200"
| 5 | Negative decision due to missing fields "400" | Pass   |
| 6 |Negative decision due to invalid data types "400" | Pass   |
| 7 |Negative decision with random negative age using Math.floor "400" | Pass   |
| 8 |Negative decision due to missing debt, employed fields "400" | faild   |  - must be code status "400" but some reason we get "200"

Fixes:
- [x] Moving Lesson-9+Homework9 in folder api-hw9 for better review
- [x] Added Response status for all test cases in Homework 10.
- [x] Added one more TC
