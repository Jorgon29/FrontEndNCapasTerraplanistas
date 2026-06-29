export default interface Prescription {
  id: string;
  appointmentId: string;
  medicineId: string;
  medicineSnapshot?: {
    brandName?: string;
    genericName?: string;
    atcCode?: string;
  };
  medicineName?: string;
  dosageInstructions: string;
  digitalSignature?: string;
  usageCount?: number;
  maxUsages: number;
  createdAt?: string;
  createdBy?: string;
}