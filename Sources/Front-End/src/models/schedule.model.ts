interface IDay {
    startH: number;
    endH: number;
    specialHours: string;
}

export interface ISchedule {
    mon: Partial<IDay>;
    tue: Partial<IDay>;
    wed: Partial<IDay>;
    thu: Partial<IDay>;
    fri: Partial<IDay>;
    sat: Partial<IDay>;
    sun: Partial<IDay>;
}
