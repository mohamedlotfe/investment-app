import { SUPPORTED_CURRENCIES } from '../constants/currency.constants';

export class ValidatorUtil {
  static isValidCurrency(currency: string): boolean {
    return SUPPORTED_CURRENCIES.includes(currency.toUpperCase());
  }

  static isValidAmount(amount: number): boolean {
    return amount > 0;
  }

  static isValidDate(date: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return false;
    }
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }
}
