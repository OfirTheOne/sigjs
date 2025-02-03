
import { describe, it, expect } from 'vitest'
import { extractValue } from './extract-value';

describe('extractValue', () => {
    const obj = {
        user: {
            address: {
                houseNumber: 123,
                street: 'Main St'
            },
            name: 'John Doe'
        }
    };

    it('should extract value using keys', () => {
        expect(extractValue(['user', 'address', 'houseNumber'], obj)).toBe(123);
        expect(extractValue(['user', 'name'], obj)).toBe('John Doe');
    });

    it('should extract value using selectors', () => {
        expect(extractValue(['user', (user) => user.address, 'houseNumber'], obj)).toBe(123);
        expect(extractValue(['user', (user) => user.name], obj)).toBe('John Doe');
    });

    it('should extract value using mixed keys and selectors', () => {
        expect(extractValue(['user', (user) => user.address, (address) => address.houseNumber], obj)).toBe(123);
        expect(extractValue(['user', (user) => user.address, 'street'], obj)).toBe('Main St');
    });

    it('should return undefined for non-existing keys', () => {
        expect(extractValue(['user', 'nonExistingKey'], obj)).toBeUndefined();
        expect(extractValue(['nonExistingKey'], obj)).toBeUndefined();
    });

    it('should return undefined for non-existing selectors', () => {
        expect(extractValue(['user', (user) => user.nonExistingKey], obj)).toBeUndefined();
    });
});