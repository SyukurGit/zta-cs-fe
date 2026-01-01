// src/types/index.ts

export interface User {
  ID: number;
  Email: string;
  Role: 'USER' | 'CS' | 'AUDITOR';
  RiskScore: number;
}

export interface Ticket {
  ID: number;
  UserID: number;
  Subject: string;
  Status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED' | 'LOCKED';
  CreatedAt: string; // Go time.Time jadi string JSON
  User?: User; // Karena di repo ada Preload("User")
}