import { calculateBMI, calculateBodyFat } from '../calculations';

describe('calculateBMI', () => {
    it('retorna 0 quando weight é falso', () => {
        expect(calculateBMI(0, 175)).toBe(0);
        expect(calculateBMI(null, 175)).toBe(0);
        expect(calculateBMI(undefined, 175)).toBe(0);
    });

    it('retorna 0 quando height é falso', () => {
        expect(calculateBMI(70, 0)).toBe(0);
        expect(calculateBMI(70, null)).toBe(0);
        expect(calculateBMI(70, undefined)).toBe(0);
    });

    it('calcula o IMC corretamente', () => {
        // 70 / (1.75 * 1.75) = 22.857...
        const result = calculateBMI(70, 175);
        expect(result).toBeCloseTo(22.86, 1);
    });

    it('calcula IMC para sobrepeso', () => {
        // 90 / (1.75 * 1.75) = 29.387...
        const result = calculateBMI(90, 175);
        expect(result).toBeCloseTo(29.39, 1);
    });
});

describe('calculateBodyFat', () => {
    const maleSkinfolds = {
        skinfoldTriceps: 10,
        skinfoldAxillary: 12,
        skinfoldChest: 8,
        skinfoldAbdominal: 20,
        skinfoldSuprailiac: 15,
        skinfoldSubscapular: 14,
        skinfoldThigh: 18,
    };

    const femaleSkinfolds = { ...maleSkinfolds };

    it('retorna 0 quando qualquer dobra cutânea está ausente', () => {
        const incomplete = { ...maleSkinfolds, skinfoldTriceps: undefined };
        expect(calculateBodyFat(incomplete, 30, 'male')).toBe(0);
    });

    it('retorna 0 quando age está ausente', () => {
        expect(calculateBodyFat(maleSkinfolds, 0, 'male')).toBe(0);
        expect(calculateBodyFat(maleSkinfolds, null, 'male')).toBe(0);
    });

    it('calcula percentual de gordura masculino corretamente', () => {
        const result = calculateBodyFat(maleSkinfolds, 30, 'male');
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(50);
    });

    it('calcula percentual de gordura feminino corretamente', () => {
        const result = calculateBodyFat(femaleSkinfolds, 30, 'female');
        expect(result).toBeGreaterThan(0);
        expect(result).toBeLessThan(60);
    });

    it('usa fórmula masculina por padrão', () => {
        const resultDefault = calculateBodyFat(maleSkinfolds, 30);
        const resultMale = calculateBodyFat(maleSkinfolds, 30, 'male');
        expect(resultDefault).toBe(resultMale);
    });

    it('retorna 0 quando bodyDensity é <= 0', () => {
        // Valores extremos para forçar bodyDensity inválido
        const extremeSkinfolds = {
            skinfoldTriceps: 9999,
            skinfoldAxillary: 9999,
            skinfoldChest: 9999,
            skinfoldAbdominal: 9999,
            skinfoldSuprailiac: 9999,
            skinfoldSubscapular: 9999,
            skinfoldThigh: 9999,
        };
        expect(calculateBodyFat(extremeSkinfolds, 30, 'male')).toBe(0);
    });
});
