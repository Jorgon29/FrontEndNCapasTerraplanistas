export default interface MedicalRecord {
  diagnosisCode: string;
  diagnosisDescription: string;
  clinicalNotes: string;
  physicalExamination: string;
  followUpNote?: string;
}