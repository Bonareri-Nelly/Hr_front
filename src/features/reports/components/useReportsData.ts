import { useState, useEffect } from 'react';

interface UseReportsDataProps {
  timeRange: 'monthly' | 'quarterly' | 'annual';
  branch: string;
  department: string;
  dateRange: { start: string; end: string };
}

const branchData: Record<string, any> = {
  all: {
    summary: {
      totalEmployees: 1248,
      totalPayroll: 'KES 84.6M',
      complianceScore: 98.2,
      benefitsUtilization: 67,
      turnoverRate: 8.5,
      avgPerformance: 4.2,
    },
    workforce: {
      headcount: [
        { month: 'Jan', total: 1180, newHires: 25, exits: 10 },
        { month: 'Feb', total: 1195, newHires: 18, exits: 8 },
        { month: 'Mar', total: 1210, newHires: 22, exits: 12 },
        { month: 'Apr', total: 1228, newHires: 30, exits: 15 },
        { month: 'May', total: 1240, newHires: 20, exits: 10 },
        { month: 'Jun', total: 1248, newHires: 15, exits: 5 },
      ],
      turnover: { rate: 8.5, trend: 'down' },
      tenure: { average: 4.2, distribution: [{ label: '0-2 yrs', value: 30 }, { label: '3-5 yrs', value: 40 }, { label: '5+ yrs', value: 30 }] },
      departments: [
        { name: 'Engineering', headcount: 156, spanOfControl: 12 },
        { name: 'Finance', headcount: 89, spanOfControl: 8 },
        { name: 'HR', headcount: 34, spanOfControl: 5 },
        { name: 'Sales', headcount: 112, spanOfControl: 10 },
        { name: 'Operations', headcount: 78, spanOfControl: 7 },
      ],
      diversity: [
        { category: 'Senior Leadership', count: 45, percentage: 3.6 },
        { category: 'Management', count: 180, percentage: 14.4 },
        { category: 'Professional', count: 540, percentage: 43.3 },
        { category: 'Support', count: 483, percentage: 38.7 },
      ],
    },
    payroll: {
      total: [
        { month: 'Jan', amount: 13600000 },
        { month: 'Feb', amount: 13850000 },
        { month: 'Mar', amount: 14100000 },
        { month: 'Apr', amount: 14350000 },
        { month: 'May', amount: 14600000 },
        { month: 'Jun', amount: 14850000 },
      ],
      breakdown: [
        { category: 'Base Salary', amount: 58000000, percentage: 68.5 },
        { category: 'Benefits', amount: 12800000, percentage: 15.1 },
        { category: 'Overtime', amount: 8500000, percentage: 10.0 },
        { category: 'Statutory', amount: 5400000, percentage: 6.4 },
      ],
      budget: { actual: 14850000, budget: 14500000, variance: 350000 },
      branchComparison: [
        { branch: 'Nairobi HQ', totalPayroll: 48400000, avgPerEmployee: 115000 },
        { branch: 'Mombasa', totalPayroll: 34800000, avgPerEmployee: 112000 },
        { branch: 'Kisumu', totalPayroll: 31200000, avgPerEmployee: 111000 },
        { branch: 'Remote Units', totalPayroll: 26800000, avgPerEmployee: 109000 },
        { branch: 'Eldoret', totalPayroll: 23400000, avgPerEmployee: 108000 },
      ],
    },
    compliance: {
      status: [
        { category: 'PAYE', filed: 120, pending: 0, total: 120 },
        { category: 'NSSF', filed: 115, pending: 5, total: 120 },
        { category: 'NHIF/SHIF', filed: 118, pending: 2, total: 120 },
        { category: 'Housing Levy', filed: 110, pending: 10, total: 120 },
      ],
      trend: [
        { month: 'Jan', amount: 850000 },
        { month: 'Feb', amount: 890000 },
        { month: 'Mar', amount: 920000 },
        { month: 'Apr', amount: 880000 },
        { month: 'May', amount: 940000 },
        { month: 'Jun', amount: 980000 },
      ],
      flags: [
        { branch: 'Eldoret', issue: 'NSSF filing overdue', status: 'overdue' },
        { branch: 'Mombasa', issue: 'Housing Levy pending', status: 'pending' },
      ],
      overallScore: 98.2,
    },
    benefits: {
      summary: [
        { category: 'Medical Insurance', utilization: 82, cost: 4800000, eligible: 1248 },
        { category: 'Pension', utilization: 76, cost: 3600000, eligible: 1248 },
        { category: 'Paid Leave', utilization: 65, cost: 2800000, eligible: 1248 },
        { category: 'Wellness', utilization: 52, cost: 1200000, eligible: 1248 },
        { category: 'Hardship Allowance', utilization: 38, cost: 800000, eligible: 800 },
      ],
      totalCost: 13200000,
      avgUtilization: 67,
    },
    performance: {
      distribution: [
        { rating: '5 - Exceptional', count: 156, percentage: 12.5 },
        { rating: '4 - Exceeds', count: 312, percentage: 25.0 },
        { rating: '3 - Meets', count: 498, percentage: 39.9 },
        { rating: '2 - Needs Improvement', count: 198, percentage: 15.9 },
        { rating: '1 - Underperforming', count: 84, percentage: 6.7 },
      ],
      departmentComparison: [
        { department: 'Engineering', avgScore: 4.2 },
        { department: 'Finance', avgScore: 4.0 },
        { department: 'HR', avgScore: 4.5 },
        { department: 'Sales', avgScore: 3.8 },
        { department: 'Operations', avgScore: 4.1 },
      ],
      trend: [
        { cycle: 'Q1 2025', avgScore: 3.8 },
        { cycle: 'Q2 2025', avgScore: 3.9 },
        { cycle: 'Q3 2025', avgScore: 4.0 },
        { cycle: 'Q4 2025', avgScore: 4.1 },
        { cycle: 'Q1 2026', avgScore: 4.2 },
      ],
      overallAvg: 4.2,
    },
  },
  'Nairobi HQ': {
    summary: {
      totalEmployees: 420,
      totalPayroll: 'KES 28.4M',
      complianceScore: 98.5,
      benefitsUtilization: 72,
      turnoverRate: 7.8,
      avgPerformance: 4.3,
    },
    workforce: {
      headcount: [
        { month: 'Jan', total: 405, newHires: 10, exits: 5 },
        { month: 'Feb', total: 410, newHires: 8, exits: 3 },
        { month: 'Mar', total: 412, newHires: 6, exits: 4 },
        { month: 'Apr', total: 415, newHires: 12, exits: 9 },
        { month: 'May', total: 418, newHires: 8, exits: 5 },
        { month: 'Jun', total: 420, newHires: 6, exits: 2 },
      ],
      turnover: { rate: 7.8, trend: 'down' },
      tenure: { average: 4.5, distribution: [{ label: '0-2 yrs', value: 28 }, { label: '3-5 yrs', value: 42 }, { label: '5+ yrs', value: 30 }] },
      departments: [
        { name: 'Engineering', headcount: 156, spanOfControl: 12 },
        { name: 'Finance', headcount: 89, spanOfControl: 8 },
        { name: 'HR', headcount: 34, spanOfControl: 5 },
        { name: 'Sales', headcount: 112, spanOfControl: 10 },
        { name: 'Operations', headcount: 29, spanOfControl: 4 },
      ],
      diversity: [
        { category: 'Senior Leadership', count: 15, percentage: 3.6 },
        { category: 'Management', count: 60, percentage: 14.3 },
        { category: 'Professional', count: 180, percentage: 42.9 },
        { category: 'Support', count: 165, percentage: 39.3 },
      ],
    },
    payroll: {
      total: [
        { month: 'Jan', amount: 4200000 },
        { month: 'Feb', amount: 4350000 },
        { month: 'Mar', amount: 4500000 },
        { month: 'Apr', amount: 4600000 },
        { month: 'May', amount: 4750000 },
        { month: 'Jun', amount: 4840000 },
      ],
      breakdown: [
        { category: 'Base Salary', amount: 3200000, percentage: 66.1 },
        { category: 'Benefits', amount: 720000, percentage: 14.9 },
        { category: 'Overtime', amount: 480000, percentage: 9.9 },
        { category: 'Statutory', amount: 440000, percentage: 9.1 },
      ],
      budget: { actual: 4840000, budget: 4700000, variance: 140000 },
      branchComparison: [
        { branch: 'Nairobi HQ', totalPayroll: 4840000, avgPerEmployee: 115000 },
      ],
    },
    compliance: {
      status: [
        { category: 'PAYE', filed: 12, pending: 0, total: 12 },
        { category: 'NSSF', filed: 11, pending: 1, total: 12 },
        { category: 'NHIF/SHIF', filed: 12, pending: 0, total: 12 },
        { category: 'Housing Levy', filed: 10, pending: 2, total: 12 },
      ],
      trend: [
        { month: 'Jan', amount: 85000 },
        { month: 'Feb', amount: 89000 },
        { month: 'Mar', amount: 92000 },
        { month: 'Apr', amount: 88000 },
        { month: 'May', amount: 94000 },
        { month: 'Jun', amount: 98000 },
      ],
      flags: [
        { branch: 'Nairobi HQ', issue: 'Housing Levy pending for May', status: 'pending' },
      ],
      overallScore: 98.5,
    },
    benefits: {
      summary: [
        { category: 'Medical Insurance', utilization: 85, cost: 2400000, eligible: 420 },
        { category: 'Pension', utilization: 78, cost: 1800000, eligible: 420 },
        { category: 'Paid Leave', utilization: 62, cost: 1200000, eligible: 420 },
        { category: 'Wellness', utilization: 48, cost: 600000, eligible: 420 },
      ],
      totalCost: 6000000,
      avgUtilization: 72,
    },
    performance: {
      distribution: [
        { rating: '5 - Exceptional', count: 55, percentage: 13.1 },
        { rating: '4 - Exceeds', count: 110, percentage: 26.2 },
        { rating: '3 - Meets', count: 160, percentage: 38.1 },
        { rating: '2 - Needs Improvement', count: 70, percentage: 16.7 },
        { rating: '1 - Underperforming', count: 25, percentage: 6.0 },
      ],
      departmentComparison: [
        { department: 'Engineering', avgScore: 4.3 },
        { department: 'Finance', avgScore: 4.1 },
        { department: 'HR', avgScore: 4.6 },
        { department: 'Sales', avgScore: 3.9 },
        { department: 'Operations', avgScore: 4.2 },
      ],
      trend: [
        { cycle: 'Q1 2025', avgScore: 4.0 },
        { cycle: 'Q2 2025', avgScore: 4.1 },
        { cycle: 'Q3 2025', avgScore: 4.2 },
        { cycle: 'Q4 2025', avgScore: 4.2 },
        { cycle: 'Q1 2026', avgScore: 4.3 },
      ],
      overallAvg: 4.3,
    },
  },
  'Mombasa': {
    summary: {
      totalEmployees: 310,
      totalPayroll: 'KES 21.2M',
      complianceScore: 95.5,
      benefitsUtilization: 62,
      turnoverRate: 9.2,
      avgPerformance: 3.9,
    },
    workforce: {
      headcount: [
        { month: 'Jan', total: 295, newHires: 8, exits: 4 },
        { month: 'Feb', total: 298, newHires: 5, exits: 2 },
        { month: 'Mar', total: 302, newHires: 7, exits: 3 },
        { month: 'Apr', total: 305, newHires: 10, exits: 7 },
        { month: 'May', total: 308, newHires: 4, exits: 1 },
        { month: 'Jun', total: 310, newHires: 5, exits: 3 },
      ],
      turnover: { rate: 9.2, trend: 'up' },
      tenure: { average: 3.8, distribution: [{ label: '0-2 yrs', value: 35 }, { label: '3-5 yrs', value: 38 }, { label: '5+ yrs', value: 27 }] },
      departments: [
        { name: 'Sales', headcount: 85, spanOfControl: 6 },
        { name: 'Operations', headcount: 120, spanOfControl: 8 },
        { name: 'Customer Support', headcount: 65, spanOfControl: 4 },
        { name: 'Logistics', headcount: 40, spanOfControl: 3 },
      ],
      diversity: [
        { category: 'Senior Leadership', count: 10, percentage: 3.2 },
        { category: 'Management', count: 45, percentage: 14.5 },
        { category: 'Professional', count: 130, percentage: 41.9 },
        { category: 'Support', count: 125, percentage: 40.3 },
      ],
    },
    payroll: {
      total: [
        { month: 'Jan', amount: 3100000 },
        { month: 'Feb', amount: 3200000 },
        { month: 'Mar', amount: 3350000 },
        { month: 'Apr', amount: 3400000 },
        { month: 'May', amount: 3500000 },
        { month: 'Jun', amount: 3600000 },
      ],
      breakdown: [
        { category: 'Base Salary', amount: 2400000, percentage: 66.7 },
        { category: 'Benefits', amount: 540000, percentage: 15.0 },
        { category: 'Overtime', amount: 360000, percentage: 10.0 },
        { category: 'Statutory', amount: 300000, percentage: 8.3 },
      ],
      budget: { actual: 3600000, budget: 3550000, variance: 50000 },
      branchComparison: [
        { branch: 'Mombasa', totalPayroll: 3600000, avgPerEmployee: 116000 },
      ],
    },
    compliance: {
      status: [
        { category: 'PAYE', filed: 12, pending: 0, total: 12 },
        { category: 'NSSF', filed: 10, pending: 2, total: 12 },
        { category: 'NHIF/SHIF', filed: 11, pending: 1, total: 12 },
        { category: 'Housing Levy', filed: 9, pending: 3, total: 12 },
      ],
      trend: [
        { month: 'Jan', amount: 75000 },
        { month: 'Feb', amount: 78000 },
        { month: 'Mar', amount: 82000 },
        { month: 'Apr', amount: 80000 },
        { month: 'May', amount: 85000 },
        { month: 'Jun', amount: 88000 },
      ],
      flags: [
        { branch: 'Mombasa', issue: 'Housing Levy pending for June', status: 'pending' },
      ],
      overallScore: 95.5,
    },
    benefits: {
      summary: [
        { category: 'Medical Insurance', utilization: 78, cost: 1800000, eligible: 310 },
        { category: 'Pension', utilization: 70, cost: 1400000, eligible: 310 },
        { category: 'Paid Leave', utilization: 58, cost: 900000, eligible: 310 },
        { category: 'Wellness', utilization: 42, cost: 400000, eligible: 310 },
      ],
      totalCost: 4500000,
      avgUtilization: 62,
    },
    performance: {
      distribution: [
        { rating: '5 - Exceptional', count: 35, percentage: 11.3 },
        { rating: '4 - Exceeds', count: 70, percentage: 22.6 },
        { rating: '3 - Meets', count: 120, percentage: 38.7 },
        { rating: '2 - Needs Improvement', count: 60, percentage: 19.4 },
        { rating: '1 - Underperforming', count: 25, percentage: 8.1 },
      ],
      departmentComparison: [
        { department: 'Sales', avgScore: 3.8 },
        { department: 'Operations', avgScore: 4.0 },
        { department: 'Customer Support', avgScore: 3.7 },
        { department: 'Logistics', avgScore: 3.9 },
      ],
      trend: [
        { cycle: 'Q1 2025', avgScore: 3.7 },
        { cycle: 'Q2 2025', avgScore: 3.8 },
        { cycle: 'Q3 2025', avgScore: 3.8 },
        { cycle: 'Q4 2025', avgScore: 3.9 },
        { cycle: 'Q1 2026', avgScore: 3.9 },
      ],
      overallAvg: 3.9,
    },
  },
  'Kisumu': {
    summary: {
      totalEmployees: 280,
      totalPayroll: 'KES 19.1M',
      complianceScore: 97.0,
      benefitsUtilization: 58,
      turnoverRate: 8.0,
      avgPerformance: 4.0,
    },
    workforce: {
      headcount: [
        { month: 'Jan', total: 268, newHires: 6, exits: 3 },
        { month: 'Feb', total: 272, newHires: 7, exits: 3 },
        { month: 'Mar', total: 275, newHires: 5, exits: 2 },
        { month: 'Apr', total: 277, newHires: 8, exits: 6 },
        { month: 'May', total: 278, newHires: 3, exits: 2 },
        { month: 'Jun', total: 280, newHires: 4, exits: 2 },
      ],
      turnover: { rate: 8.0, trend: 'stable' },
      tenure: { average: 4.0, distribution: [{ label: '0-2 yrs', value: 32 }, { label: '3-5 yrs', value: 40 }, { label: '5+ yrs', value: 28 }] },
      departments: [
        { name: 'Operations', headcount: 130, spanOfControl: 6 },
        { name: 'Sales', headcount: 80, spanOfControl: 5 },
        { name: 'Customer Support', headcount: 70, spanOfControl: 4 },
      ],
      diversity: [
        { category: 'Senior Leadership', count: 8, percentage: 2.9 },
        { category: 'Management', count: 40, percentage: 14.3 },
        { category: 'Professional', count: 115, percentage: 41.1 },
        { category: 'Support', count: 117, percentage: 41.8 },
      ],
    },
    payroll: {
      total: [
        { month: 'Jan', amount: 2750000 },
        { month: 'Feb', amount: 2850000 },
        { month: 'Mar', amount: 2950000 },
        { month: 'Apr', amount: 3000000 },
        { month: 'May', amount: 3100000 },
        { month: 'Jun', amount: 3150000 },
      ],
      breakdown: [
        { category: 'Base Salary', amount: 2100000, percentage: 66.7 },
        { category: 'Benefits', amount: 470000, percentage: 14.9 },
        { category: 'Overtime', amount: 310000, percentage: 9.8 },
        { category: 'Statutory', amount: 270000, percentage: 8.6 },
      ],
      budget: { actual: 3150000, budget: 3100000, variance: 50000 },
      branchComparison: [
        { branch: 'Kisumu', totalPayroll: 3150000, avgPerEmployee: 112500 },
      ],
    },
    compliance: {
      status: [
        { category: 'PAYE', filed: 12, pending: 0, total: 12 },
        { category: 'NSSF', filed: 12, pending: 0, total: 12 },
        { category: 'NHIF/SHIF', filed: 11, pending: 1, total: 12 },
        { category: 'Housing Levy', filed: 10, pending: 2, total: 12 },
      ],
      trend: [
        { month: 'Jan', amount: 70000 },
        { month: 'Feb', amount: 73000 },
        { month: 'Mar', amount: 76000 },
        { month: 'Apr', amount: 78000 },
        { month: 'May', amount: 81000 },
        { month: 'Jun', amount: 84000 },
      ],
      flags: [
        { branch: 'Kisumu', issue: 'NHIF pending for June', status: 'pending' },
      ],
      overallScore: 97.0,
    },
    benefits: {
      summary: [
        { category: 'Medical Insurance', utilization: 72, cost: 1500000, eligible: 280 },
        { category: 'Pension', utilization: 65, cost: 1100000, eligible: 280 },
        { category: 'Paid Leave', utilization: 52, cost: 700000, eligible: 280 },
        { category: 'Wellness', utilization: 38, cost: 350000, eligible: 280 },
      ],
      totalCost: 3650000,
      avgUtilization: 58,
    },
    performance: {
      distribution: [
        { rating: '5 - Exceptional', count: 30, percentage: 10.7 },
        { rating: '4 - Exceeds', count: 65, percentage: 23.2 },
        { rating: '3 - Meets', count: 110, percentage: 39.3 },
        { rating: '2 - Needs Improvement', count: 55, percentage: 19.6 },
        { rating: '1 - Underperforming', count: 20, percentage: 7.1 },
      ],
      departmentComparison: [
        { department: 'Operations', avgScore: 4.1 },
        { department: 'Sales', avgScore: 3.9 },
        { department: 'Customer Support', avgScore: 3.8 },
      ],
      trend: [
        { cycle: 'Q1 2025', avgScore: 3.8 },
        { cycle: 'Q2 2025', avgScore: 3.9 },
        { cycle: 'Q3 2025', avgScore: 4.0 },
        { cycle: 'Q4 2025', avgScore: 4.0 },
        { cycle: 'Q1 2026', avgScore: 4.0 },
      ],
      overallAvg: 4.0,
    },
  },
  'Remote Units': {
    summary: {
      totalEmployees: 238,
      totalPayroll: 'KES 15.9M',
      complianceScore: 96.0,
      benefitsUtilization: 55,
      turnoverRate: 8.8,
      avgPerformance: 3.8,
    },
    workforce: {
      headcount: [
        { month: 'Jan', total: 225, newHires: 8, exits: 4 },
        { month: 'Feb', total: 228, newHires: 6, exits: 3 },
        { month: 'Mar', total: 230, newHires: 5, exits: 3 },
        { month: 'Apr', total: 233, newHires: 7, exits: 4 },
        { month: 'May', total: 235, newHires: 4, exits: 2 },
        { month: 'Jun', total: 238, newHires: 5, exits: 2 },
      ],
      turnover: { rate: 8.8, trend: 'up' },
      tenure: { average: 3.5, distribution: [{ label: '0-2 yrs', value: 40 }, { label: '3-5 yrs', value: 35 }, { label: '5+ yrs', value: 25 }] },
      departments: [
        { name: 'Engineering', headcount: 80, spanOfControl: 6 },
        { name: 'Sales', headcount: 70, spanOfControl: 5 },
        { name: 'Customer Support', headcount: 88, spanOfControl: 5 },
      ],
      diversity: [
        { category: 'Senior Leadership', count: 6, percentage: 2.5 },
        { category: 'Management', count: 30, percentage: 12.6 },
        { category: 'Professional', count: 100, percentage: 42.0 },
        { category: 'Support', count: 102, percentage: 42.9 },
      ],
    },
    payroll: {
      total: [
        { month: 'Jan', amount: 2200000 },
        { month: 'Feb', amount: 2280000 },
        { month: 'Mar', amount: 2350000 },
        { month: 'Apr', amount: 2400000 },
        { month: 'May', amount: 2500000 },
        { month: 'Jun', amount: 2550000 },
      ],
      breakdown: [
        { category: 'Base Salary', amount: 1700000, percentage: 66.7 },
        { category: 'Benefits', amount: 380000, percentage: 14.9 },
        { category: 'Overtime', amount: 250000, percentage: 9.8 },
        { category: 'Statutory', amount: 220000, percentage: 8.6 },
      ],
      budget: { actual: 2550000, budget: 2500000, variance: 50000 },
      branchComparison: [
        { branch: 'Remote Units', totalPayroll: 2550000, avgPerEmployee: 107000 },
      ],
    },
    compliance: {
      status: [
        { category: 'PAYE', filed: 12, pending: 0, total: 12 },
        { category: 'NSSF', filed: 10, pending: 2, total: 12 },
        { category: 'NHIF/SHIF', filed: 11, pending: 1, total: 12 },
        { category: 'Housing Levy', filed: 9, pending: 3, total: 12 },
      ],
      trend: [
        { month: 'Jan', amount: 60000 },
        { month: 'Feb', amount: 63000 },
        { month: 'Mar', amount: 66000 },
        { month: 'Apr', amount: 68000 },
        { month: 'May', amount: 71000 },
        { month: 'Jun', amount: 74000 },
      ],
      flags: [
        { branch: 'Remote Units', issue: 'NSSF and Housing Levy pending', status: 'pending' },
      ],
      overallScore: 96.0,
    },
    benefits: {
      summary: [
        { category: 'Medical Insurance', utilization: 68, cost: 1200000, eligible: 238 },
        { category: 'Pension', utilization: 60, cost: 900000, eligible: 238 },
        { category: 'Paid Leave', utilization: 50, cost: 600000, eligible: 238 },
        { category: 'Wellness', utilization: 35, cost: 250000, eligible: 238 },
      ],
      totalCost: 2950000,
      avgUtilization: 55,
    },
    performance: {
      distribution: [
        { rating: '5 - Exceptional', count: 22, percentage: 9.2 },
        { rating: '4 - Exceeds', count: 55, percentage: 23.1 },
        { rating: '3 - Meets', count: 95, percentage: 39.9 },
        { rating: '2 - Needs Improvement', count: 50, percentage: 21.0 },
        { rating: '1 - Underperforming', count: 16, percentage: 6.7 },
      ],
      departmentComparison: [
        { department: 'Engineering', avgScore: 3.9 },
        { department: 'Sales', avgScore: 3.7 },
        { department: 'Customer Support', avgScore: 3.8 },
      ],
      trend: [
        { cycle: 'Q1 2025', avgScore: 3.6 },
        { cycle: 'Q2 2025', avgScore: 3.7 },
        { cycle: 'Q3 2025', avgScore: 3.8 },
        { cycle: 'Q4 2025', avgScore: 3.8 },
        { cycle: 'Q1 2026', avgScore: 3.8 },
      ],
      overallAvg: 3.8,
    },
  },
  'Eldoret': {
    summary: {
      totalEmployees: 200,
      totalPayroll: 'KES 13.5M',
      complianceScore: 92.0,
      benefitsUtilization: 50,
      turnoverRate: 10.0,
      avgPerformance: 3.7,
    },
    workforce: {
      headcount: [
        { month: 'Jan', total: 190, newHires: 5, exits: 3 },
        { month: 'Feb', total: 192, newHires: 4, exits: 2 },
        { month: 'Mar', total: 194, newHires: 3, exits: 1 },
        { month: 'Apr', total: 196, newHires: 6, exits: 4 },
        { month: 'May', total: 198, newHires: 4, exits: 2 },
        { month: 'Jun', total: 200, newHires: 3, exits: 1 },
      ],
      turnover: { rate: 10.0, trend: 'up' },
      tenure: { average: 3.2, distribution: [{ label: '0-2 yrs', value: 45 }, { label: '3-5 yrs', value: 30 }, { label: '5+ yrs', value: 25 }] },
      departments: [
        { name: 'Operations', headcount: 90, spanOfControl: 5 },
        { name: 'Sales', headcount: 60, spanOfControl: 4 },
        { name: 'Customer Support', headcount: 50, spanOfControl: 3 },
      ],
      diversity: [
        { category: 'Senior Leadership', count: 5, percentage: 2.5 },
        { category: 'Management', count: 25, percentage: 12.5 },
        { category: 'Professional', count: 80, percentage: 40.0 },
        { category: 'Support', count: 90, percentage: 45.0 },
      ],
    },
    payroll: {
      total: [
        { month: 'Jan', amount: 1800000 },
        { month: 'Feb', amount: 1850000 },
        { month: 'Mar', amount: 1900000 },
        { month: 'Apr', amount: 1950000 },
        { month: 'May', amount: 2000000 },
        { month: 'Jun', amount: 2050000 },
      ],
      breakdown: [
        { category: 'Base Salary', amount: 1360000, percentage: 66.3 },
        { category: 'Benefits', amount: 310000, percentage: 15.1 },
        { category: 'Overtime', amount: 200000, percentage: 9.8 },
        { category: 'Statutory', amount: 180000, percentage: 8.8 },
      ],
      budget: { actual: 2050000, budget: 2000000, variance: 50000 },
      branchComparison: [
        { branch: 'Eldoret', totalPayroll: 2050000, avgPerEmployee: 102500 },
      ],
    },
    compliance: {
      status: [
        { category: 'PAYE', filed: 10, pending: 2, total: 12 },
        { category: 'NSSF', filed: 9, pending: 3, total: 12 },
        { category: 'NHIF/SHIF', filed: 10, pending: 2, total: 12 },
        { category: 'Housing Levy', filed: 8, pending: 4, total: 12 },
      ],
      trend: [
        { month: 'Jan', amount: 50000 },
        { month: 'Feb', amount: 53000 },
        { month: 'Mar', amount: 56000 },
        { month: 'Apr', amount: 58000 },
        { month: 'May', amount: 61000 },
        { month: 'Jun', amount: 64000 },
      ],
      flags: [
        { branch: 'Eldoret', issue: 'Multiple compliance filings overdue', status: 'overdue' },
      ],
      overallScore: 92.0,
    },
    benefits: {
      summary: [
        { category: 'Medical Insurance', utilization: 62, cost: 900000, eligible: 200 },
        { category: 'Pension', utilization: 55, cost: 700000, eligible: 200 },
        { category: 'Paid Leave', utilization: 45, cost: 400000, eligible: 200 },
        { category: 'Wellness', utilization: 30, cost: 200000, eligible: 200 },
      ],
      totalCost: 2200000,
      avgUtilization: 50,
    },
    performance: {
      distribution: [
        { rating: '5 - Exceptional', count: 18, percentage: 9.0 },
        { rating: '4 - Exceeds', count: 45, percentage: 22.5 },
        { rating: '3 - Meets', count: 80, percentage: 40.0 },
        { rating: '2 - Needs Improvement', count: 42, percentage: 21.0 },
        { rating: '1 - Underperforming', count: 15, percentage: 7.5 },
      ],
      departmentComparison: [
        { department: 'Operations', avgScore: 3.8 },
        { department: 'Sales', avgScore: 3.6 },
        { department: 'Customer Support', avgScore: 3.5 },
      ],
      trend: [
        { cycle: 'Q1 2025', avgScore: 3.5 },
        { cycle: 'Q2 2025', avgScore: 3.6 },
        { cycle: 'Q3 2025', avgScore: 3.6 },
        { cycle: 'Q4 2025', avgScore: 3.7 },
        { cycle: 'Q1 2026', avgScore: 3.7 },
      ],
      overallAvg: 3.7,
    },
  },
};

export const useReportsData = ({ timeRange, branch, department, dateRange }: UseReportsDataProps) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 800));

        let branchKey = branch;
        if (!branchData[branchKey]) {
          branchKey = 'all';
        }
        let result = branchData[branchKey];

        setData(result);
        setError(null);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange, branch, department, dateRange]);

  return { data, loading, error };
};