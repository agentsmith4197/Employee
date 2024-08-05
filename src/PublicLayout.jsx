// src/PublicLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 p-6">
        <Outlet /> {/* Render nested routes */}
      </main>
    </div>
  );
};

export default PublicLayout;
