// --- Funções de Cálculo ---
export const calculateBMI = (weight, height) => {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters));
};

export const calculateBodyFat = (skinfolds, age, gender = 'male') => {
    // Jackson/Pollock 7-Site Formula.
    const { skinfoldTriceps, skinfoldAxillary, skinfoldChest, skinfoldAbdominal, skinfoldSuprailiac, skinfoldSubscapular, skinfoldThigh } = skinfolds;
    if (!skinfoldTriceps || !skinfoldAxillary || !skinfoldChest || !skinfoldAbdominal || !skinfoldSuprailiac || !skinfoldSubscapular || !skinfoldThigh || !age) return 0;
    const sumOfSkinfolds = [skinfoldTriceps, skinfoldAxillary, skinfoldChest, skinfoldAbdominal, skinfoldSuprailiac, skinfoldSubscapular, skinfoldThigh].reduce((sum, current) => sum + parseFloat(current || 0), 0);
    let bodyDensity;
    if (gender === 'male') {
        bodyDensity = 1.112 - (0.00043499 * sumOfSkinfolds) + (0.00000055 * sumOfSkinfolds * sumOfSkinfolds) - (0.00028826 * age);
    } else { // Formula for Women
        bodyDensity = 1.097 - (0.00046971 * sumOfSkinfolds) + (0.00000056 * sumOfSkinfolds * sumOfSkinfolds) - (0.00012828 * age);
    }
    if (bodyDensity <= 0) return 0;
    const bodyFatPercentage = (495 / bodyDensity) - 450;
    return bodyFatPercentage > 0 ? bodyFatPercentage : 0;
};