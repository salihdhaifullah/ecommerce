import { IRate } from "../types/rate";

export default function ProcessRates (rates: IRate[]): number  {
    let ratesValue: number = 0;

    const ratesLength = rates.length;
    for (const rate of rates) {
        const num = Number(rate.rate.split("r")[1]);
        ratesValue += num;
    }
    const roundedRates = Math.round(ratesValue / ratesLength);
    return roundedRates;
}