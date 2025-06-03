
import React, { useState, useEffect, useCallback } from 'react';
import { PlayerDataProvider, usePlayerData } from './context/PlayerDataContext';
import OnboardingScreen from './components/OnboardingScreen';
import Navbar from './components/Navbar';
import RankSystemModal from './components/RankSystemModal';
// Corrected: Import Route along with Router
import Router, { Route } from './components/Router'; // Import the Router and Route
import { GOAL_ARCHETYPES } from './constants';
import { getInitialStatsForGoal, getRankForLevel, calculateXpToNextLevel } from './services/gameLogicService';
import { MessageType } from './components/SystemMessage'; 

// Page Components (Import these once they are created)
import DashboardPage from './pages/DashboardPage';
import QuestsPage from './pages/QuestsPage';
import FieldOpsPage from './pages/FieldOpsPage';
import StatsInventoryPage from './pages/StatsInventoryPage';
import RoadmapPage from './pages/RoadmapPage';
import SettingsPage from './pages/SettingsPage';


interface AppSystemMessage {
  id: number;
  text: string;
  type: MessageType;
}

const SystemMessageDisplay: React.FC<{ message: string, type: MessageType, onDismiss: () => void }> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000); // Messages auto-dismiss after 5 seconds
    return () => clearTimeout(timer);
  }, [onDismiss]);

  let bgColor = 'bg-sky-500'; // Default for System/Info
  if (type === MessageType.Error) bgColor = 'bg-red-500';
  else if (type === MessageType.Warning) bgColor = 'bg-amber-500';
  else if (type === MessageType.Reward) bgColor = 'bg-green-500';

  return (
    <div 
      className={`p-3 rounded-md shadow-lg text-sm text-white ${bgColor} animate-fadeIn`}
      role="alert"
      aria-live="assertive"
    >
      {message}
    </div>
  );
};


