import { IAddress, ISchedule, IService } from '.';

export interface INotary {
    isSupportedForeignCitizens: boolean;
    services: IService[];
    personName: string;
    phoneNumber: string;
    schedule: ISchedule;
    address: IAddress;
    languages?: string[];
}