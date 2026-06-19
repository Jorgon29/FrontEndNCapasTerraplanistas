import { englishStringToDay } from "./DaysOfTheWeek";
import type { Doctor } from "./Employees";

export const mockDoctors: Doctor[] = [
  {
    id: "1",
    employee_id: "EMP001",
    first_name: "Ana",
    last_name: "Martínez",
    professional_license_number: "MED-1001",
    is_active: true,
    email: "ana.martinez@medclinic.com",
    idType: "DNI",
    specialties: [
      {
        id: "spec-1",
        licence: "CARD-001",
        name: "Cardiología",
        feePerHour: 80,
        duration: 60,
        officeHours: [
          { id: "oh-1-1", day: englishStringToDay("MONDAY"), startTime: "08:00", endTime: "16:00" },
          { id: "oh-1-2", day: englishStringToDay("WEDNESDAY"), startTime: "08:00", endTime: "16:00" }
        ]
      }
    ]
  },

  {
    id: "2",
    employee_id: "EMP002",
    first_name: "Carlos",
    last_name: "López",
    professional_license_number: "MED-1002",
    is_active: true,
    email: "carlos.lopez@medclinic.com",
    idType: "PASSPORT",
    specialties: [
      {
        id: "spec-2",
        licence: "DERM-001",
        name: "Dermatología",
        feePerHour: 65,
        duration: 30,
        officeHours: [
          { id: "oh-2-1", day: englishStringToDay("TUESDAY"), startTime: "09:00", endTime: "17:00" },
          { id: "oh-2-2", day: englishStringToDay("THURSDAY"), startTime: "09:00", endTime: "17:00" }
        ]
      }
    ]
  },

  {
    id: "3",
    employee_id: "EMP003",
    first_name: "María",
    last_name: "González",
    professional_license_number: "MED-1003",
    is_active: true,
    email: "maria.gonzalez@medclinic.com",
    idType: "DNI",
    specialties: [
      {
        id: "spec-3",
        licence: "PED-001",
        name: "Pediatría",
        feePerHour: 55,
        duration: 45,
        officeHours: [
          { id: "oh-3-1", day: englishStringToDay("MONDAY"), startTime: "07:00", endTime: "15:00" },
          { id: "oh-3-2", day: englishStringToDay("FRIDAY"), startTime: "07:00", endTime: "15:00" }
        ]
      }
    ]
  },

  {
    id: "4",
    employee_id: "EMP004",
    first_name: "José",
    last_name: "Ramírez",
    professional_license_number: "MED-1004",
    is_active: true,
    email: "jose.ramirez@medclinic.com",
    idType: "DNI",
    specialties: [
      {
        id: "spec-4",
        licence: "NEUR-001",
        name: "Neurología",
        feePerHour: 95,
        duration: 60,
        officeHours: [
          { id: "oh-4-1", day: englishStringToDay("MONDAY"), startTime: "10:00", endTime: "18:00" }
        ]
      }
    ]
  },

  {
    id: "5",
    employee_id: "EMP005",
    first_name: "Sofía",
    last_name: "Hernández",
    professional_license_number: "MED-1005",
    is_active: true,
    email: "sofia.hernandez@medclinic.com",
    idType: "PASSPORT",
    specialties: [
      {
        id: "spec-5",
        licence: "PSY-001",
        name: "Psiquiatría",
        feePerHour: 85,
        duration: 60,
        officeHours: [
          { id: "oh-5-1", day: englishStringToDay("TUESDAY"), startTime: "08:00", endTime: "14:00" },
          { id: "oh-5-2", day: englishStringToDay("THURSDAY"), startTime: "08:00", endTime: "14:00" }
        ]
      }
    ]
  },

  {
    id: "6",
    employee_id: "EMP006",
    first_name: "Luis",
    last_name: "Castro",
    professional_license_number: "MED-1006",
    is_active: false,
    email: "luis.castro@medclinic.com",
    idType: "DNI",
    specialties: [
      {
        id: "spec-6",
        licence: "OFT-001",
        name: "Oftalmología",
        feePerHour: 70,
        duration: 30,
        officeHours: [
          { id: "oh-6-1", day: englishStringToDay("WEDNESDAY"), startTime: "08:00", endTime: "12:00" }
        ]
      },
      {
        id: "spec-7",
        licence: "TRAU-001",
        name: "Traumatología",
        feePerHour: 90,
        duration: 45,
        officeHours: [
          { id: "oh-7-1", day: englishStringToDay("MONDAY"), startTime: "09:00", endTime: "17:00" }
        ]
      }
    ]
  },

  {
    id: "7",
    employee_id: "EMP007",
    first_name: "Elena",
    last_name: "Morales",
    professional_license_number: "MED-1007",
    is_active: true,
    email: "elena.morales@medclinic.com",
    idType: "DNI",
    specialties: [
      {
        id: "spec-7",
        licence: "TRAU-001",
        name: "Traumatología",
        feePerHour: 90,
        duration: 45,
        officeHours: [
          { id: "oh-7-1", day: englishStringToDay("MONDAY"), startTime: "09:00", endTime: "17:00" }
        ]
      }
    ]
  },

  {
    id: "8",
    employee_id: "EMP008",
    first_name: "Ricardo",
    last_name: "Vargas",
    professional_license_number: "MED-1008",
    is_active: true,
    email: "ricardo.vargas@medclinic.com",
    idType: "PASSPORT",
    specialties: [
      {
        id: "spec-8",
        licence: "ENDO-001",
        name: "Endocrinología",
        feePerHour: 75,
        duration: 45,
        officeHours: [
          { id: "oh-8-1", day: englishStringToDay("TUESDAY"), startTime: "08:00", endTime: "16:00" }
        ]
      }
    ]
  },

  {
    id: "9",
    employee_id: "EMP009",
    first_name: "Gabriela",
    last_name: "Flores",
    professional_license_number: "MED-1009",
    is_active: true,
    email: "gabriela.flores@medclinic.com",
    idType: "DNI",
    specialties: [
      {
        id: "spec-9",
        licence: "GYN-001",
        name: "Ginecología",
        feePerHour: 70,
        duration: 60,
        officeHours: [
          { id: "oh-9-1", day: englishStringToDay("FRIDAY"), startTime: "08:00", endTime: "16:00" }
        ]
      }
    ]
  },

  {
    id: "10",
    employee_id: "EMP010",
    first_name: "Fernando",
    last_name: "Ruiz",
    professional_license_number: "MED-1010",
    is_active: true,
    email: "fernando.ruiz@medclinic.com",
    idType: "DNI",
    specialties: [
      {
        id: "spec-10",
        licence: "URO-001",
        name: "Urología",
        feePerHour: 80,
        duration: 60,
        officeHours: [
          { id: "oh-10-1", day: englishStringToDay("THURSDAY"), startTime: "10:00", endTime: "18:00" }
        ]
      }
    ]
  },

  {
    id: "11",
    employee_id: "EMP011",
    first_name: "Patricia",
    last_name: "Méndez",
    professional_license_number: "MED-1011",
    is_active: true,
    email: "patricia.mendez@medclinic.com",
    idType: "PASSPORT",
    specialties: [
      {
        id: "spec-11",
        licence: "ONC-001",
        name: "Oncología",
        feePerHour: 110,
        duration: 60,
        officeHours: [
          { id: "oh-11-1", day: englishStringToDay("MONDAY"), startTime: "08:00", endTime: "12:00" }
        ]
      }
    ]
  },

  {
    id: "12",
    employee_id: "EMP012",
    first_name: "Miguel",
    last_name: "Ortiz",
    professional_license_number: "MED-1012",
    is_active: true,
    email: "miguel.ortiz@medclinic.com",
    idType: "DNI",
    specialties: [
      {
        id: "spec-12",
        licence: "ALL-001",
        name: "Alergología",
        feePerHour: 60,
        duration: 30,
        officeHours: [
          { id: "oh-12-1", day: englishStringToDay("TUESDAY"), startTime: "08:00", endTime: "15:00" }
        ]
      }
    ]
  },

  {
    id: "13",
    employee_id: "EMP013",
    first_name: "Lucía",
    last_name: "Navarro",
    professional_license_number: "MED-1013",
    is_active: true,
    email: "lucia.navarro@medclinic.com",
    idType: "DNI",
    specialties: [
      {
        id: "spec-13",
        licence: "RHE-001",
        name: "Reumatología",
        feePerHour: 85,
        duration: 45,
        officeHours: [
          { id: "oh-13-1", day: englishStringToDay("WEDNESDAY"), startTime: "09:00", endTime: "17:00" }
        ]
      }
    ]
  },

  {
    id: "14",
    employee_id: "EMP014",
    first_name: "Andrés",
    last_name: "Silva",
    professional_license_number: "MED-1014",
    is_active: false,
    email: "andres.silva@medclinic.com",
    idType: "PASSPORT",
    specialties: [
      {
        id: "spec-14",
        licence: "NEPH-001",
        name: "Nefrología",
        feePerHour: 95,
        duration: 60,
        officeHours: [
          { id: "oh-14-1", day: englishStringToDay("FRIDAY"), startTime: "08:00", endTime: "14:00" }
        ]
      }
    ]
  },

  {
    id: "15",
    employee_id: "EMP015",
    first_name: "Valeria",
    last_name: "Rojas",
    professional_license_number: "MED-1015",
    is_active: true,
    email: "valeria.rojas@medclinic.com",
    idType: "DNI",
    specialties: [
      {
        id: "spec-15",
        licence: "GAST-001",
        name: "Gastroenterología",
        feePerHour: 78,
        duration: 45,
        officeHours: [
          { id: "oh-15-1", day: englishStringToDay("MONDAY"), startTime: "08:00", endTime: "17:00" }
        ]
      }
    ]
  },

  {
    id: "16",
    employee_id: "EMP016",
    first_name: "Javier",
    last_name: "Pérez",
    professional_license_number: "MED-1016",
    is_active: true,
    email: "javier.perez@medclinic.com",
    idType: "DNI",
    specialties: [
      {
        id: "spec-16",
        licence: "ENT-001",
        name: "Otorrinolaringología",
        feePerHour: 72,
        duration: 30,
        officeHours: [
          { id: "oh-16-1", day: englishStringToDay("THURSDAY"), startTime: "08:00", endTime: "16:00" }
        ]
      }
    ]
  },

  {
    id: "17",
    employee_id: "EMP017",
    first_name: "Daniela",
    last_name: "Aguilar",
    professional_license_number: "MED-1017",
    is_active: true,
    email: "daniela.aguilar@medclinic.com",
    idType: "PASSPORT",
    specialties: [
      {
        id: "spec-17",
        licence: "HEMA-001",
        name: "Hematología",
        feePerHour: 88,
        duration: 60,
        officeHours: [
          { id: "oh-17-1", day: englishStringToDay("WEDNESDAY"), startTime: "09:00", endTime: "17:00" }
        ]
      }
    ]
  },

  {
    id: "18",
    employee_id: "EMP018",
    first_name: "Roberto",
    last_name: "Cruz",
    professional_license_number: "MED-1018",
    is_active: true,
    email: "roberto.cruz@medclinic.com",
    idType: "DNI",
    specialties: [
      {
        id: "spec-18",
        licence: "INF-001",
        name: "Infectología",
        feePerHour: 76,
        duration: 45,
        officeHours: [
          { id: "oh-18-1", day: englishStringToDay("MONDAY"), startTime: "08:00", endTime: "15:00" }
        ]
      }
    ]
  },

  {
    id: "19",
    employee_id: "EMP019",
    first_name: "Natalia",
    last_name: "Torres",
    professional_license_number: "MED-1019",
    is_active: true,
    email: "natalia.torres@medclinic.com",
    idType: "DNI",
    specialties: [
      {
        id: "spec-19",
        licence: "GER-001",
        name: "Geriatría",
        feePerHour: 65,
        duration: 60,
        officeHours: [
          { id: "oh-19-1", day: englishStringToDay("FRIDAY"), startTime: "08:00", endTime: "13:00" }
        ]
      }
    ]
  },

  {
    id: "20",
    employee_id: "EMP020",
    first_name: "Diego",
    last_name: "Alvarado",
    professional_license_number: "MED-1020",
    is_active: true,
    email: "diego.alvarado@medclinic.com",
    idType: "DNI",
    specialties: [
      {
        id: "spec-20",
        licence: "GEN-001",
        name: "Medicina General",
        feePerHour: 50,
        duration: 30,
        officeHours: [
          { id: "oh-20-1", day: englishStringToDay("MONDAY"), startTime: "07:00", endTime: "18:00" },
          { id: "oh-20-2", day: englishStringToDay("TUESDAY"), startTime: "07:00", endTime: "18:00" },
          { id: "oh-20-3", day: englishStringToDay("WEDNESDAY"), startTime: "07:00", endTime: "18:00" }
        ]
      }
    ]
  }
];