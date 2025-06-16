// Este ficheiro centraliza todos os dados iniciais, incluindo a versão da aplicação.

export const APP_VERSION = '0.0.2';

export const initialMuscleGroups = [
    { id: 1, name: 'Peito' }, 
    { id: 2, name: 'Costas' }, 
    { id: 3, name: 'Pernas' },
    { id: 4, name: 'Ombros' }, 
    { id: 5, name: 'Tríceps' }, 
    { id: 6, name: 'Bíceps' },
    { id: 7, name: 'Abdominais' },
    { id: 8, name: 'Glúteos' },
    { id: 9, name: 'Quadríceps' },
    { id: 10, name: 'Panturrilha' },
    { id: 11, name: 'Cardio' },
    { id: 12, name: 'Trapézio' }
];

export const initialExercises = [
  // Peito
  { id: 1, name: 'Supino máquina', muscleGroupId: 1, secondaryMuscleGroupIds: [4, 5] },
  { id: 2, name: 'Supino reto com halteres', muscleGroupId: 1, secondaryMuscleGroupIds: [4, 5] },
  { id: 3, name: 'Crucifixo com halteres', muscleGroupId: 1, secondaryMuscleGroupIds: [] },
  { id: 4, name: 'Crucifixo na máquina peck deck', muscleGroupId: 1, secondaryMuscleGroupIds: [] },
  { id: 5, name: 'Supino inclinado na máquina', muscleGroupId: 1, secondaryMuscleGroupIds: [4, 5] },
  { id: 6, name: 'Inclinado com halteres', muscleGroupId: 1, secondaryMuscleGroupIds: [4, 5] },
  { id: 7, name: 'Peck deck', muscleGroupId: 1, secondaryMuscleGroupIds: [] },
  { id: 8, name: 'Crossover na polia', muscleGroupId: 1, secondaryMuscleGroupIds: [] },
  
  // Tríceps
  { id: 9, name: 'Triceps corda no cross', muscleGroupId: 5, secondaryMuscleGroupIds: [] },
  { id: 10, name: 'Tríceps barra reta ou V', muscleGroupId: 5, secondaryMuscleGroupIds: [] },
  { id: 11, name: 'Triceps polia alta pegada inversa', muscleGroupId: 5, secondaryMuscleGroupIds: [] },
  { id: 12, name: 'Triceps testa na polia', muscleGroupId: 5, secondaryMuscleGroupIds: [] },

  // Costas
  { id: 13, name: 'Puxador frente', muscleGroupId: 2, secondaryMuscleGroupIds: [6] },
  { id: 14, name: 'Puxador articulado', muscleGroupId: 2, secondaryMuscleGroupIds: [6] },
  { id: 15, name: 'Remada baixa', muscleGroupId: 2, secondaryMuscleGroupIds: [6] },
  { id: 16, name: 'Remada na máquina', muscleGroupId: 2, secondaryMuscleGroupIds: [6] },
  { id: 17, name: 'Remada unilateral (serrote)', muscleGroupId: 2, secondaryMuscleGroupIds: [6] },
  { id: 18, name: 'Remada halteres no banco', muscleGroupId: 2, secondaryMuscleGroupIds: [6] },
  { id: 19, name: 'Remada aberta', muscleGroupId: 2, secondaryMuscleGroupIds: [4] },

  // Bíceps
  { id: 20, name: 'Rosca direta barra', muscleGroupId: 6, secondaryMuscleGroupIds: [] },
  { id: 21, name: 'Rosca alternada', muscleGroupId: 6, secondaryMuscleGroupIds: [] },
  { id: 22, name: 'Rosca martelo', muscleGroupId: 6, secondaryMuscleGroupIds: [] },
  { id: 23, name: 'Rosca concentrada', muscleGroupId: 6, secondaryMuscleGroupIds: [] },
  { id: 24, name: 'Rosca Scott máquina', muscleGroupId: 6, secondaryMuscleGroupIds: [] },

  // Pernas
  { id: 25, name: 'Cadeira extensora', muscleGroupId: 9, secondaryMuscleGroupIds: [] },
  { id: 26, name: 'Leg 45 com foco no quadriceps', muscleGroupId: 9, secondaryMuscleGroupIds: [8] },
  { id: 27, name: 'Cadeira flexora', muscleGroupId: 3, secondaryMuscleGroupIds: [8] },
  { id: 28, name: 'Stiff com halteres leve', muscleGroupId: 3, secondaryMuscleGroupIds: [8] },
  { id: 29, name: 'Leg press 45', muscleGroupId: 3, secondaryMuscleGroupIds: [9, 8] },
  { id: 30, name: 'Leg horizontal', muscleGroupId: 3, secondaryMuscleGroupIds: [9, 8] },
  { id: 31, name: 'Hack machine', muscleGroupId: 3, secondaryMuscleGroupIds: [9, 8] },
  { id: 32, name: 'Cadeira abdutora', muscleGroupId: 8, secondaryMuscleGroupIds: [] },
  { id: 33, name: 'Abdução com elástico', muscleGroupId: 8, secondaryMuscleGroupIds: [] },
  { id: 34, name: 'Panturrilha no leg press', muscleGroupId: 10, secondaryMuscleGroupIds: [] },
  { id: 35, name: 'Panturrilha em pé com halteres', muscleGroupId: 10, secondaryMuscleGroupIds: [] },
  { id: 36, name: 'Mesa flexora unilateral', muscleGroupId: 3, secondaryMuscleGroupIds: [] },
  { id: 37, name: 'Mesa flexora tradicional', muscleGroupId: 3, secondaryMuscleGroupIds: [] },
  { id: 38, name: 'Agachamento sumo com halteres', muscleGroupId: 3, secondaryMuscleGroupIds: [8, 9] },

  // Ombros
  { id: 39, name: 'Elevação lateral', muscleGroupId: 4, secondaryMuscleGroupIds: [] },
  { id: 40, name: 'Máquina de elevação lateral', muscleGroupId: 4, secondaryMuscleGroupIds: [] },
  { id: 41, name: 'Elevação frontal', muscleGroupId: 4, secondaryMuscleGroupIds: [] },
  { id: 42, name: 'Frontal com barra W', muscleGroupId: 4, secondaryMuscleGroupIds: [] },
  { id: 43, name: 'Desenvolvimento com halteres', muscleGroupId: 4, secondaryMuscleGroupIds: [5] },
  { id: 44, name: 'Desenvolvimento no Smith', muscleGroupId: 4, secondaryMuscleGroupIds: [5] },
  { id: 45, name: 'Encolhimento de ombros', muscleGroupId: 12, secondaryMuscleGroupIds: [] },
  { id: 46, name: 'Encolhimento barra guiada', muscleGroupId: 12, secondaryMuscleGroupIds: [] },
  { id: 47, name: 'Desenvolvimento máquina', muscleGroupId: 4, secondaryMuscleGroupIds: [5] },

  // Abdômen
  { id: 48, name: 'Abdominal infra banco declinado', muscleGroupId: 7, secondaryMuscleGroupIds: [] },
  { id: 49, name: 'Infra com peso no colchonete', muscleGroupId: 7, secondaryMuscleGroupIds: [] },
  { id: 50, name: 'Prancha isométrica', muscleGroupId: 7, secondaryMuscleGroupIds: [] },
  { id: 51, name: 'Prancha lateral', muscleGroupId: 7, secondaryMuscleGroupIds: [] },
  { id: 52, name: 'Prancha com apoio', muscleGroupId: 7, secondaryMuscleGroupIds: [] },

  // Cardio
  { id: 53, name: 'Bicicleta ergométrica', muscleGroupId: 11, secondaryMuscleGroupIds: [] },
  { id: 54, name: 'Caminhada inclinada na esteira', muscleGroupId: 11, secondaryMuscleGroupIds: [] },
];

