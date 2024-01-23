import { TAXES_2023, TAXES_2024 } from "./enums";

export function calculateTax(income: number, credits?: number) {
    let taxInfo2023 = calculateTaxForBracket(2023, income, credits);
    let taxInfo2024 = calculateTaxForBracket(2024, income, credits);
    let tax2023 = roundHalf(taxInfo2023.tax);
    let tax2024 = roundHalf(taxInfo2024.tax);
    return {
        monthlyTax2023: tax2023,
        annualTax2023: tax2023 * 12,
        monthlyTax2024: tax2024,
        annualTax2024: tax2024 * 12,
        monthlyDifference: tax2023 - tax2024,
        annualDifference: tax2023 * 12 - tax2024 * 12,
        actions: taxInfo2024.actions,
    };
}

export function parseNumber(number: number): string {
    return new Intl.NumberFormat("en-US").format(number) + " שקלים";
}

export function parseUpperLimit(number: number) {
    if (number < TAXES_2023.taxBrackets[0].upperLimit) {
        return "הראשונה";
    } else if (number < TAXES_2023.taxBrackets[1].upperLimit) {
        return "השנייה";
    } else if (number < TAXES_2023.taxBrackets[2].upperLimit) {
        return "השלישית";
    } else if (number < TAXES_2023.taxBrackets[3].upperLimit) {
        return "הרביעית";
    } else if (number < TAXES_2023.taxBrackets[4].upperLimit) {
        return "החמישית";
    } else if (number < TAXES_2023.taxBrackets[5].upperLimit) {
        return "השישית";
    }
    return "האחרונה";
}

function roundHalf(num: number): number {
    if (num % 1 >= 0.5) {
        return Math.ceil(num);
    } else if (num % 1 == 0.5) {
        return num;
    } else {
        return Math.floor(num);
    }
}

function calculateTaxForBracket(year: number, income: number, credits?: number) {
    let tax = 0;
    const { taxBrackets, creditsValue } =
        year === 2023 ? TAXES_2023 : TAXES_2024;
    const actions: string[] = [];
    for (let i = 0; i < taxBrackets.length; i++) {
        if (income <= taxBrackets[i].upperLimit) {
            let incomeInRange =
                income - (taxBrackets[i - 1] ? taxBrackets[i - 1].upperLimit + 1 : 0);
            tax += incomeInRange * taxBrackets[i].rate;
            actions.push(
                `${incomeInRange} X ${taxBrackets[i].rate} = ${roundHalf(
                    incomeInRange * taxBrackets[i].rate
                )} `
            );
            break;
        }
        tax +=
            (taxBrackets[i].upperLimit -
                (taxBrackets[i - 1] ? taxBrackets[i - 1].upperLimit + 1 : 0)) *
            taxBrackets[i].rate;
        actions.push(
            `${taxBrackets[i].upperLimit -
            (taxBrackets[i - 1] ? taxBrackets[i - 1].upperLimit + 1 : 0)
            } X ${taxBrackets[i].rate} = ${roundHalf(
                (taxBrackets[i].upperLimit -
                    (taxBrackets[i - 1] ? taxBrackets[i - 1].upperLimit + 1 : 0)) *
                taxBrackets[i].rate
            )}`
        );
    }
    if (income > taxBrackets[taxBrackets.length - 1].upperLimit + 1) {
        tax += (income - taxBrackets[taxBrackets.length - 1].upperLimit + 1) * 0.5;
        actions.push(
            `${income - taxBrackets[taxBrackets.length - 1].upperLimit + 1
            } X 0.5 = ${roundHalf(tax)}`
        );
    }
    if (credits && credits > 0) {
        actions.push(
            `${credits} X ${TAXES_2023.creditsValue} = ${roundHalf(
                credits * TAXES_2023.creditsValue
            )} (נקודות זיכוי)`,
            `${roundHalf(tax)} - ${roundHalf(
                credits * TAXES_2023.creditsValue
            )} = ${roundHalf(tax - credits * creditsValue)}`
        );
        tax = tax - credits * creditsValue;
        if (tax < 0) {
            tax = 0;
        }
    }
    return { tax: tax, actions: actions };
}