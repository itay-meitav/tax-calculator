import { TAXES_2023, TAXES_2025, calculateReservistPoints } from "./enums";

export function calculateTax(income: number, credits?: number, reservistDays?: number) {
    const reservistPoints = reservistDays ? calculateReservistPoints(reservistDays) : 0;
    
    let taxInfo2023 = calculateTaxForBracket(2023, income, credits);
    
    let taxInfo2025 = calculateTaxForBracket(2025, income, credits);
    
    const totalCredits2026 = (credits || 0) + reservistPoints;
    let taxInfo2026 = calculateTaxForBracket(2025, income, totalCredits2026);
    
    let tax2023 = Math.ceil(taxInfo2023.tax);
    let tax2025 = Math.ceil(taxInfo2025.tax);
    let tax2026 = Math.ceil(taxInfo2026.tax);
    
    return {
        monthlyTax2023: tax2023,
        annualTax2023: tax2023 * 12,
        monthlyTax2025: tax2025,
        annualTax2025: tax2025 * 12,
        monthlyTax2026: tax2026,
        annualTax2026: tax2026 * 12,
        monthlyDifference: tax2023 - tax2025,
        annualDifference: tax2023 * 12 - tax2025 * 12,
        actions: taxInfo2025.actions,
        reservistPoints,
        reservistDays: reservistDays || 0,
    };
}

export function parseNumber(number: number): string {
    return new Intl.NumberFormat("en-US").format(number) + " שקלים";
}

export function parseUpperLimit(number: number) {
    if (number < TAXES_2025.taxBrackets[0].upperLimit) {
        return "הראשונה";
    } else if (number < TAXES_2025.taxBrackets[1].upperLimit) {
        return "השנייה";
    } else if (number < TAXES_2025.taxBrackets[2].upperLimit) {
        return "השלישית";
    } else if (number < TAXES_2025.taxBrackets[3].upperLimit) {
        return "הרביעית";
    } else if (number < TAXES_2025.taxBrackets[4].upperLimit) {
        return "החמישית";
    } else if (number < TAXES_2025.taxBrackets[5].upperLimit) {
        return "השישית";
    }
    return "האחרונה";
}

function calculateTaxForBracket(year: number, income: number, credits?: number) {
    let tax = 0;
    const { taxBrackets, creditsValue } = year === 2023 ? TAXES_2023 : TAXES_2025;
    const actions: string[] = [];

    for (let i = 0; i < taxBrackets.length; i++) {
        if (income <= taxBrackets[i].upperLimit) {
            let incomeInRange = income - (taxBrackets[i - 1] ? taxBrackets[i - 1].upperLimit + 1 : 0);
            tax += incomeInRange * taxBrackets[i].rate;
            actions.push(`${incomeInRange} X ${taxBrackets[i].rate} = ${Math.ceil(incomeInRange * taxBrackets[i].rate)}`);
            break;
        }

        tax += (taxBrackets[i].upperLimit - (taxBrackets[i - 1] ? taxBrackets[i - 1].upperLimit + 1 : 0)) * taxBrackets[i].rate;
        actions.push(`${taxBrackets[i].upperLimit - (taxBrackets[i - 1] ? taxBrackets[i - 1].upperLimit + 1 : 0)}
         X ${taxBrackets[i].rate} = ${Math.ceil((taxBrackets[i].upperLimit - (taxBrackets[i - 1] ?
            taxBrackets[i - 1].upperLimit + 1 : 0)) * taxBrackets[i].rate)}`);
    }

    if (income > taxBrackets[taxBrackets.length - 1].upperLimit + 1) {
        tax += (income - taxBrackets[taxBrackets.length - 1].upperLimit + 1) * 0.5;
        actions.push(`${income - taxBrackets[taxBrackets.length - 1].upperLimit + 1} X 0.5 = ${Math.ceil(tax)}`);
    }

    if (credits && credits > 0) {
        actions.push(`${credits} X ${creditsValue} = ${Math.ceil(credits * creditsValue)} (נק' זיכוי)`,
            `${Math.ceil(tax)} - ${Math.ceil(credits * creditsValue)} = ${Math.ceil(tax - credits * creditsValue) > 0 ? Math.ceil(tax - credits * creditsValue) : 0}`);

        tax = tax - credits * creditsValue;

        if (tax < 0) {
            tax = 0;
        }
    }
    return { tax, actions };
}

export const google = {
    event: async ({ action, data }: { action: string, data: object }) => {
        if (typeof window !== 'undefined') {
            window.gtag('event', action, { ...data });
        }
    },
};
