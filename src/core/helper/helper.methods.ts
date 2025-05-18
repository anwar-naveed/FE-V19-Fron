import { Injectable } from '@angular/core';
import { Buffer } from "buffer";

@Injectable({
    providedIn: 'root'
})

export class HelperMethods {
    static CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
    
    static MONTHS = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    static EncodeBase64(text: string) {
        return Buffer.from(text).toString('base64');
      }
    
    static DecodeBase64(encodedText: string) {
    return Buffer.from(encodedText, 'base64').toString('binary');
    }
    
    static RemoveFromArrByIndex(Arr: any[], index: number) {
        return [...Arr.slice(0, index), ...Arr.splice(index + 1, Arr.length)]
    }

    static IsCharEvent(event: any): boolean {
        const key = event.key.toLowerCase();
        return !(HelperMethods.CHARS.indexOf(key) === -1) || key === 'backspace';
    }

    static GetDate(dateString: string): string {
        if (dateString != null && dateString !== '') {
            const a = new Date(dateString);
            const month: string = HelperMethods.MONTHS[a.getMonth()];
            const day: number = a.getDate();
            const year: string = a.getFullYear().toString().substring(-2);
            return (day < 10 ? '0' + day : day) + ' ' + month + ' ' + year;
        }
        return null as any;
    }

    static SetDate(dateObject: Date): string {
        if (!dateObject) {
            return null  as any; //used as any from stack overflow
        }
        const date = new Date(dateObject),
        yr = date.getFullYear(),
        month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
        day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
        newDate = yr + '-' + month + '-' + day; //can be any format as required.
        
        return newDate + 'T00:00:00';
    }

    static SetDateWithTime(dateObject: Date, timeStr?: string): string {
        if (!dateObject) {
            return null  as any; //used as any from stack overflow
        }

        const date = new Date(dateObject),
        yr = date.getFullYear(),
        month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
        day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
        h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
        m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
        s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds(),
        newDate = yr + '-' + month + '-' + day; //can be any format as required.

        if (timeStr) {
            return newDate + 'T' + timeStr;
        }
        return newDate + 'T' + h + ':' + m + ':' + s;
    }

    static SearchByUniqueKeyInData(searchBy: string, searchValue: string, searchArray: any) {
        if (searchBy != null && searchValue != null) {
            return searchArray.find((item: any) => {
                return ((item[searchBy] != null ? (item[searchBy] + '') : '') === (searchValue + ''));
            });
        } else {
            return null;
        }
    }

    static SearchInAllKeysInArray(searchPhrase: string, arrayToSearch: any[]) {
        return arrayToSearch.filter((item) => {
            let searched = false;
            Object.keys(item).forEach((key) => {
                if ((item[key] + '').toUpperCase().indexOf(searchPhrase.toUpperCase()) !== -1) {
                    searched = true;
                    return searched;
                }
                return searched;
            });
            return searched;
        })
    }

    static SearchBySpecificKeyInData(searchBy: string, searchValue: string, searchArray: any[]) {
        if (searchBy != null && searchValue != null) {
            return searchArray.filter((item) => {
                return ((item[searchBy] != null ? (item[searchBy] + '') : '')
                .toUpperCase()
                .includes((searchValue + '')
                .toUpperCase()));
            });
        } else {
            return [...searchArray];
        }
    }

    static GetTotal(data: any[], property: string): number {
        let total = 0;
        if (data) {
            data.forEach((dataVal) => {
                total += parseInt(dataVal[property]);
            });
        }
        if (!isFinite(total)) {
            total = 0;
        }
        return total;
    }

    static GetDecimalTotal(data: any[], property: string): number {
        let total = 0;
        if (data) {
            data.forEach((dataVal) => {
                total += parseFloat(dataVal[property]);
            });
        }
        if (!isFinite(total)) {
            total = 0;
        }
        return total;
    }

    static SortArr(arr: any[], prop: string, isNumeric: boolean = true, asc: boolean = true) {
        if (isNumeric) {
            arr.sort((a, b) => parseFloat(a[prop] + '') - parseFloat(b[prop] + ''));
        } else {
            //Not Correct
            arr.sort();
        }
        // tslint:disable-next-line:no-unused-expression
        if (!asc) {
            arr.reverse;
        }

        return arr;
    }

    static ToCamel(o: any): any {
        let new0, origKey, newKey, value;
        if (o instanceof Array) {
            new0 = [];
            // tslint:disable-next-line:forin
            for (origKey in o) {
                value = o[origKey];
                if (typeof value === 'object') {
                    value = this.ToCamel(value);
                }
                new0.push(value);
            }
        } else {
            new0 = {};
            for (origKey in o) {
                if (o.hasOwnProperty(origKey)) {
                    newKey = (origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey).toString();
                    value = o[origKey];
                    if (value !== null && value.constructor === Object) {
                        value = this.ToCamel(value);
                    }
                    (new0 as any)[newKey] = value; // here used any as it was not working. testing required.
                }
            }
        }
        return new0;
    }