const AppContent: React.FC = () => {
  const { playerData, setPlayerData, setSystemMessageEmitter } = usePlayerData(); 
  const [systemMessages, setSystemMessages] = useState<AppSystemMessage[]>([]);
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>(window.location.hash.substring(1) || '/dashboard');

  const addSystemMessage = useCallback((text: string, type: MessageType) => {
    setSystemMessages(prev => [...prev, { id: Date.now(), text, type }]);
  }, []);

  const removeSystemMessage = useCallback((id: number) => {
    setSystemMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  useEffect(() => {
    if (setSystemMessageEmitter) { 
      setSystemMessageEmitter(addSystemMessage);
    }
  }, [addSystemMessage, setSystemMessageEmitter]);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPage(window.location.hash.substring(1) || '/dashboard');
    };
    window.addEventListener('hashchange', handleHashChange);
    // Set initial page based on hash
    handleHashChange(); 
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


  useEffect(() => {
    const savedData = localStorage.getItem('projectAscendData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        const goal = GOAL_ARCHETYPES.find(g => g.id === parsedData.currentGoalId) || null;
        
        if (parsedData.currentGoalId && goal) { 
          setPlayerData(prev => ({
            ...prev,
            currentGoalId: parsedData.currentGoalId,
            level: parsedData.level || 1,
            xp: parsedData.xp || 0,
            xpToNextLevel: calculateXpToNextLevel(parsedData.level || 1),
            rank: getRankForLevel(parsedData.level || 1),
            stats: parsedData.stats || getInitialStatsForGoal(goal),
            statPoints: parsedData.statPoints || 0,
            dailyQuests: parsedData.dailyQuests || [], 
            dungeonIdea: parsedData.dungeonIdea || null,
            activeDungeon: parsedData.activeDungeon || null,
            bossBattleIdea: parsedData.bossBattleIdea || null,
            activeBossBattle: parsedData.activeBossBattle || null,
            inventory: parsedData.inventory || [],
            progressionFocus: parsedData.progressionFocus || null,
            roadmapEvents: parsedData.roadmapEvents || [],
            isLoadingQuests: false,
            isLoadingDungeon: false,
            isLoadingBossBattle: false,
            isLoadingProgressionFocus: !parsedData.progressionFocus, 
            isLoadingRoadmap: !parsedData.roadmapEvents,
          }));
        } else { 
          setPlayerData(prev => ({
            ...prev, 
            currentGoalId: null,
            level: 1, xp: 0, xpToNextLevel: calculateXpToNextLevel(1), rank: getRankForLevel(1),
            stats: [], statPoints: 0, dailyQuests: [], dungeonIdea: null, activeDungeon: null,
            bossBattleIdea: null, activeBossBattle: null, inventory: [], progressionFocus: null,
            roadmapEvents: [], 
          }));
          localStorage.removeItem('projectAscendData'); 
        }

      } catch (error) {
        console.error("Failed to parse saved data:", error);
        localStorage.removeItem('projectAscendData');
        setPlayerData(prev => ({...prev, currentGoalId: null, roadmapEvents: []})); 
      }
    } else { 
       setPlayerData(prev => ({...prev, currentGoalId: null, roadmapEvents: []}));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setPlayerData]); 


  useEffect(() => {
    if (playerData.currentGoalId && playerData.currentGoalId !== undefined && playerData.currentGoalId !== null) { 
      localStorage.setItem('projectAscendData', JSON.stringify({
        currentGoalId: playerData.currentGoalId,
        level: playerData.level,
        xp: playerData.xp,
        stats: playerData.stats,
        statPoints: playerData.statPoints,
        dailyQuests: playerData.dailyQuests,
        dungeonIdea: playerData.dungeonIdea,
        activeDungeon: playerData.activeDungeon,
        bossBattleIdea: playerData.bossBattleIdea,
        activeBossBattle: playerData.activeBossBattle,
        inventory: playerData.inventory,
        progressionFocus: playerData.progressionFocus,
        roadmapEvents: playerData.roadmapEvents,
      }));
    } else if (playerData.currentGoalId === null) {
      localStorage.removeItem('projectAscendData');
    }
  }, [playerData]); 

  if (playerData.currentGoalId === undefined) { 
    return <div className="flex items-center justify-center min-h-screen bg-slate-900 text-sky-300"><p className="text-2xl animate-pulse">Initializing System Core...</p></div>;
  }

  const showNavbar = playerData.currentGoalId !== null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 antialiased flex flex-col">
      {showNavbar && <Navbar onShowRankModal={() => setIsRankModalOpen(true)} currentPage={currentPage} />}
      
      <div className={`fixed ${showNavbar ? 'top-20' : 'top-4'} right-4 z-50 space-y-2 w-full max-w-xs sm:max-w-sm`}>
        {systemMessages.map(msg => (
          <SystemMessageDisplay 
            key={msg.id} 
            message={msg.text} 
            type={msg.type} 
            onDismiss={() => removeSystemMessage(msg.id)}
          />
        ))}
      </div>

      <main className="flex-grow pt-4">
        {playerData.currentGoalId === null ? (
          <OnboardingScreen />
        ) : (
          // Corrected: Wrap page components with Route
          <Router currentPage={currentPage}>
            <Route path="/dashboard"><DashboardPage /></Route>
            <Route path="/quests"><QuestsPage /></Route>
            <Route path="/field-ops"><FieldOpsPage /></Route>
            <Route path="/stats-inventory"><StatsInventoryPage /></Route>
            <Route path="/roadmap"><RoadmapPage /></Route>
            <Route path="/settings">
              <SettingsPage onShowRankModal={() => setIsRankModalOpen(true)} />
            </Route>
            {/* Default route */}
            <Route path="/"><DashboardPage /></Route>
          </Router>
        )}
      </main>
      
      <RankSystemModal isOpen={isRankModalOpen} onClose={() => setIsRankModalOpen(false)} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <PlayerDataProvider>
      <AppContent />
    </PlayerDataProvider>
  );
};

export default App;
