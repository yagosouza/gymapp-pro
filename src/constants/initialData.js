// --- Modelos de Dados Iniciais ---
export const initialMuscleGroups = [
    { id: 1, name: 'Peito' }, { id: 2, name: 'Costas' }, { id: 3, name: 'Pernas' },
    { id: 4, name: 'Ombros' }, { id: 5, name: 'Tríceps' }, { id: 6, name: 'Bíceps' },
    { id: 7, name: 'Abdominais' }
];
export const initialExercises = [
  { id: 1, name: 'Supino Reto', muscleGroupId: 1, secondaryMuscleGroupIds: [4, 5], suggestedSets: '4', suggestedReps: '10', suggestedWeight: '60', videoUrl: 'https://www.youtube.com/watch?v=rT7gLneLSvY', imageUrl: 'https://placehold.co/600x400/27272a/FFFFFF?text=M%C3%BAsculos' },
  { id: 2, name: 'Agachamento Livre', muscleGroupId: 3, secondaryMuscleGroupIds: [], suggestedSets: '5', suggestedReps: '8', suggestedWeight: '80', videoUrl: '', imageUrl: '' },
  { id: 3, name: 'Remada Curvada', muscleGroupId: 2, secondaryMuscleGroupIds: [6], suggestedSets: '4', suggestedReps: '12', suggestedWeight: '50', videoUrl: 'https://youtu.be/l1hZg8b66pA', imageUrl: '' },
];
export const initialWorkouts = [{ 
    id: 1, name: 'Treino V - Peito e Tríceps', lastCompleted: null,
    exercises: [{ workoutExerciseId: 1, exerciseId: 1, sets: '4', reps: '10', weight: '60', notes: 'Focar na fase excêntrica' }] 
}];
export const initialProfile = { 
    name: 'Admin', height: '180', age: '30', gender: 'male',
    measurementHistory: [
        { 
            date: '2025-06-10', weight: '80', 
            shoulder: '120', chest: '105', waist: '85', abdomen: '88', hip: '100', 
            calfR: '40', calfL: '40', thighR: '60', thighL: '60',
            armRelaxedR: '36', armRelaxedL: '36', armContractedR: '38', armContractedL: '38',
            skinfoldTriceps: '10', skinfoldAxillary: '12', skinfoldChest: '12', skinfoldAbdominal: '20', 
            skinfoldSuprailiac: '12', skinfoldSubscapular: '15', skinfoldThigh: '15'
        }
    ]
};
export const initialHistory = [];