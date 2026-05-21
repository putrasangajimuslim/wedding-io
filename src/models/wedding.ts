// types/wedding.ts

export interface Agenda {
  id?: number | string;
  day: number;
  month: number;
  year: number;
  title: string;
  time: string;
  venue: string;
  location: string;
  pic: string;
  phone: string;
}

export interface FinalWedding {
  id?: string;
  weddingName: string;
  inviteCode: string;
  isTwoEvents: boolean;
  akadDate: string;
  akadVenue: string;
  akadLocation: string;
  resepsiDate?: string;
  resepsiVenue?: string;
  resepsiLocation?: string;
}