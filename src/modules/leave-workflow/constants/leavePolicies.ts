export const leavePolicies = {
  annual: {
    label: "Annual Leave",
    noticeDays: 7,
    emergency: false,

    fixedDays: null,
    editableDays: true,
    countsWeekends: false,
    countsPublicHolidays: false,
    requiresSubstitute: true,

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

    fixedDays: null,
    editableDays: true,
    countsWeekends: false,
    countsPublicHolidays: false,
    requiresSubstitute: false,

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

    fixedDays: 90,
    editableDays: false,
    countsWeekends: true,
    countsPublicHolidays: true,
    requiresSubstitute: true,

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

    fixedDays: 21,
    editableDays: false,
    countsWeekends: true,
    countsPublicHolidays: true,
    requiresSubstitute: true,

    reasons: [
      "Birth of Child",
      "Family Support",
    ],
  },

  compassionate: {
    label: "Compassionate Leave",
    noticeDays: 0,
    emergency: true,

    fixedDays: null,
    editableDays: true,
    countsWeekends: false,
    countsPublicHolidays: false,
    requiresSubstitute: false,

    reasons: [
      "Death of Immediate Family",
      "Funeral Arrangements",
      "Family Emergency",
      "Other",
    ],
  },

  study: {
    label: "Study Leave",
    noticeDays: 30,
    emergency: false,

    fixedDays: null,
    editableDays: true,
    countsWeekends: false,
    countsPublicHolidays: false,
    requiresSubstitute: true,

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

    fixedDays: null,
    editableDays: true,
    countsWeekends: false,
    countsPublicHolidays: false,
    requiresSubstitute: true,

    reasons: [
      "Personal Commitment",
      "Extended Travel",
      "Family Responsibility",
      "Other",
    ],
  },
} as const;