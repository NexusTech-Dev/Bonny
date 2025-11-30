function getAnimalsWithLate(animals: any[], records: any[], field: string) {
    const today = new Date();

    return animals.filter(animal => {
        const r = records.filter(x => x.animalId === animal.id);

        if (r.length === 0) return true;

        return r.some(x =>
            x[field] && new Date(x[field]) < today
        );
    });
}

export const getAnimalsWithLateVaccines = (animals: any[], records: any[]) =>
    getAnimalsWithLate(animals, records, "nextDoseDate");

export const getAnimalsWithLateAntiparasitics = (animals: any[], records: any[]) =>
    getAnimalsWithLate(animals, records, "nextApplicationDate");

export const getAnimalsWithLateDeworming = (animals: any[], records: any[]) =>
    getAnimalsWithLate(animals, records, "nextApplicationDate");