    static ToUpperFirst(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static ToLowerFirst(str: string) {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    static GetLinkPredicate(columnName: string, searchLogic: SearchLogics, searchValue: string) {
        let linkPredicate = "";
        if (!searchValue) {
            return linkPredicate;
        }
        
        switch (searchLogic) {
            case SearchLogics.EQUALS: {
                linkPredicate = columnName + '== "' + searchValue + '"';
                break;
            }
            case SearchLogics.NOTEQUALS: {
                linkPredicate = columnName + '!=' + searchValue;
                break;
            }
            case SearchLogics.LT: {
                linkPredicate = columnName + '>' + searchValue;
                break;
            }
            case SearchLogics.LTE: {
                linkPredicate = columnName + '>=' + searchValue;
                break;
            }
            case SearchLogics.GT: {
                linkPredicate = columnName + '<' + searchValue;
                break;
            }
            case SearchLogics.GTE: {
                linkPredicate = columnName + '<=' + searchValue;
                break;
            }
            case SearchLogics.CONTAINS: {
                linkPredicate = columnName + '.contains("' + searchValue + '")';
                break;
            }
            case SearchLogics.STARTSWITH: {
                linkPredicate = columnName + '.startswith("' + searchValue + '")';
                break;
            }
            case SearchLogics.ENDSWITH: {
                linkPredicate = columnName + '.endswith("' + searchValue + '")';
                break;
            }
            default: {
                break;
            }
        }

        return linkPredicate;
    }

    static GetNewLinkPredicate(columnName: string, searchLogic: SearchLogics, searchValue: string, isQuoted: string) {
        let linkPredicate = "";
        if (!searchValue) {
            return linkPredicate;
        }
        
        switch (searchLogic) {
            case SearchLogics.EQUALS: {
                linkPredicate = `${columnName} == ${isQuoted ? '"' : ""}${searchValue}${isQuoted ? '"' : ""}`;
                break;
            }
            case SearchLogics.NOTEQUALS: {
                linkPredicate = `${columnName} != ${isQuoted ? '"' : ""}${searchValue}${isQuoted ? '"' : ""}`;
                break;
            }
            case SearchLogics.LT: {
                linkPredicate = columnName + '>' + searchValue;
                break;
            }
            case SearchLogics.LTE: {
                linkPredicate = columnName + '>=' + searchValue;
                break;
            }
            case SearchLogics.GT: {
                linkPredicate = columnName + '<' + searchValue;
                break;
            }
            case SearchLogics.GTE: {
                linkPredicate = columnName + '<=' + searchValue;
                break;
            }
            case SearchLogics.CONTAINS: {
                linkPredicate = columnName + '.contains("' + searchValue + '")';
                break;
            }
            case SearchLogics.STARTSWITH: {
                linkPredicate = columnName + '.startswith("' + searchValue + '")';
                break;
            }
            case SearchLogics.ENDSWITH: {
                linkPredicate = columnName + '.endswith("' + searchValue + '")';
                break;
            }
            default: {
                break;
            }
        }

        return linkPredicate;
    }

    static GetObjFromArr(options: any[], item: any, Id: any) {
        const option = Array.isArray(options) ? options.find(op => op[item.valueField] == Id) : null;
        return option ? option[item.displayField] : '';
    }

    static GetObjFromArrWithId(options: any[], item: any, Id: any) {
        const option = Array.isArray(options) ? options.find(op => op[item.valueField] == Id) : null;
        return option ? option[item.displayField] + " (" + option[item.valueField] + ") " : '';
    }

    static RemoveExtraObjects(data: any, propToInclude: string[]) {
        Object.keys(data).forEach((x) => {
            if (propToInclude.includes(x)) {
                if (toString.call(data[x]) === "[object Object]") {
                    Object.keys(data[x]).forEach((y) => {
                        if (propToInclude.includes(x + "." + y)) {
                            if (toString.call(data[x][y]) === "[object Object]") {
                                Object.keys(data[x][y]).forEach((z) => {
                                    if (toString.call(data[x][y][z]) === "[object Object]") {
                                        delete data[x][y][z];
                                    }
                                })
                            } else if (Array.isArray(data[x][y])) {
                                data[x][y].forEach((obj: any) => {
                                    if (toString.call(obj) === "[object Object]") {
                                        Object.keys(obj).forEach((z) => {
                                            if (toString.call(obj[z]) === "[object Object]" || Array.isArray(obj[z])) {
                                                delete obj[z];
                                            }
                                        })
                                    } else if (Array.isArray(obj)) {
                                        delete data[x][y];
                                    }
                                })
                            }
                        } else if (toString.call(data[x][y]) === "[object Object]" || (Array.isArray(data[x][y]))) {
                            delete data[x][y];
                        }
                    })
                } else if (Array.isArray(data[x])) {
                    data[x].forEach((element: any) => {
                        if (toString.call(element) === "[object Object]") {
                            Object.keys(element).forEach((y) => {
                                if (propToInclude.includes(x + "." + y)) {
                                    if (toString.call(element[y]) === "[object Object]") {
                                        Object.keys(element[y]).forEach((z) => { 
                                            if (toString.call(element[y][z]) === "[object Object]") {
                                                delete element[y][z];
                                            }
                                        })
                                    } else if (Array.isArray(element[y])) {
                                        element[y].forEach((obj: any) => {
                                            if (toString.call(obj) === "[object Object]") {
                                                Object.keys(obj).forEach((z) => { 
                                                    if (toString.call(obj[z]) === "[object Object]") {
                                                        delete obj[z];
                                                    }
                                                })
                                            } else if (Array.isArray(obj)) {
                                                delete element[y];
                                            }
                                        })
                                    }
                                } else if (toString.call(element[y]) === "[object Object]") {
                                    delete element[y];
                                }
                            })
                        }
                    });
                }
            } else if ((toString.call(data[x]) === "[object Object]" || (Array.isArray(data[x]))) && x.indexOf("Date_") != 0) {
                delete data[x];
            }
        })

        return data;
    }

    static ConvertToString(input: any) {
        if (input) {
            if (typeof input === "string") {
                return input;
            }

            return String(input);
        }
        return '';
    }

    static ToWords(input : any) {
        input = HelperMethods.ConvertToString(input);

        var regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;
        return input.match(regex);
    }

    static ToCamelCase(inputArray: string[]) {
        let result = "";
        for (let index = 0; index < inputArray.length; index++) {
            let currentStr = inputArray[index];
            let tempStr = currentStr.toLowerCase();
            if (index != 0) {
                // convert first letter to upper case (the word is in lowercase)
                tempStr = tempStr.substring(0, 1).toUpperCase() + tempStr.substring(1);
            }
            
            result += tempStr;
        }

        return result;
    }

    static ToCamelCaseString(input : any) {
        let words = HelperMethods.ToWords(input);
        return HelperMethods.ToCamelCase(words);
    }

    static GetSelected() {
        if (window.getSelection()) {
            return window.getSelection()?.toString();
        } else if (document.getSelection()) {
            return window.getSelection()?.toString();
        } else {
            return "";
        }
    }

    static GetMonday(d: Date) {
        const day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    }

    static RemoveFromArrByMultipleIndex(arr: any[], ...params: any[]) {
        let newArr: any[] = [];
        arr.forEach((val, index) => {
            if (!params.includes(index)) {
                newArr.push(val);
            }
        });
        return [...newArr];
    }

    static CheckForValidations(data: any, validations: Validation[]) {
        const errors = [];
        let unFilled;
        unFilled = validations.find((item, index) => {
            if (item.type === formElements.CHECKBOX_GROUP) {
                let model = data;
                item.key.split('.').forEach((itemKey: any) => {
                    model = model ? model[itemKey] : model;
                });
                const isAnyFilled = item.keys.some((groupKeys: any) => {
                    return model[groupKeys];
                });
                if (!isAnyFilled) {
                    return true;
                }
            } else if (item.required) {
                let model = data;
                item.key.split('.').forEach((itemKey: any) => {
                    model = model ? model[itemKey] : model;
                });
                return model && model !== '' ? false : true;
            }
            return false;
        })
        if (unFilled) {
            if (unFilled.type === formElements.CHECKBOX_GROUP) {
                return { validations: unFilled, msg: unFilled.label + " must be selected." };
            }

            return { validations: unFilled, msg: unFilled.label + " is required." };
        } else {
            return true;
        };
    }

    static SortArrByField(arr: any[], fieldName: string, fieldType: FieldTypes, direction: string) {
        let sortedArr = arr.sort((a, b) => {
            // if (FieldTypes.NUMBER == fieldType) {
                
            // } else 
            if (FieldTypes.DATE == fieldType) {
                let dateA = new Date(a[fieldName]), dateB = new Date(b[fieldName]);
                return dateA.getTime() - dateB.getTime();
            } else {
                let str1 = String(a[fieldName]).toLowerCase(), str2 = String(b[fieldName]).toLowerCase();
                if (str1 < str2) return -1;
                if (str2 < str1) return 1;
                return 0;
            }
        });

        if (direction && direction == "desc") {
            return sortedArr.reverse();
        }

        return sortedArr;
    }
}

export enum SearchLogics {
    EQUALS = 1,
    NOTEQUALS,
    STARTSWITH,
    ENDSWITH,
    CONTAINS,
    LT,
    LTE,
    GT,
    GTE
}

export class Validation {
    public required: boolean = false;
    public type!: formElements;
    public label!: string;
    public requiredWithinGroup?: boolean;
    public IsOwnValue: boolean = false;
    public key!: string;
    public objectName?: string;
    public group?: string;
    public keys: string[] = [];
}

export enum formElements {
    AUTOCOMPLETE = 1,
    INPUT,
    SELECT,
    DATE,
    CHECKBOX,
    CHECKBOX_GROUP
}

export enum FieldTypes {
    STRING = 1,
    NUMBER,
    DATE
}

export const RateSourceList = [
    {
        name: 'LFS',
        value: 1
    },
    {
        name: 'TruckStop',
        value: 2
    },
    {
        name: 'ForwardAir',
        value: 3
    }
]