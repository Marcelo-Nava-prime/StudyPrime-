import React, { useState } from 'react';
import { 
  StudyMaterial, 
  EducationalLevel, 
  Subject, 
  Region, 
  MaterialType, 
  UserProfile, 
  Language, 
  Comment, 
  StudyGroup, 
  Flashcard, 
  QuizQuestion,
  NotificationItem
} from './types';
import { MOCK_MATERIALS, CURRENT_USER, MOCK_USERS, MOCK_GROUPS, MOCK_NOTIFICATIONS } from './mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FeedView } from './components/FeedView';
import { LibraryView } from './components/LibraryView';
import { AITutorView } from './components/AITutorView';
import { SmartScannerView } from './components/SmartScannerView';
import { AutoGeneratorView } from './components/AutoGeneratorView';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { StudyGroupsView } from './components/StudyGroupsView';
import { MaterialDetailModal } from './components/MaterialDetailModal';
import { UploadMaterialModal } from './components/UploadMaterialModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminPanelModal } from './components/AdminPanelModal';

export function App() {
  // Navigation View State
  const [activeTab, setActiveTab] = useState<
    'feed' | 'library' | 'tutor' | 'scanner' | 'generator' | 'flashcards' | 'quiz' | 'groups'
  >('feed');

  // App State Data
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [groups, setGroups] = useState<StudyGroup[]>(MOCK_GROUPS);
  const [knowers, setKnowers] = useState<UserProfile[]>(MOCK_USERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      materialId: 'mat-1',
      authorName: 'Lucía Fernández',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      text: '¡Excelente apunte! Me ha ayudado muchísimo a entender los intervalos de confianza para el examen de la semana que viene.',
      rating: 5,
      date: 'Ayer'
    },
    {
      id: 'c2',
      materialId: 'mat-2',
      authorName: 'Pablo Ruiz',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      text: 'Súper resumido y directo a los conceptos que preguntan en la EBAU. 10/10.',
      rating: 5,
      date: 'Hace 2 días'
    }
  ]);

  // Filters State for Library & Feed
  const [selectedLevel, setSelectedLevel] = useState<EducationalLevel | 'Todos'>('Todos');
  const [selectedSubject, setSelectedSubject] = useState<Subject | 'Todas'>('Todas');
  const [selectedRegion, setSelectedRegion] = useState<Region | 'Todas'>('Todas');
  const [selectedType, setSelectedType] = useState<MaterialType | 'Todos'>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [language, setLanguage] = useState<Language>('es');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Modals Visibility State
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // AI Prompt forwarding
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | undefined>(undefined);

  // Toggle Dark Mode Class on Root
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Like & Save Material Handlers
  const handleToggleLike = (id: string) => {
    setMaterials(prev => prev.map(m => {
      if (m.id === id) {
        const isLiked = !m.isLiked;
        return {
          ...m,
          isLiked,
          likesCount: isLiked ? m.likesCount + 1 : m.likesCount - 1
        };
      }
      return m;
    }));

    if (selectedMaterial && selectedMaterial.id === id) {
      setSelectedMaterial(prev => prev ? {
        ...prev,
        isLiked: !prev.isLiked,
        likesCount: !prev.isLiked ? prev.likesCount + 1 : prev.likesCount - 1
      } : null);
    }
  };

  const handleToggleSave = (id: string) => {
    setMaterials(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, isSaved: !m.isSaved };
      }
      return m;
    }));

    if (selectedMaterial && selectedMaterial.id === id) {
      setSelectedMaterial(prev => prev ? {
        ...prev,
        isSaved: !prev.isSaved
      } : null);
    }
  };

  const handleAddComment = (materialId: string, text: string, rating: number) => {
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      materialId,
      authorName: user.name,
      authorAvatar: user.avatar,
      text,
      rating,
      date: 'Ahora mismo'
    };

    setComments(prev => [newComment, ...prev]);
    setMaterials(prev => prev.map(m => {
      if (m.id === materialId) {
        return { ...m, commentsCount: m.commentsCount + 1 };
      }
      return m;
    }));
  };

  // Handle New Material Upload
  const handleUploadSuccess = (newMat: StudyMaterial, autoGenerateAI: boolean) => {
    setMaterials(prev => [newMat, ...prev]);
    setUser(prev => ({
      ...prev,
      points: prev.points + 50,
      itemsPublished: prev.itemsPublished + 1
    }));

    if (autoGenerateAI) {
      // Trigger AI Material Generation in background
      fetch('/api/ai/generate-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceText: newMat.contentText,
          topic: newMat.title,
          subject: newMat.subject,
          level: newMat.level,
          language
        })
      })
      .then(async res => {
        const text = await res.text();
        try {
          return JSON.parse(text);
        } catch {
          console.warn('Invalid JSON from /api/ai/generate-material');
          return {};
        }
      })
      .then(data => {
        if (data && data.flashcards && data.quizzes) {
          setMaterials(prev => prev.map(m => {
            if (m.id === newMat.id) {
              return {
                ...m,
                flashcardSet: data.flashcards,
                quizSet: data.quizzes
              };
            }
            return m;
          }));
        }
      })
      .catch(err => console.error('Auto AI generation error:', err));
    }
  };

  // Update AI Daily Query Count (Unlimited)
  const handleUpdateDailyQueries = () => {
    // Unlimited access
  };

  // AI Prompt Forwarding to Tutor
  const handleNavigateToTutorWithPrompt = (prompt: string) => {
    setTutorInitialPrompt(prompt);
    setSelectedMaterial(null);
    setActiveTab('tutor');
  };

  const handleGenerateStudyMaterialForNote = (material: StudyMaterial) => {
    setSelectedMaterial(null);
    setActiveTab('generator');
  };

  // Save generated material from AI Generator
  const handleSaveGeneratedMaterial = (data: {
    summaryText: string;
    conceptMap: string;
    flashcards: Flashcard[];
    quizzes: QuizQuestion[];
    topic: string;
  }) => {
    const newMat: StudyMaterial = {
      id: `mat-ai-${Date.now()}`,
      title: `Resumen & Mazo: ${data.topic}`,
      description: `Material generado automáticamente por StudyPrime AI`,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorRole: 'Knower',
      level: user.level,
      subject: 'Matemáticas',
      topic: data.topic,
      region: user.region,
      type: 'resumen',
      likesCount: 1,
      commentsCount: 0,
      rating: 5.0,
      views: 1,
      createdAt: new Date().toISOString().split('T')[0],
      contentText: `${data.summaryText}\n\nMAPA CONCEPTUAL:\n${data.conceptMap}`,
      tags: ['IA', 'Generado', 'Flashcards'],
      isLiked: true,
      isSaved: true,
      flashcardSet: data.flashcards,
      quizSet: data.quizzes
    };

    setMaterials(prev => [newMat, ...prev]);
    alert('¡Material guardado con éxito en tu biblioteca!');
  };

  // Toggle Group Join
  const handleJoinGroupToggle = (groupId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        const isJoined = !g.isJoined;
        return {
          ...g,
          isJoined,
          membersCount: isJoined ? g.membersCount + 1 : g.membersCount - 1
        };
      }
      return g;
    }));
  };

  // Send Group Chat Message
  const handleSendGroupMessage = (groupId: string, text: string) => {
    const newMsg = {
      id: `gmsg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          recentMessages: [...g.recentMessages, newMsg]
        };
      }
      return g;
    }));
  };

  // Create New Group
  const handleCreateGroup = (name: string, description: string, subject: any, isPrivate: boolean) => {
    const newGroup: StudyGroup = {
      id: `grp-${Date.now()}`,
      name,
      description,
      subject,
      level: user.level,
      createdBy: user.name,
      tags: [subject, user.level],
      members: [{ name: user.name, avatar: user.avatar, role: 'Líder' }],
      membersCount: 1,
      isPrivate,
      groupAvatar: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200',
      recentMessages: [],
      isJoined: true
    };
    setGroups(prev => [newGroup, ...prev]);
  };

  // Follow/Unfollow Knower
  const handleToggleFollowKnower = (userId: string) => {
    setKnowers(prev => prev.map(k => {
      if (k.id === userId) {
        const isFollowing = !k.isFollowing;
        return {
          ...k,
          isFollowing,
          followersCount: isFollowing ? k.followersCount + 1 : k.followersCount - 1
        };
      }
      return k;
    }));
  };

  // Delete Material (Admin)
  const handleDeleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  return (
    <div className={`min-h-screen bg-[#FDFDFB] dark:bg-[#121212] text-[#121212] dark:text-[#FDFDFB] font-sans ${darkMode ? 'dark' : ''}`}>
      
      {/* Top Navigation Bar */}
      <Navbar
        user={user}
        notifications={notifications}
        language={language}
        searchQuery={searchQuery}
        darkMode={darkMode}
        onSearchChange={setSearchQuery}
        onLanguageChange={setLanguage}
        onToggleDarkMode={toggleDarkMode}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenPremium={() => setIsPremiumOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigate={(v) => setActiveTab(v as any)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* Main App Layout Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Navigation Sidebar */}
        <div className="md:col-span-1">
          <Sidebar
            activeTab={activeTab}
            language={language}
            user={user}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            onSelectTab={setActiveTab}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenPremium={() => setIsPremiumOpen(true)}
          />
        </div>

        {/* Center Main View Area */}
        <main className="md:col-span-3">
          
          {/* VIEW 1: HOME FEED */}
          {activeTab === 'feed' && (
            <FeedView
              materials={materials}
              knowers={knowers}
              user={user}
              language={language}
              onNavigate={(v) => setActiveTab(v as any)}
              onSelectMaterial={setSelectedMaterial}
              onToggleLike={handleToggleLike}
            />
          )}

          {/* VIEW 2: SEARCH & FILTER LIBRARY */}
          {activeTab === 'library' && (
            <LibraryView
              materials={materials}
              language={language}
              selectedLevel={selectedLevel}
              selectedSubject={selectedSubject}
              selectedRegion={selectedRegion}
              selectedType={selectedType}
              searchQuery={searchQuery}
              onSelectLevel={setSelectedLevel}
              onSelectSubject={setSelectedSubject}
              onSelectRegion={setSelectedRegion}
              onSelectType={setSelectedType}
              onSearchChange={setSearchQuery}
              onSelectMaterial={setSelectedMaterial}
              onToggleLike={handleToggleLike}
              onToggleSave={handleToggleSave}
            />
          )}

          {/* VIEW 3: 24/7 AI TUTOR CHAT */}
          {activeTab === 'tutor' && (
            <AITutorView
              user={user}
              language={language}
              initialPrompt={tutorInitialPrompt}
              onUpdateDailyQueries={handleUpdateDailyQueries}
            />
          )}

          {/* VIEW 4: SMART SCANNER & OCR SOLVER */}
          {activeTab === 'scanner' && (
            <SmartScannerView
              user={user}
              language={language}
              onUpdateDailyQueries={handleUpdateDailyQueries}
            />
          )}

          {/* VIEW 5: AUTOMATIC STUDY MATERIAL GENERATOR */}
          {activeTab === 'generator' && (
            <AutoGeneratorView
              user={user}
              language={language}
              onUpdateDailyQueries={handleUpdateDailyQueries}
              onSaveGeneratedMaterial={handleSaveGeneratedMaterial}
            />
          )}

          {/* VIEW 6: FLASHCARDS SRS ENGINE */}
          {activeTab === 'flashcards' && (
            <FlashcardsView
              materials={materials}
              language={language}
            />
          )}

          {/* VIEW 7: TIMED QUIZ RUNNER */}
          {activeTab === 'quiz' && (
            <QuizView
              materials={materials}
              language={language}
            />
          )}

          {/* VIEW 8: COLLABORATIVE STUDY GROUPS */}
          {activeTab === 'groups' && (
            <StudyGroupsView
              groups={groups}
              user={user}
              language={language}
              onJoinToggle={handleJoinGroupToggle}
              onSendMessage={handleSendGroupMessage}
              onCreateGroup={handleCreateGroup}
            />
          )}

        </main>

      </div>

      {/* OVERLAY MODALS */}

      {/* Material Document Detail Viewer Modal */}
      {selectedMaterial && (
        <MaterialDetailModal
          material={selectedMaterial}
          comments={comments}
          language={language}
          onClose={() => setSelectedMaterial(null)}
          onToggleLike={handleToggleLike}
          onToggleSave={handleToggleSave}
          onAddComment={handleAddComment}
          onNavigateToTutorWithPrompt={handleNavigateToTutorWithPrompt}
          onGenerateStudyMaterialForNote={handleGenerateStudyMaterialForNote}
        />
      )}

      {/* Upload Study Material Modal */}
      {isUploadOpen && (
        <UploadMaterialModal
          user={user}
          language={language}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {/* User Profile Modal */}
      {isProfileOpen && (
        <UserProfileModal
          user={user}
          userMaterials={materials.filter(m => m.authorId === user.id)}
          language={language}
          onClose={() => setIsProfileOpen(false)}
          onOpenPremium={() => {}}
        />
      )}

      {/* Admin Panel Modal */}
      {isAdminOpen && (
        <AdminPanelModal
          materials={materials}
          users={knowers}
          onClose={() => setIsAdminOpen(false)}
          onDeleteMaterial={handleDeleteMaterial}
        />
      )}

    </div>
  );
}

export default App;
