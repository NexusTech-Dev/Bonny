export interface HealthRecord {
    id: string;
    animalId: string;
    employeeId: string;
    applicationDate: string;
    nextApplicationDate?: string | null;
    nextDoseDate?: string | null;
    notes?: string;
    vaccineId?: string;
    antiparasiticId?: string;
    dewormingId?: string;
    booster1?: string | null;
    booster2?: string | null;
    booster3?: string | null;
}
