
import React from 'react';
import RoadmapCalendar from '../components/RoadmapCalendar';

const RoadmapPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <h1 className="text-3xl font-bold text-sky-400 mb-6">Strategic Objective Roadmap</h1>
      <RoadmapCalendar />
    </div>
  );
};

export default RoadmapPage;
