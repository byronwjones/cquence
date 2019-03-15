import { NormalMap } from "../types/primary-types";

export interface ICallbackComposedFunctionParameters {
    args?: NormalMap;
    success?: (value: any) => void;
    error?: (errorDetail: string | Error) => void;
    update?: (updateDetail: any) => void;
    completed?: () => void
}

                        