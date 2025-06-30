// client/src/pages/Dashboard.js
import React from 'react';
import { useUser } from '@clerk/clerk-react';

function Dashboard() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="min-h-screen py-16 text-center bg-gray-50">
      <h2 className="text-4xl font-bold text-gray-900 mb-6">Dashboard</h2>
      {isSignedIn && user ? (
        <p className="text-lg text-gray-700">
          Welcome, {user.fullName || user.primaryEmailAddress}! You are signed in.
        </p>
      ) : (
        <p className="text-lg text-gray-700">Loading user info...</p>
      )}
    </div>
  );
}

export default Dashboard;