import React from 'react';
import { UniversityProvider, useUniversity } from './context/UniversityContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { CommandCenter } from './components/dashboard/CommandCenter';
import { ChallengeMarketplace } from './components/challenges/ChallengeMarketplace';
import { ProjectWorkspace } from './components/projects/ProjectWorkspace';
import { SolutionRepository } from './components/repository/SolutionRepository';
import { IndustryCSRHub } from './components/industry/IndustryCSRHub';
import { FacultyTalentRoster } from './components/faculty/FacultyTalentRoster';
import { AuditLogsView } from './components/audit/AuditLogsView';
import { ChallengeDetailModal } from './components/challenges/ChallengeDetailModal';
import { ChallengeEvaluationModal } from './components/challenges/ChallengeEvaluationModal';
import { AITeamBuilderModal } from './components/teams/AITeamBuilderModal';
import { DocumentLessonModal } from './components/lessons/DocumentLessonModal';

const AppContent: React.FC = () => {
  const { activeTab } = useUniversity();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'command_center':
        return <CommandCenter />;
      case 'challenges_marketplace':
        return <ChallengeMarketplace />;
      case 'recommended_challenges':
        return <ChallengeMarketplace recommendedOnly />;
      case 'accepted_challenges':
        return <ChallengeMarketplace acceptedOnly />;
      case 'saved_challenges':
        return <ChallengeMarketplace savedOnly />;
      case 'research_projects':
      case 'project_gantt':
      case 'innovation_projects':
      case 'trl_tracker':
      case 'field_pilots':
      case 'lessons_learned':
        return <ProjectWorkspace />;
      case 'existing_solutions':
      case 'impact_dashboard':
        return <SolutionRepository />;
      case 'collaboration_industry':
      case 'collaboration_govt':
        return <IndustryCSRHub />;
      case 'faculty_mentors':
      case 'student_talent_pool':
      case 'my_teams':
        return <FacultyTalentRoster />;
      case 'audit_logs':
        return <AuditLogsView />;
      default:
        return <CommandCenter />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Permanent Structural Sidebar */}
      <Sidebar />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Modals & Dialogs */}
      <ChallengeDetailModal />
      <ChallengeEvaluationModal />
      <AITeamBuilderModal />
      <DocumentLessonModal />
    </div>
  );
};

export default function App() {
  return (
    <UniversityProvider>
      <AppContent />
    </UniversityProvider>
  );
}
