import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navigation/Navbar';
import Footer from '../Navigation/Footer';
import { ToastContainer } from '../Common/Toast';

const DashboardLayout = () => (
  <div className="flex min-h-screen flex-col bg-[#f8f9fa]">
    <ToastContainer />
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default DashboardLayout;
