/**
 * Validates given type.
 */
export class DbObjectFieldValidator {
    private static supportedTypes = ['string', 'number', 'boolean', 'date'];

    static isTypeSupported(type: string) {
        return this.supportedTypes.indexOf(type) !== -1;
    }

    static validateArray(array: any[], type: string|Function): boolean {
        return array.filter(item => this.validate(item, type)).length === 0;
    }

    static validate(value: any, type: string|Function): boolean {
        let foundTypeToCheckIndex = this.supportedTypes.indexOf(<string> type);
        return typeof value === this.supportedTypes[foundTypeToCheckIndex] ||
            (type === 'date' && value instanceof Date);
    }

    // private static

}