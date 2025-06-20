// Este ficheiro centraliza todos os dados iniciais, incluindo a versão da aplicação.

export const APP_VERSION = '1.0.0';

export const initialData = {
  profile: {
    name: "",
    gender: "male",
    birthDate: "2000-01-01",
    initialWeight: 0,
    currentWeight: 0,
    height: 0,
    goal: "hypertrophy",
    measurementHistory: [],
    homeShortcuts: ["workouts", "exercises", "frequency", "profile"],
  },
  muscleGroups: [
    { name: "Peito" },
    { name: "Costas" },
    { name: "Ombros" },
    { name: "Pernas (Quadríceps)" },
    { name: "Pernas (Posterior)" },
    { name: "Glúteos" },
    { name: "Panturrilhas" },
    { name: "Bíceps" },
    { name: "Tríceps" },
    { name: "Antebraço" },
    { name: "Abdômen" },
    { name: "Lombar" },
    { name: "Trapézio" },
  ],
  exercises: [
    // --- Peito ---
    { name: "Supino Reto com Barra", muscleGroupName: "Peito", secondaryMuscleGroupNames: ["Ombros", "Tríceps"], suggestedSets: "4", suggestedReps: "12", suggestedRest: "60" },
    { name: "Supino Inclinado com Halteres", muscleGroupName: "Peito", secondaryMuscleGroupNames: ["Ombros", "Tríceps"], suggestedSets: "4", suggestedReps: "12", suggestedRest: "60" },
    { name: "Supino Declinado com Barra", muscleGroupName: "Peito", secondaryMuscleGroupNames: ["Tríceps"], suggestedSets: "3", suggestedReps: "12", suggestedRest: "60" },
    { name: "Crucifixo Reto com Halteres", muscleGroupName: "Peito", secondaryMuscleGroupNames: ["Ombros"], suggestedSets: "3", suggestedReps: "15", suggestedRest: "45" },
    { name: "Peck Deck (Voador)", muscleGroupName: "Peito", secondaryMuscleGroupNames: [], suggestedSets: "4", suggestedReps: "15", suggestedRest: "45" },
    { name: "Crossover na Polia Alta", muscleGroupName: "Peito", secondaryMuscleGroupNames: [], suggestedSets: "4", suggestedReps: "15", suggestedRest: "45" },
    { name: "Flexão de Braço", muscleGroupName: "Peito", secondaryMuscleGroupNames: ["Ombros", "Tríceps"], suggestedSets: "4", suggestedReps: "20", suggestedRest: "60" },

    // --- Costas ---
    { name: "Puxada Frontal na Polia Alta", muscleGroupName: "Costas", secondaryMuscleGroupNames: ["Bíceps"], suggestedSets: "4", suggestedReps: "12", suggestedRest: "60" },
    { name: "Remada Curvada com Barra", muscleGroupName: "Costas", secondaryMuscleGroupNames: ["Bíceps", "Lombar"], suggestedSets: "4", suggestedReps: "12", suggestedRest: "60" },
    { name: "Remada Cavalinho", muscleGroupName: "Costas", secondaryMuscleGroupNames: ["Bíceps", "Lombar"], suggestedSets: "4", suggestedReps: "12", suggestedRest: "60" },
    { name: "Barra Fixa (Puxada Alta)", muscleGroupName: "Costas", secondaryMuscleGroupNames: ["Bíceps", "Antebraço"], suggestedSets: "4", suggestedReps: "12", suggestedRest: "90" },
    { name: "Serrote com Halter (Remada Unilateral)", muscleGroupName: "Costas", secondaryMuscleGroupNames: ["Bíceps"], suggestedSets: "3", suggestedReps: "12", suggestedRest: "60" },
    { name: "Pulldown na Polia", muscleGroupName: "Costas", secondaryMuscleGroupNames: [], suggestedSets: "3", suggestedReps: "15", suggestedRest: "45" },

    // --- Pernas (Quadríceps) ---
    { name: "Agachamento Livre com Barra", muscleGroupName: "Pernas (Quadríceps)", secondaryMuscleGroupNames: ["Glúteos", "Pernas (Posterior)", "Lombar"], suggestedSets: "4", suggestedReps: "12", suggestedRest: "90" },
    { name: "Leg Press 45°", muscleGroupName: "Pernas (Quadríceps)", secondaryMuscleGroupNames: ["Glúteos", "Pernas (Posterior)"], suggestedSets: "4", suggestedReps: "15", suggestedRest: "60" },
    { name: "Cadeira Extensora", muscleGroupName: "Pernas (Quadríceps)", secondaryMuscleGroupNames: [], suggestedSets: "4", suggestedReps: "15", suggestedRest: "45" },
    { name: "Afundo com Halteres", muscleGroupName: "Pernas (Quadríceps)", secondaryMuscleGroupNames: ["Glúteos"], suggestedSets: "3", suggestedReps: "12", suggestedRest: "60" },
    { name: "Agachamento Hack", muscleGroupName: "Pernas (Quadríceps)", secondaryMuscleGroupNames: ["Glúteos"], suggestedSets: "4", suggestedReps: "12", suggestedRest: "60" },
    
    // --- Pernas (Posterior) ---
    { name: "Mesa Flexora", muscleGroupName: "Pernas (Posterior)", secondaryMuscleGroupNames: ["Panturrilhas"], suggestedSets: "4", suggestedReps: "15", suggestedRest: "45" },
    { name: "Cadeira Flexora", muscleGroupName: "Pernas (Posterior)", secondaryMuscleGroupNames: [], suggestedSets: "4", suggestedReps: "15", suggestedRest: "45" },
    { name: "Stiff com Barra", muscleGroupName: "Pernas (Posterior)", secondaryMuscleGroupNames: ["Glúteos", "Lombar"], suggestedSets: "4", suggestedReps: "12", suggestedRest: "60" },

    // --- Glúteos ---
    { name: "Elevação Pélvica com Barra", muscleGroupName: "Glúteos", secondaryMuscleGroupNames: ["Pernas (Posterior)", "Lombar"], suggestedSets: "4", suggestedReps: "15", suggestedRest: "60" },
    { name: "Agachamento Búlgaro", muscleGroupName: "Glúteos", secondaryMuscleGroupNames: ["Pernas (Quadríceps)"], suggestedSets: "3", suggestedReps: "12", suggestedRest: "60" },
    { name: "Cadeira Abdutora", muscleGroupName: "Glúteos", secondaryMuscleGroupNames: [], suggestedSets: "4", suggestedReps: "20", suggestedRest: "45" },
    { name: "Coice na Polia", muscleGroupName: "Glúteos", secondaryMuscleGroupNames: [], suggestedSets: "4", suggestedReps: "15", suggestedRest: "45" },

    // --- Ombros ---
    { name: "Desenvolvimento Militar com Barra", muscleGroupName: "Ombros", secondaryMuscleGroupNames: ["Tríceps"], suggestedSets: "4", suggestedReps: "12", suggestedRest: "60" },
    { name: "Elevação Lateral com Halteres", muscleGroupName: "Ombros", secondaryMuscleGroupNames: ["Trapézio"], suggestedSets: "4", suggestedReps: "15", suggestedRest: "45" },
    { name: "Elevação Frontal com Halteres", muscleGroupName: "Ombros", secondaryMuscleGroupNames: [], suggestedSets: "3", suggestedReps: "15", suggestedRest: "45" },
    { name: "Crucifixo Invertido na Máquina", muscleGroupName: "Ombros", secondaryMuscleGroupNames: ["Costas"], suggestedSets: "4", suggestedReps: "15", suggestedRest: "45" },
    
    // --- Trapézio ---
    { name: "Encolhimento com Halteres", muscleGroupName: "Trapézio", secondaryMuscleGroupNames: ["Antebraço"], suggestedSets: "4", suggestedReps: "15", suggestedRest: "45" },
    { name: "Remada Alta com Barra", muscleGroupName: "Trapézio", secondaryMuscleGroupNames: ["Ombros", "Bíceps"], suggestedSets: "3", suggestedReps: "12", suggestedRest: "60" },

    // --- Bíceps ---
    { name: "Rosca Direta com Barra W", muscleGroupName: "Bíceps", secondaryMuscleGroupNames: ["Antebraço"], suggestedSets: "4", suggestedReps: "12", suggestedRest: "60" },
    { name: "Rosca Alternada com Halteres", muscleGroupName: "Bíceps", secondaryMuscleGroupNames: ["Antebraço"], suggestedSets: "3", suggestedReps: "12", suggestedRest: "60" },
    { name: "Rosca Scott com Barra W", muscleGroupName: "Bíceps", secondaryMuscleGroupNames: [], suggestedSets: "4", suggestedReps: "12", suggestedRest: "45" },
    { name: "Rosca Martelo", muscleGroupName: "Bíceps", secondaryMuscleGroupNames: ["Antebraço"], suggestedSets: "3", suggestedReps: "12", suggestedRest: "60" },

    // --- Tríceps ---
    { name: "Tríceps na Polia com Corda", muscleGroupName: "Tríceps", secondaryMuscleGroupNames: [], suggestedSets: "4", suggestedReps: "15", suggestedRest: "45" },
    { name: "Tríceps Francês com Halteres", muscleGroupName: "Tríceps", secondaryMuscleGroupNames: [], suggestedSets: "3", suggestedReps: "12", suggestedRest: "60" },
    { name: "Mergulho no Banco", muscleGroupName: "Tríceps", secondaryMuscleGroupNames: ["Peito", "Ombros"], suggestedSets: "3", suggestedReps: "20", suggestedRest: "60" },
    { name: "Tríceps Testa com Barra", muscleGroupName: "Tríceps", secondaryMuscleGroupNames: [], suggestedSets: "3", suggestedReps: "12", suggestedRest: "60" },

    // --- Abdômen ---
    { name: "Abdominal Supra (Crunch)", muscleGroupName: "Abdômen", secondaryMuscleGroupNames: [], suggestedSets: "4", suggestedReps: "20", suggestedRest: "30" },
    { name: "Prancha Abdominal", muscleGroupName: "Abdômen", secondaryMuscleGroupNames: ["Lombar"], suggestedSets: "4", suggestedReps: "20", suggestedRest: "45" },
    { name: "Elevação de Pernas na Barra Fixa", muscleGroupName: "Abdômen", secondaryMuscleGroupNames: ["Antebraço"], suggestedSets: "4", suggestedReps: "15", suggestedRest: "45" },
    { name: "Abdominal na Roda (Ab Wheel)", muscleGroupName: "Abdômen", secondaryMuscleGroupNames: ["Lombar", "Ombros"], suggestedSets: "3", suggestedReps: "15", suggestedRest: "60" },

    // --- Panturrilhas ---
    { name: "Panturrilha em Pé na Máquina", muscleGroupName: "Panturrilhas", secondaryMuscleGroupNames: [], suggestedSets: "5", suggestedReps: "20", suggestedRest: "30" },
    { name: "Panturrilha Sentado na Máquina", muscleGroupName: "Panturrilhas", secondaryMuscleGroupNames: [], suggestedSets: "5", suggestedReps: "20", suggestedRest: "30" },
  ],
  workouts: [],
};