// src/features/benefits/management/services/benefits.service.ts
import type { BenefitType, BenefitsSummary, EnrollmentRequest } from '../types';

// Use a simple fetch instead of axios to avoid dependency
const API_BASE_URL = '/api';

export class BenefitsService {
  static async getBenefitsOverview(params: {
    role: string;
    branchId?: string;
    selectedBranch?: string;
    dateRange?: 'month' | 'quarter' | 'year';
  }): Promise<BenefitsSummary> {
    try {
      const response = await fetch(`${API_BASE_URL}/benefits/overview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch benefits overview');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching benefits overview:', error);
      throw error;
    }
  }

  static async getBenefitTypes(): Promise<BenefitType[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/benefits/types`);
      if (!response.ok) {
        throw new Error('Failed to fetch benefit types');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching benefit types:', error);
      throw error;
    }
  }

  static async getEnrollmentRequests(params: {
    branchId?: string;
    status?: string;
  }): Promise<EnrollmentRequest[]> {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${API_BASE_URL}/benefits/enrollments?${queryString}`);
      if (!response.ok) {
        throw new Error('Failed to fetch enrollment requests');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching enrollment requests:', error);
      throw error;
    }
  }

  static async exportReport(params: {
    type: string;
    format: string;
    branchId?: string;
    dateRange?: string;
  }): Promise<Blob> {
    try {
      const response = await fetch(`${API_BASE_URL}/benefits/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!response.ok) {
        throw new Error('Failed to export report');
      }
      return response.blob();
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }
}