import type { Doctor } from "./Employees";


export const doctors: Doctor[] = [
  {
    id: 1,
    first_name: "Juan",
    last_name: "Pérez",
    professional_license_number: "MED-001",
    fee_per_hour: 50,
    specialties: [
      {
        id: 1,
        code: "CARD",
        name: "Cardiología",
      },
    ],
  },

  {
    id: 2,
    first_name: "Ana",
    last_name: "Martínez",
    professional_license_number: "MED-002",
    fee_per_hour: 75,
    specialties: [
      {
        id: 2,
        code: "PED",
        name: "Pediatría",
      },
      {
        id: 3,
        code: "DERM",
        name: "Dermatología",
      },
    ],
  },

  {
    id: 3,
    first_name: "Carlos",
    last_name: "Ramírez",
    professional_license_number: "MED-003",
    fee_per_hour: 90,
    specialties: [
      {
        id: 4,
        code: "NEUR",
        name: "Neurología",
      },
    ],
  },

  {
    id: 4,
    first_name: "Sofía",
    last_name: "Gómez",
    professional_license_number: "MED-004",
    fee_per_hour: 60,
    specialties: [
      {
        id: 5,
        code: "PSIQ",
        name: "Psiquiatría",
      },
    ],
  },

  {
    id: 5,
    first_name: "Miguel",
    last_name: "Castro",
    professional_license_number: "MED-005",
    fee_per_hour: 55,
    specialties: [
      {
        id: 6,
        code: "TRAU",
        name: "Traumatología",
      },
    ],
  },

  {
    id: 6,
    first_name: "Laura",
    last_name: "Fernández",
    professional_license_number: "MED-006",
    fee_per_hour: 80,
    specialties: [
      {
        id: 7,
        code: "GINE",
        name: "Ginecología",
      },
    ],
  },

  {
    id: 7,
    first_name: "Ricardo",
    last_name: "López",
    professional_license_number: "MED-007",
    fee_per_hour: 95,
    specialties: [
      {
        id: 8,
        code: "ONCO",
        name: "Oncología",
      },
    ],
  },

  {
    id: 8,
    first_name: "Valeria",
    last_name: "Morales",
    professional_license_number: "MED-008",
    fee_per_hour: 65,
    specialties: [
      {
        id: 9,
        code: "ENDO",
        name: "Endocrinología",
      },
    ],
  },

  {
    id: 9,
    first_name: "Andrés",
    last_name: "Ruiz",
    professional_license_number: "MED-009",
    fee_per_hour: 70,
    specialties: [
      {
        id: 10,
        code: "OFTA",
        name: "Oftalmología",
      },
    ],
  },

  {
    id: 10,
    first_name: "Daniela",
    last_name: "Herrera",
    professional_license_number: "MED-010",
    fee_per_hour: 85,
    specialties: [
      {
        id: 11,
        code: "OTOR",
        name: "Otorrinolaringología",
      },
    ],
  },

  {
    id: 11,
    first_name: "Fernando",
    last_name: "Silva",
    professional_license_number: "MED-011",
    fee_per_hour: 100,
    specialties: [
      {
        id: 12,
        code: "UROL",
        name: "Urología",
      },
    ],
  },

  {
    id: 12,
    first_name: "Camila",
    last_name: "Navarro",
    professional_license_number: "MED-012",
    fee_per_hour: 72,
    specialties: [
      {
        id: 13,
        code: "REUM",
        name: "Reumatología",
      },
    ],
  },

  {
    id: 13,
    first_name: "Javier",
    last_name: "Torres",
    professional_license_number: "MED-013",
    fee_per_hour: 58,
    specialties: [
      {
        id: 14,
        code: "ALER",
        name: "Alergología",
      },
    ],
  },

  {
    id: 14,
    first_name: "Patricia",
    last_name: "Rojas",
    professional_license_number: "MED-014",
    fee_per_hour: 92,
    specialties: [
      {
        id: 15,
        code: "NUTR",
        name: "Nutrición",
      },
      {
        id: 9,
        code: "ENDO",
        name: "Endocrinología",
      },
    ],
  },

  {
    id: 15,
    first_name: "Luis",
    last_name: "Mendoza",
    professional_license_number: "MED-015",
    fee_per_hour: 68,
    specialties: [
      {
        id: 16,
        code: "CIRG",
        name: "Cirugía General",
      },
    ],
  },

  {
    id: 16,
    first_name: "Elena",
    last_name: "Vega",
    professional_license_number: "MED-016",
    fee_per_hour: 74,
    specialties: [
      {
        id: 17,
        code: "HEMA",
        name: "Hematología",
      },
    ],
  },

  {
    id: 17,
    first_name: "Roberto",
    last_name: "Aguilar",
    professional_license_number: "MED-017",
    fee_per_hour: 88,
    specialties: [
      {
        id: 18,
        code: "NEFR",
        name: "Nefrología",
      },
    ],
  },

  {
    id: 18,
    first_name: "Gabriela",
    last_name: "Cruz",
    professional_license_number: "MED-018",
    fee_per_hour: 77,
    specialties: [
      {
        id: 19,
        code: "INFEC",
        name: "Infectología",
      },
    ],
  },

  {
    id: 19,
    first_name: "Tomás",
    last_name: "Ortega",
    professional_license_number: "MED-019",
    fee_per_hour: 83,
    specialties: [
      {
        id: 20,
        code: "GERI",
        name: "Geriatría",
      },
    ],
  },

  {
    id: 20,
    first_name: "Lucía",
    last_name: "Flores",
    professional_license_number: "MED-020",
    fee_per_hour: 69,
    specialties: [
      {
        id: 21,
        code: "PULM",
        name: "Neumología",
      },
      {
        id: 1,
        code: "CARD",
        name: "Cardiología",
      },
    ],
  },
];