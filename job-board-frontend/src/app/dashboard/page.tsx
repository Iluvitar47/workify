'use client';

import React from 'react';
import UsersDashboard from '@/components/UsersDashboard';
import AdvertisementDashboard from '@/components/AdvertisementsDashboard';
import CompaniesDashboard from '@/components/CompaniesDashboard';
import ApplicationsDashboard from '@/components/ApplicationsDashboard';
import PeopleDashboard from '@/components/PeopleDashboard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Dashboard() {
  return (
    <>
      <div>
        <Header/>
        <h1 className=' text-center mb-14'>Dashboard</h1>
        <UsersDashboard />
        <CompaniesDashboard />
        <AdvertisementDashboard />
        <ApplicationsDashboard />
        <PeopleDashboard />
        <div className='mt-32'>< Footer/></div>
      </div>
    </>
  );
}
