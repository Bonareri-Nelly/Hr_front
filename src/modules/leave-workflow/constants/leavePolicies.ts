export const leavePolicies = {
  annual: {
    label: "Annual Leave",
    noticeDays: 7,
    emergency: false,
    reasons: [
      "Vacation",
      "Family Time",
      "Personal Rest",
      "Travel",
      "Religious Holiday",
      "Other",
    ],
  },

  sick: {
    label: "Sick Leave",
    noticeDays: 0,
    emergency: true,
    reasons: [
      "Illness",
      "Medical Appointment",
      "Hospitalization",
      "Recovery",
      "Other",
    ],
  },

  maternity: {
    label: "Maternity Leave",
    noticeDays: 30,
    emergency: false,
    reasons: [
      "Childbirth",
      "Prenatal Care",
      "Postnatal Recovery",
    ],
  },

  paternity: {
    label: "Paternity Leave",
    noticeDays: 14,
    emergency: false,
    reasons: [
      "Birth of Child",
      "Family Support",
    ],
  },

  compassionate: {
    label: "Compassionate Leave",
    noticeDays: 0,
    emergency: true,
    reasons: [
      "Death of Immediate Family",
      "Funeral Arrangements",
      "Family Emergency",
      "Other",
    ],
  },

  study: {
    label: "Study Leave",
    noticeDays: 14,
    emergency: false,
    reasons: [
      "Examination",
      "Research",
      "Professional Certification",
      "Training",
    ],
  },

  unpaid: {
    label: "Unpaid Leave",
    noticeDays: 7,
    emergency: false,
    reasons: [
      "Personal Commitment",
      "Extended Travel",
      "Family Responsibility",
      "Other",
    ],
  },
} as const;