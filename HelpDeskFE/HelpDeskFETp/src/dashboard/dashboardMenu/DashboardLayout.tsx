import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import {  SidebarDashboard } from '../dashboardMenu/SidebarDashboard';

export const LayoutDashboard: React.FC = () => {
  return (
  <div className="flex flex-col w-screen h-screen bg-[#f8fafc] overflow-hidden antialiased font-sans">

      <Navbar />

      <div className="flex flex-1 w-full h-[calc(100vh-80px)] overflow-hidden">

        <SidebarDashboard />

        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <Outlet />
        </main>

      </div>
    </div>
  );
};