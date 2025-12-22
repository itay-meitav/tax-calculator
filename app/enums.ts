
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

export const TAXES_2025: TaxYear = {
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

export const TAXES_2026: TaxYear = {
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

export type ReservistTier = {
    minDays: number;
    maxDays: number | null;
    points: number;
};

export const RESERVIST_CREDIT_TIERS_2026_2027: ReservistTier[] = [
    { minDays: 30, maxDays: 39, points: 0.5 },
    { minDays: 40, maxDays: 49, points: 0.75 },
    { minDays: 50, maxDays: 54, points: 1.0 },
    { minDays: 55, maxDays: 59, points: 1.25 },
    { minDays: 60, maxDays: 64, points: 1.5 },
    { minDays: 65, maxDays: 69, points: 1.75 },
    { minDays: 70, maxDays: 74, points: 2.0 },
    { minDays: 75, maxDays: 79, points: 2.25 },
    { minDays: 80, maxDays: 84, points: 2.5 },
    { minDays: 85, maxDays: 89, points: 2.75 },
    { minDays: 90, maxDays: 94, points: 3.0 },
    { minDays: 95, maxDays: 99, points: 3.25 },
    { minDays: 100, maxDays: 104, points: 3.5 },
    { minDays: 105, maxDays: 109, points: 3.75 },
    { minDays: 110, maxDays: null, points: 4.0 },
];

export const MAX_RESERVIST_POINTS = 4;

export function calculateReservistPoints(daysServed: number): number {
    if (daysServed < 30) return 0;
    
    for (const tier of RESERVIST_CREDIT_TIERS_2026_2027) {
        if (tier.maxDays === null) {
            if (daysServed >= tier.minDays) return tier.points;
        } else if (daysServed >= tier.minDays && daysServed <= tier.maxDays) {
            return tier.points;
        }
    }
    
    return 0;
}