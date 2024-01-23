
type TaxYear = {
    taxBrackets: { upperLimit: number, rate: number }[];
    creditsValue: number;
};

export const TAXES_2022: TaxYear = {
    taxBrackets: [
        { upperLimit: 6450, rate: 0.1 },
        { upperLimit: 9240, rate: 0.14 },
        { upperLimit: 14840, rate: 0.2 },
        { upperLimit: 20620, rate: 0.31 },
        { upperLimit: 42910, rate: 0.35 },
        { upperLimit: 55270, rate: 0.47 },
    ],
    creditsValue: 223,
};

export const TAXES_2023: TaxYear = {
    taxBrackets: [
        { upperLimit: 6790, rate: 0.1 },
        { upperLimit: 9730, rate: 0.14 },
        { upperLimit: 15620, rate: 0.2 },
        { upperLimit: 21710, rate: 0.31 },
        { upperLimit: 45180, rate: 0.35 },
        { upperLimit: 58190, rate: 0.47 },
    ],
    creditsValue: 235,
};

export const TAXES_2024: TaxYear = {
    taxBrackets: [
        { upperLimit: 7010, rate: 0.1 },
        { upperLimit: 10060, rate: 0.14 },
        { upperLimit: 16150, rate: 0.2 },
        { upperLimit: 22440, rate: 0.31 },
        { upperLimit: 46690, rate: 0.35 },
        { upperLimit: 60130, rate: 0.47 },
    ],
    creditsValue: 242,
};