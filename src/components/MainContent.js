import React from 'react';
import { useAppContext } from '../context/AppContext';

// Importe todas as suas páginas aqui
import { HomePage } from '../pages/HomePage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import ListPageContainer from '../pages/list/ListPageContainer';
import { GroupFormPage } from '../pages/groups/GroupFormPage';
import { ExerciseFormPage } from '../pages/exercises/ExerciseFormPage';
import WorkoutsListPage from '../pages/workouts/WorkoutsListPage';
import TrainingModePage from '../pages/workouts/TrainingModePage';
import WorkoutEditorPage from '../pages/workouts/WorkoutEditorPage';

export default function MainContent() {
    const { currentView } = useAppContext();

    switch (currentView.page) {
      case 'home': return <HomePage />;
      case 'profile': return <ProfilePage />;
      case 'groups': 
        if(currentView.mode === 'create' || currentView.mode === 'edit'){ 
            return <GroupFormPage />; 
        }
        return <ListPageContainer pageTitle="Grupos Musculares" itemType="groups" />;
      case 'exercises':
        if (currentView.mode === 'create' || currentView.mode === 'edit') { 
            return <ExerciseFormPage />; 
        }
        return <ListPageContainer pageTitle="Exercícios" itemType="exercises" />;
      case 'workouts':
        if (currentView.mode === 'training') {
          return <TrainingModePage />;
        }
        if (currentView.mode === 'edit') {
            return <WorkoutEditorPage /> 
        }
        return <WorkoutsListPage />;
      default: return <HomePage />;
    }
}