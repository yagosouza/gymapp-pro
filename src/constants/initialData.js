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
  { id: 1, name: 'Supino máquina', muscleGroupId: 1, secondaryMuscleGroupIds: [4, 5], videoUrl: 'http://www.youtube.com/watch?v=M4Iagnqx4cg', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/13120010679226307365' },
  { id: 2, name: 'Supino reto com halteres', muscleGroupId: 1, secondaryMuscleGroupIds: [4, 5], videoUrl: 'http://www.youtube.com/watch?v=NzefUogE_Bs', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/13120010679226307365' },
  { id: 3, name: 'Crucifixo com halteres', muscleGroupId: 1, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=NB_1mCfIOLU', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/13120010679226307365' },
  { id: 4, name: 'Crucifixo na máquina peck deck', muscleGroupId: 1, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=FzCnfD0gOXo', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/13120010679226307365' },
  { id: 5, name: 'Supino inclinado na máquina', muscleGroupId: 1, secondaryMuscleGroupIds: [4, 5], videoUrl: 'http://www.youtube.com/watch?v=KK5ZSj22h7s', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/13120010679226307365' },
  { id: 6, name: 'Inclinado com halteres', muscleGroupId: 1, secondaryMuscleGroupIds: [4, 5], videoUrl: 'http://www.youtube.com/watch?v=hV21YJFt6MI', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/13120010679226307365' },
  { id: 7, name: 'Peck deck', muscleGroupId: 1, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=FzCnfD0gOXo', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/13120010679226307365' },
  { id: 8, name: 'Crossover na polia', muscleGroupId: 1, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=jqTlJt3JXzQ', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/13120010679226307365' },
  
  // Tríceps
  { id: 9, name: 'Triceps corda no cross', muscleGroupId: 5, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=-QGC1cL6ETE', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/2430933856201799878' },
  { id: 10, name: 'Tríceps barra reta ou V', muscleGroupId: 5, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=-QGC1cL6ETE', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/2430933856201799878' },
  { id: 11, name: 'Triceps polia alta pegada inversa', muscleGroupId: 5, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=-QGC1cL6ETE', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/2430933856201799878' },
  { id: 12, name: 'Triceps testa na polia', muscleGroupId: 5, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=sb7dx0Ob9Ig', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/2430933856201799878' },

  // Costas
  { id: 13, name: 'Puxador frente', muscleGroupId: 2, secondaryMuscleGroupIds: [6], videoUrl: 'http://www.youtube.com/watch?v=t9TfOQEQaCg', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/9872716453208492167' },
  { id: 14, name: 'Puxador articulado', muscleGroupId: 2, secondaryMuscleGroupIds: [6], videoUrl: 'http://www.youtube.com/watch?v=t9TfOQEQaCg', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/9872716453208492167' },
  { id: 15, name: 'Remada baixa', muscleGroupId: 2, secondaryMuscleGroupIds: [6], videoUrl: 'http://www.youtube.com/watch?v=f8AVh4VBbos', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/9872716453208492167' },
  { id: 16, name: 'Remada na máquina', muscleGroupId: 2, secondaryMuscleGroupIds: [6], videoUrl: 'http://www.youtube.com/watch?v=f8AVh4VBbos', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/9872716453208492167' },
  { id: 17, name: 'Remada unilateral (serrote)', muscleGroupId: 2, secondaryMuscleGroupIds: [6], videoUrl: 'http://www.youtube.com/watch?v=L2FuijYFTvE', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/9872716453208492167' },
  { id: 18, name: 'Remada halteres no banco', muscleGroupId: 2, secondaryMuscleGroupIds: [6], videoUrl: 'http://www.youtube.com/watch?v=L2FuijYFTvE', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/9872716453208492167' },
  { id: 19, name: 'Remada aberta', muscleGroupId: 2, secondaryMuscleGroupIds: [4], videoUrl: 'http://www.youtube.com/watch?v=f8AVh4VBbos', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/9872716453208492167' },

  // Bíceps
  { id: 20, name: 'Rosca direta barra', muscleGroupId: 6, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=UZCzZJ0_2jg', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/14247208501718600006' },
  { id: 21, name: 'Rosca alternada', muscleGroupId: 6, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=UZCzZJ0_2jg', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/14247208501718600006' },
  { id: 22, name: 'Rosca martelo', muscleGroupId: 6, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=0rRpv6o140o', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/14247208501718600006' },
  { id: 23, name: 'Rosca concentrada', muscleGroupId: 6, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=UZCzZJ0_2jg', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/14247208501718600006' },
  { id: 24, name: 'Rosca Scott máquina', muscleGroupId: 6, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=90_d-DsrOkE', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/14247208501718600006' },

  // Pernas
  { id: 25, name: 'Cadeira extensora', muscleGroupId: 9, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=PzIfB9MiiX8', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/7465570156886351076' },
  { id: 26, name: 'Leg 45 com foco no quadriceps', muscleGroupId: 9, secondaryMuscleGroupIds: [8], videoUrl: 'http://www.youtube.com/watch?v=PzIfB9MiiX8', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/7465570156886351076' },
  { id: 27, name: 'Cadeira flexora', muscleGroupId: 3, secondaryMuscleGroupIds: [8], videoUrl: 'http://www.youtube.com/watch?v=T46yKiz8laY', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/4832908170880173577' },
  { id: 28, name: 'Stiff com halteres leve', muscleGroupId: 3, secondaryMuscleGroupIds: [8], videoUrl: 'http://www.youtube.com/watch?v=T46yKiz8laY', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/4832908170880173577' },
  { id: 29, name: 'Leg press 45', muscleGroupId: 3, secondaryMuscleGroupIds: [9, 8], videoUrl: 'http://www.youtube.com/watch?v=PzIfB9MiiX8', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/4832908170880173577' },
  { id: 30, name: 'Leg horizontal', muscleGroupId: 3, secondaryMuscleGroupIds: [9, 8], videoUrl: 'http://www.youtube.com/watch?v=PzIfB9MiiX8', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/4832908170880173577' },
  { id: 31, name: 'Hack machine', muscleGroupId: 3, secondaryMuscleGroupIds: [9, 8], videoUrl: 'http://www.youtube.com/watch?v=PzIfB9MiiX8', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/4832908170880173577' },
  { id: 32, name: 'Cadeira abdutora', muscleGroupId: 8, secondaryMuscleGroupIds: [], videoUrl: null, imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/16435694418139950976' },
  { id: 33, name: 'Abdução com elástico', muscleGroupId: 8, secondaryMuscleGroupIds: [], videoUrl: null, imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/16435694418139950976' },
  { id: 34, name: 'Panturrilha no leg press', muscleGroupId: 10, secondaryMuscleGroupIds: [], videoUrl: null, imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/5809784731188490790' },
  { id: 35, name: 'Panturrilha em pé com halteres', muscleGroupId: 10, secondaryMuscleGroupIds: [], videoUrl: null, imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/5809784731188490790' },
  { id: 36, name: 'Mesa flexora unilateral', muscleGroupId: 3, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=T46yKiz8laY', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/4832908170880173577' },
  { id: 37, name: 'Mesa flexora tradicional', muscleGroupId: 3, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=T46yKiz8laY', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/4832908170880173577' },
  { id: 38, name: 'Agachamento sumo com halteres', muscleGroupId: 3, secondaryMuscleGroupIds: [8, 9], videoUrl: 'http://www.youtube.com/watch?v=mOtY705EJYg', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/4832908170880173577' },

  // Ombros
  { id: 39, name: 'Elevação lateral', muscleGroupId: 4, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=ORparUDksUk', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/6418618829079856541' },
  { id: 40, name: 'Máquina de elevação lateral', muscleGroupId: 4, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=ORparUDksUk', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/6418618829079856541' },
  { id: 41, name: 'Elevação frontal', muscleGroupId: 4, secondaryMuscleGroupIds: [], videoUrl: null, imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/6418618829079856541' },
  { id: 42, name: 'Frontal com barra W', muscleGroupId: 4, secondaryMuscleGroupIds: [], videoUrl: null, imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/6418618829079856541' },
  { id: 43, name: 'Desenvolvimento com halteres', muscleGroupId: 4, secondaryMuscleGroupIds: [5], videoUrl: 'http://www.youtube.com/watch?v=5I7ogOjvdnc', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/6418618829079856541' },
  { id: 44, name: 'Desenvolvimento no Smith', muscleGroupId: 4, secondaryMuscleGroupIds: [5], videoUrl: 'http://www.youtube.com/watch?v=5I7ogOjvdnc', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/6418618829079856541' },
  { id: 45, name: 'Encolhimento de ombros', muscleGroupId: 12, secondaryMuscleGroupIds: [], videoUrl: null, imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/8373384523484660012' },
  { id: 46, name: 'Encolhimento barra guiada', muscleGroupId: 12, secondaryMuscleGroupIds: [], videoUrl: null, imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/8373384523484660012' },
  { id: 47, name: 'Desenvolvimento máquina', muscleGroupId: 4, secondaryMuscleGroupIds: [5], videoUrl: 'http://www.youtube.com/watch?v=5I7ogOjvdnc', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/6418618829079856541' },

  // Abdômen
  { id: 48, name: 'Abdominal infra banco declinado', muscleGroupId: 7, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=uxPlAbWFUDs', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/16077029164707962356' },
  { id: 49, name: 'Infra com peso no colchonete', muscleGroupId: 7, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=uxPlAbWFUDs', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/16077029164707962356' },
  { id: 50, name: 'Prancha isométrica', muscleGroupId: 7, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=uxPlAbWFUDs', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/16077029164707962356' },
  { id: 51, name: 'Prancha lateral', muscleGroupId: 7, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=uxPlAbWFUDs', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/16077029164707962356' },
  { id: 52, name: 'Prancha com apoio', muscleGroupId: 7, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=uxPlAbWFUDs', imageUrl: 'http://googleusercontent.com/image_collection/image_retrieval/16077029164707962356' },

  // Cardio
  { id: 53, name: 'Bicicleta ergométrica', muscleGroupId: 11, secondaryMuscleGroupIds: [], videoUrl: 'http://www.youtube.com/watch?v=aRLSSGyrkFw', imageUrl: null },
  { id: 54, name: 'Caminhada inclinada na esteira', muscleGroupId: 11, secondaryMuscleGroupIds: [], videoUrl: null, imageUrl: null },
];

export const initialWorkouts = [
  {
    id: 1, name: 'A - Peito + Tríceps', lastCompleted: '2025-06-09T12:05:41.308Z',
    exercises: [
      { workoutExerciseId: 101, exerciseId: 1, sets: '4', reps: '12', rest: '60', substituteIds: [2] },
      { workoutExerciseId: 102, exerciseId: 3, sets: '4', reps: '15', rest: '60', substituteIds: [4] },
      { workoutExerciseId: 103, exerciseId: 5, sets: '4', reps: '10', rest: '60', substituteIds: [6] },
      { workoutExerciseId: 104, exerciseId: 9, sets: '4', reps: '15', rest: '60', substituteIds: [10] },
      { workoutExerciseId: 105, exerciseId: 11, sets: '3', reps: '12', rest: '60', substituteIds: [12] },
      { workoutExerciseId: 106, exerciseId: 7, sets: '4', reps: '15', rest: '60', substituteIds: [8] },
    ]
  },
  {
    id: 2, name: 'B - Costas + Bíceps', lastCompleted: '2025-06-10T12:05:41.308Z',
    exercises: [
      { workoutExerciseId: 201, exerciseId: 13, sets: '4', reps: '12', rest: '60', substituteIds: [14] },
      { workoutExerciseId: 202, exerciseId: 15, sets: '4', reps: '12', rest: '60', substituteIds: [16] },
      { workoutExerciseId: 203, exerciseId: 17, sets: '4', reps: '10', rest: '60', substituteIds: [18] },
      { workoutExerciseId: 204, exerciseId: 20, sets: '3', reps: '12', rest: '60', substituteIds: [21, 22] },
      { workoutExerciseId: 205, exerciseId: 21, sets: '3', reps: '12', rest: '60', substituteIds: [23] },
      { workoutExerciseId: 206, exerciseId: 23, sets: '3', reps: '10', rest: '60', substituteIds: [24] },
    ]
  },
  {
    id: 3, name: 'C - Pernas (sem impacto)', lastCompleted: '2025-06-11T12:05:41.308Z',
    exercises: [
      { workoutExerciseId: 301, exerciseId: 25, sets: '4', reps: '12', rest: '60', substituteIds: [26] },
      { workoutExerciseId: 302, exerciseId: 27, sets: '4', reps: '12', rest: '60', substituteIds: [28] },
      { workoutExerciseId: 303, exerciseId: 29, sets: '4', reps: '12', rest: '60', substituteIds: [30, 31] },
      { workoutExerciseId: 304, exerciseId: 32, sets: '4', reps: '15', rest: '60', substituteIds: [33] },
      { workoutExerciseId: 305, exerciseId: 34, sets: '4', reps: '20', rest: '60', substituteIds: [35] },
      { workoutExerciseId: 306, exerciseId: 36, sets: '3', reps: '12', rest: '60', substituteIds: [37] },
    ]
  },
  {
    id: 4, name: 'D - Ombros + Abdômen', lastCompleted: '2025-06-12T12:05:41.308Z',
    exercises: [
      { workoutExerciseId: 401, exerciseId: 39, sets: '4', reps: '15', rest: '60', substituteIds: [40] },
      { workoutExerciseId: 402, exerciseId: 41, sets: '3', reps: '12', rest: '60', substituteIds: [42] },
      { workoutExerciseId: 403, exerciseId: 43, sets: '4', reps: '12', rest: '60', substituteIds: [44] },
      { workoutExerciseId: 404, exerciseId: 45, sets: '3', reps: '15', rest: '60', substituteIds: [46] },
      { workoutExerciseId: 405, exerciseId: 48, sets: '4', reps: '15', rest: '60', substituteIds: [49] },
      { workoutExerciseId: 406, exerciseId: 50, sets: '3', reps: '40', rest: '60', substituteIds: [51] },
    ]
  },
  {
    id: 5, name: 'E - Full Body + Cardio', lastCompleted: null,
    exercises: [
      { workoutExerciseId: 501, exerciseId: 1, sets: '3', reps: '12', rest: '60', substituteIds: [2] },
      { workoutExerciseId: 502, exerciseId: 13, sets: '3', reps: '12', rest: '60', substituteIds: [19] },
      { workoutExerciseId: 503, exerciseId: 29, sets: '3', reps: '12', rest: '60', substituteIds: [38] },
      { workoutExerciseId: 504, exerciseId: 39, sets: '3', reps: '15', rest: '60', substituteIds: [47] },
      { workoutExerciseId: 505, exerciseId: 50, sets: '3', reps: '40', rest: '60', substituteIds: [52] },
      { workoutExerciseId: 506, exerciseId: 53, sets: '1', reps: '15', rest: '0', substituteIds: [54] },
    ]
  },
];

export const initialProfile = { 
    name: 'Yago Souza', // 
    height: '170',     // 
    // As informações de idade e gênero não estavam no relatório, por isso foram omitidas.
    measurementHistory: [
        { 
            // Avaliação de 12/10/2024
            date: '2024-10-12',
            weight: '86.10', // 
            shoulder: '122.00', // 
            chest: '109.00', // 
            waist: '94.00', // 
            abdomen: '100.50', // 
            hip: '103.00', // 
            calfR: '38.00', // 
            calfL: '38.00', // 
            thighR: '57.00', // 
            thighL: '56.50', // 
            armRelaxedR: '37.00', // 
            armRelaxedL: '36.50', // 
            armContractedR: '38.50', // 
            armContractedL: '39.00', // 
            skinfoldTriceps: '17.30', // 
            skinfoldAxillary: '19.70', // 
            skinfoldChest: '25.10', // 
            skinfoldAbdominal: '49.10', // 
            skinfoldSuprailiac: '33.40', // 
            skinfoldSubscapular: '23.20', // 
            skinfoldThigh: '25.00' // 
        },
        { 
            // Avaliação de 19/11/2024
            date: '2024-11-19',
            weight: '83.00', // 
            shoulder: '118.50', // 
            chest: '106.00', // 
            waist: '91.50', // 
            abdomen: '95.00', // 
            hip: '102.00', // 
            calfR: '38.00', // 
            calfL: '38.00', // 
            thighR: '57.00', // 
            thighL: '57.00', // 
            armRelaxedR: '37.50', // 
            armRelaxedL: '39.00', // 
            armContractedR: '37.00', // 
            armContractedL: '38.50', // 
            skinfoldTriceps: '15.90', // 
            skinfoldAxillary: '18.20', // 
            skinfoldChest: '20.30', // 
            skinfoldAbdominal: '42.40', // 
            skinfoldSuprailiac: '23.10', // 
            skinfoldSubscapular: '18.80', // 
            skinfoldThigh: '22.60' // 
        }
    ]
};

export const initialHistory = [];