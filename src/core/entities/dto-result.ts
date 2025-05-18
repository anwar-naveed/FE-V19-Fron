import { ErrorObject } from "./error-object";
import { KeyValuePair } from "./key-value-pair";

export interface DtoResult<T extends any> {
    Data: T;
    Errors: ErrorObject[] | string;
    IsSuccessful: boolean;
    KeyValue: any;
    Headers: any;
}