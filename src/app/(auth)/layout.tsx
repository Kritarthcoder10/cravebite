import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-wrapper">
      <div 
        className="auth-side-panel"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1200')`,
        }}
      >
        <div className="auth-side-content">
          <h1>Taste the Best in Every Bite.</h1>
          <p>
            Experience premium culinary delights delivered fresh, hot, and fast directly to your door. Join the CraveBite community today.
          </p>
        </div>
      </div>
      <div className="auth-form-panel">
        <div className="auth-form-card">
          {children}
        </div>
      </div>
    </div>
  );
}
