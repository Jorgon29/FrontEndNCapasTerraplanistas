import type { Doctor } from "./Employees";

export const mockDoctors: Doctor[] = [
  {
    id: "1",
    employee_id: "EMP001",
    first_name: "Ana",
    last_name: "Martínez",
    professional_license_number: "MED-1001",
    is_active: true,
    specialties: [
      { id: "s1", licence: "CARD-001", name: "Cardiología", feePerHour: 75 }
    ]
  },
  {
    id: "2",
    employee_id: "EMP002",
    first_name: "Carlos",
    last_name: "López",
    professional_license_number: "MED-1002",
    is_active: true,
    specialties: [
      { id: "s2", licence: "DERM-001", name: "Dermatología", feePerHour: 65 }
    ]
  },
  {
    id: "3",
    employee_id: "EMP003",
    first_name: "María",
    last_name: "González",
    professional_license_number: "MED-1003",
    is_active: true,
    specialties: [
      { id: "s3", licence: "PED-001", name: "Pediatría", feePerHour: 55 }
    ]
  },
  {
    id: "4",
    employee_id: "EMP004",
    first_name: "José",
    last_name: "Ramírez",
    professional_license_number: "MED-1004",
    is_active: true,
    specialties: [
      { id: "s4", licence: "NEUR-001", name: "Neurología", feePerHour: 90 }
    ]
  },
  {
    id: "5",
    employee_id: "EMP005",
    first_name: "Sofía",
    last_name: "Hernández",
    professional_license_number: "MED-1005",
    is_active: true,
    specialties: [
      { id: "s5", licence: "PSIQ-001", name: "Psiquiatría", feePerHour: 80 }
    ]
  },
  {
    id: "6",
    employee_id: "EMP006",
    first_name: "Luis",
    last_name: "Castro",
    professional_license_number: "MED-1006",
    is_active: false,
    specialties: [
      { id: "s6", licence: "OFT-001", name: "Oftalmología", feePerHour: 70 }
    ]
  },
  {
    id: "7",
    employee_id: "EMP007",
    first_name: "Elena",
    last_name: "Morales",
    professional_license_number: "MED-1007",
    is_active: true,
    specialties: [
      { id: "s7", licence: "TRAUM-001", name: "Traumatología", feePerHour: 85 }
    ]
  },
  {
    id: "8",
    employee_id: "EMP008",
    first_name: "Ricardo",
    last_name: "Vargas",
    professional_license_number: "MED-1008",
    is_active: true,
    specialties: [
      { id: "s8", licence: "ENDO-001", name: "Endocrinología", feePerHour: 78 }
    ]
  },
  {
    id: "9",
    employee_id: "EMP009",
    first_name: "Gabriela",
    last_name: "Flores",
    professional_license_number: "MED-1009",
    is_active: true,
    specialties: [
      { id: "s9", licence: "GINE-001", name: "Ginecología", feePerHour: 68 }
    ]
  },
  {
    id: "10",
    employee_id: "EMP010",
    first_name: "Fernando",
    last_name: "Ruiz",
    professional_license_number: "MED-1010",
    is_active: true,
    specialties: [
      { id: "s10", licence: "UROL-001", name: "Urología", feePerHour: 72 }
    ]
  },
  {
    id: "11",
    employee_id: "EMP011",
    first_name: "Patricia",
    last_name: "Méndez",
    professional_license_number: "MED-1011",
    is_active: true,
    specialties: [
      { id: "s11", licence: "ONCO-001", name: "Oncología", feePerHour: 95 }
    ]
  },
  {
    id: "12",
    employee_id: "EMP012",
    first_name: "Miguel",
    last_name: "Ortiz",
    professional_license_number: "MED-1012",
    is_active: true,
    specialties: [
      { id: "s12", licence: "ALERG-001", name: "Alergología", feePerHour: 60 }
    ]
  },
  {
    id: "13",
    employee_id: "EMP013",
    first_name: "Lucía",
    last_name: "Navarro",
    professional_license_number: "MED-1013",
    is_active: true,
    specialties: [
      { id: "s13", licence: "REUM-001", name: "Reumatología", feePerHour: 82 }
    ]
  },
  {
    id: "14",
    employee_id: "EMP014",
    first_name: "Andrés",
    last_name: "Silva",
    professional_license_number: "MED-1014",
    is_active: false,
    specialties: [
      { id: "s14", licence: "NEFRO-001", name: "Nefrología", feePerHour: 88 }
    ]
  },
  {
    id: "15",
    employee_id: "EMP015",
    first_name: "Valeria",
    last_name: "Rojas",
    professional_license_number: "MED-1015",
    is_active: true,
    specialties: [
      { id: "s15", licence: "GASTRO-001", name: "Gastroenterología", feePerHour: 76 }
    ]
  },
  {
    id: "16",
    employee_id: "EMP016",
    first_name: "Javier",
    last_name: "Pérez",
    professional_license_number: "MED-1016",
    is_active: true,
    specialties: [
      { id: "s16", licence: "OTOR-001", name: "Otorrinolaringología", feePerHour: 73 }
    ]
  },
  {
    id: "17",
    employee_id: "EMP017",
    first_name: "Daniela",
    last_name: "Aguilar",
    professional_license_number: "MED-1017",
    is_active: true,
    specialties: [
      { id: "s17", licence: "HEM-001", name: "Hematología", feePerHour: 89 }
    ]
  },
  {
    id: "18",
    employee_id: "EMP018",
    first_name: "Roberto",
    last_name: "Cruz",
    professional_license_number: "MED-1018",
    is_active: true,
    specialties: [
      { id: "s18", licence: "INF-001", name: "Infectología", feePerHour: 74 }
    ]
  },
  {
    id: "19",
    employee_id: "EMP019",
    first_name: "Natalia",
    last_name: "Torres",
    professional_license_number: "MED-1019",
    is_active: true,
    specialties: [
      { id: "s19", licence: "GER-001", name: "Geriatría", feePerHour: 62 }
    ]
  },
  {
    id: "20",
    employee_id: "EMP020",
    first_name: "Diego",
    last_name: "Alvarado",
    professional_license_number: "MED-1020",
    is_active: true,
    specialties: [
      { id: "s20", licence: "MEDGEN-001", name: "Medicina General", feePerHour: 50 }
    ]
  }
];