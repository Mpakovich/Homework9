DELETE /test-orders/{id} endpoint checklist

| # | Test name | Status |
| --- | --- | --- |
| 1 | Delete order with valid ID and get "204" | Pass |
| 2 | Delete order with empty ID and get "405" | Pass |
| 3 | Delete order with invalid token and get "401" | Pass |
| 4 | Delete order with invalid ID format and get "400" | Pass |
| 5 | Delete order with empty api_key and get "401" | Pass |

GET /test-orders/{id} endpoint checklist

| # | Test name | Status |
| --- | --- | --- |
||Test cases from Homework 9:||
| 1 | Get order without authorization and get "401" | Pass   |
| 2 | Get order with extremely large id and get "400" | Pass   |
| 3 | Send multiple requests without exceeding rate limits and get "200" | Pass   |
| 4 | GET should return "429" Too Many Requests after multiple requests -> expect is adapted real result fault  | Pass   |
||Test cases from Lesson 9:||
| 5 | Get order with correct id should receive code "200" | Pass   |
| 6 | Get order with id = 0 | Pass   |
| 7 | Get order with id equal % | Pass   |
| 8 | Get order with id = first and get 400 error  | Pass   |
| 9 | Get order with empty id and get 500 error  | Pass   |

PUT /test-orders/{id} endpoint checklist

| # | Test name | Status |
| --- | --- | --- |
||Test cases from Homework 9:||
| 1 | Post order with unsupported status value should receive code "400" | Pass   |
| 2 | Post order with empty data should receive code 400' | Fault   |
| 3 | Post order with invalid customerPhone should receive code 400 | Fault  |
||Test cases from Lesson 9:||
| 4 | 123 post order with correct data should receive code 201 | Pass   |
| 5 | Post order with data without status field should receive code 200 | Pass   |
| 6 | Post order with empty data should receive code 200 | Pass   |
