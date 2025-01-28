import { expect, test } from '@playwright/test';
import { LoanRequestDTO } from '../dto/LoanDto';
import { StatusCodes } from 'http-status-codes';

// 1. Позитивный сценарий: Low Risk
test('Positive decision with Low Risk', async ({ request }) => {
  const requestBody = LoanRequestDTO.createValidLowRisk();
  const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: requestBody,
      },
  );
  const responseBody = await response.json();

  console.log('Response status:', response.status());
  expect.soft(response.status()).toBe(StatusCodes.OK);
  expect.soft(responseBody.riskDecision).toBe('positive');
  expect.soft(responseBody.riskLevel).toBe('Low Risk');
  expect.soft(responseBody.riskPeriods).toContain(12);
});

// 2. Позитивный сценарий: Medium Risk
test('Positive decision with Medium Risk', async ({ request }) => {
  const requestBody = LoanRequestDTO.createValidMediumRisk();
  const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: requestBody,
      },
  );
  const responseBody = await response.json();
  console.log('Response status:', response.status());

  expect.soft(response.status()).toBe(StatusCodes.OK);
  expect.soft(responseBody.riskDecision).toBe('positive');
  expect.soft(responseBody.riskLevel).toBe('Medium Risk');
  expect.soft(responseBody.riskPeriods).toContain(6);
});

// 3. Негативный сценарий: High Risk
test('Negative decision due to High Risk', async ({ request }) => {
  const requestBody = LoanRequestDTO.createHighRisk();
  const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: requestBody,
      },
  );
  const responseBody = await response.json();

  console.log('Response status:', response.status());
  expect.soft(response.status()).toBe(StatusCodes.OK);
  expect.soft(responseBody.riskDecision).toBe('negative');
  expect.soft(responseBody.riskLevel).toBe('Very High Risk');
});

// 4. Негативный сценарий: возраст вне допустимого диапазона
test('Negative decision due to invalid age', async ({ request }) => {
  const requestBody = new LoanRequestDTO(20000, 0, 16, true, 500, 12);
  const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: requestBody,
      },
  );

  console.log('Response status:', response.status());
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST); //must be code status 400, but we get 200
});

// 5. Негативный сценарий: пропущены обязательные поля
test('Negative decision due to missing fields', async ({ request }) => {
  const requestBody = { income: 20000 }; // Пропущены другие поля
  const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: requestBody,
      },
  );

  console.log('Response status:', response.status());
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST);
});

// 6. Негативный сценарий: неверные типы данных
test('Negative decision due to invalid data types', async ({ request }) => {
  const requestBody = {
    income: 20000,
    debt: 0,
    age: 'value', // Неверный тип
    employed: true,
    loanAmount: true, // Неверный тип
    loanPeriod: 12,
  };
  const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: requestBody,
      },
  );

  console.log('Response status:', response.status());
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST);
});

// 7. Проба работы с Math.floor - Math.random
test('Negative decision with random negative age using Math.floor', async ({ request }) => {
  // Генерируем случайные значения
  const randomIncome = Math.floor(Math.random() * 20000); // Доход в диапазоне от 0 до 20000
  const randomDebt = Math.floor(Math.random() * 1000); // Долг в диапазоне от 0 до 999
  const randomAge = Math.floor(Math.random() * -20); // Отрицательный возраст от -1 до -20
  const randomLoanAmount = Math.floor(Math.random() * 2000); // Сумма займа от 0 до 1999
  const randomLoanPeriod = Math.floor(Math.random() * 5); // Период займа от 0 до 4 месяцев

  // Создаем тело запроса
  const requestBody = {
    income: randomIncome,
    debt: randomDebt,
    age: randomAge, // Используем отрицательное значение возраста
    employed: true, // Считаем, что клиент работает
    loanAmount: randomLoanAmount,
    loanPeriod: randomLoanPeriod,
  };

  // Отправляем POST-запрос
  const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: requestBody,
      },
  );

  // Логируем статус ответа
  console.log('Response status:', response.status());
  console.log('Request body:', requestBody);

  // Проверяем, что сервер возвращает код 400 Bad Request
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST);
});

// 8. Негативный сценарий: пропущены обязательные поля: debt, employed
test('Negative decision due to missing debt, employed fields ', async ({ request }) => {
  const requestBody = { income: 20000, age: 6, loanAmount: 500, loanPeriod: 9 }; // Пропущены другие поля
  const response = await request.post(
      'https://backend.tallinn-learning.ee/api/loan-calc/decision',
      {
        data: requestBody,
      },
  );

  console.log('Response status:', response.status());
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST); //status must be 400 but we get 200
});