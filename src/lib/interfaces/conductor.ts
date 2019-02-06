import { NormalMap } from "../types/primary-types";

export interface IConductor {
    lets: NormalMap;
    error: (exception?: string | Error) => void;
    next: () => void;
    return: (returnValue: any) => void;
    update: (updateInfo: any) => void
    [key: string]: any;
}