import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class LocalStorage {
    
    constructor() {

    }

    Set(key: string, value: any) {
        localStorage.setItem(key, value);
    }

    Get(key: string) {
        return localStorage.getItem(key);
    }

    Remove(key: string) {
        return localStorage.removeItem(key);
    }

    Clear() {
        return localStorage.clear();
    }
}