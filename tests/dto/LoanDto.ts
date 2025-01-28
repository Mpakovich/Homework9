export class LoanRequestDTO {
    income: number;
    debt: number;
    age: number;
    employed: boolean;
    loanAmount: number;
    loanPeriod: number;

    constructor(income: number, debt: number, age: number, employed: boolean, loanAmount: number, loanPeriod: number) {
        this.income = income;
        this.debt = debt;
        this.age = age;
        this.employed = employed;
        this.loanAmount = loanAmount;
        this.loanPeriod = loanPeriod;
    }

    static createValidLowRisk(): LoanRequestDTO {
        return new LoanRequestDTO(20000, 0, 30, true, 500, 12);
    }

    static createValidMediumRisk(): LoanRequestDTO {
        return new LoanRequestDTO(20000, 0, 30, true, 500, 6);
    }

    static createHighRisk(): LoanRequestDTO {
        return new LoanRequestDTO(100, 0, 17, true, 1000, 12);
    }
}