export const initialWorkouts = [
  {
    id: 1, name: 'Segunda - Peito + Tríceps', lastCompleted: null,
    exercises: [
      { workoutExerciseId: 101, exerciseId: 1, sets: '4', reps: '10-12', substituteIds: [2] },
      { workoutExerciseId: 102, exerciseId: 3, sets: '4', reps: '12-15', substituteIds: [4] },
      { workoutExerciseId: 103, exerciseId: 5, sets: '4', reps: '10', substituteIds: [6] },
      { workoutExerciseId: 104, exerciseId: 9, sets: '4', reps: '12-15', substituteIds: [10] },
      { workoutExerciseId: 105, exerciseId: 11, sets: '3', reps: '12', substituteIds: [12] },
      { workoutExerciseId: 106, exerciseId: 7, sets: '4', reps: '15', substituteIds: [8] },
    ]
  },
  {
    id: 2, name: 'Terça - Costas + Bíceps', lastCompleted: null,
    exercises: [
      { workoutExerciseId: 201, exerciseId: 13, sets: '4', reps: '10-12', substituteIds: [14] },
      { workoutExerciseId: 202, exerciseId: 15, sets: '4', reps: '12', substituteIds: [16] },
      { workoutExerciseId: 203, exerciseId: 17, sets: '4', reps: '10', substituteIds: [18] },
      { workoutExerciseId: 204, exerciseId: 20, sets: '3', reps: '12', substituteIds: [21, 22] },
      { workoutExerciseId: 205, exerciseId: 21, sets: '3', reps: '12', substituteIds: [23] },
      { workoutExerciseId: 206, exerciseId: 23, sets: '3', reps: '10', substituteIds: [24] },
    ]
  },
  {
    id: 3, name: 'Quarta - Pernas (sem impacto)', lastCompleted: null,
    exercises: [
      { workoutExerciseId: 301, exerciseId: 25, sets: '4', reps: '12', substituteIds: [26] },
      { workoutExerciseId: 302, exerciseId: 27, sets: '4', reps: '12', substituteIds: [28] },
      { workoutExerciseId: 303, exerciseId: 29, sets: '4', reps: '10-12', substituteIds: [30, 31] },
      { workoutExerciseId: 304, exerciseId: 32, sets: '4', reps: '15', substituteIds: [33] },
      { workoutExerciseId: 305, exerciseId: 34, sets: '4', reps: '15-20', substituteIds: [35] },
      { workoutExerciseId: 306, exerciseId: 36, sets: '3', reps: '12', substituteIds: [37] },
    ]
  },
  {
    id: 4, name: 'Quinta - Ombros + Abdômen', lastCompleted: null,
    exercises: [
      { workoutExerciseId: 401, exerciseId: 39, sets: '4', reps: '15', substituteIds: [40] },
      { workoutExerciseId: 402, exerciseId: 41, sets: '3', reps: '12', substituteIds: [42] },
      { workoutExerciseId: 403, exerciseId: 43, sets: '4', reps: '10-12', substituteIds: [44] },
      { workoutExerciseId: 404, exerciseId: 45, sets: '3', reps: '15', substituteIds: [46] },
      { workoutExerciseId: 405, exerciseId: 48, sets: '4', reps: '15', substituteIds: [49] },
      { workoutExerciseId: 406, exerciseId: 50, sets: '3', reps: '30-40s', substituteIds: [51] },
    ]
  },
  {
    id: 5, name: 'Sexta - Full Body + Cardio', lastCompleted: null,
    exercises: [
      { workoutExerciseId: 501, exerciseId: 1, sets: '3', reps: '12', substituteIds: [2] },
      { workoutExerciseId: 502, exerciseId: 13, sets: '3', reps: '12', substituteIds: [19] },
      { workoutExerciseId: 503, exerciseId: 29, sets: '3', reps: '12', substituteIds: [38] },
      { workoutExerciseId: 504, exerciseId: 39, sets: '3', reps: '15', substituteIds: [47] },
      { workoutExerciseId: 505, exerciseId: 50, sets: '3', reps: '30-40s', substituteIds: [52] },
      { workoutExerciseId: 506, exerciseId: 53, sets: '1', reps: '10-15 min', substituteIds: [54] },
    ]
  },
];

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