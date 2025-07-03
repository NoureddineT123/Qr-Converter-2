import { qrActivities, type QrActivity, type InsertQrActivity } from "@shared/schema";

export interface IStorage {
  addQrActivity(activity: InsertQrActivity): Promise<QrActivity>;
  getRecentActivities(limit?: number): Promise<QrActivity[]>;
  clearActivities(): Promise<void>;
}

export class MemStorage implements IStorage {
  private activities: Map<number, QrActivity>;
  private currentId: number;

  constructor() {
    this.activities = new Map();
    this.currentId = 1;
  }

  async addQrActivity(insertActivity: InsertQrActivity): Promise<QrActivity> {
    const id = this.currentId++;
    const activity: QrActivity = {
      ...insertActivity,
      id,
      createdAt: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getRecentActivities(limit: number = 10): Promise<QrActivity[]> {
    const activities = Array.from(this.activities.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    return activities;
  }

  async clearActivities(): Promise<void> {
    this.activities.clear();
  }
}

export const storage = new MemStorage();
