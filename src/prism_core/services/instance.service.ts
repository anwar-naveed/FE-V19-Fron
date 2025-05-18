import { Injectable } from '@angular/core';
import { DynamicService } from './dynamic.service';

@Injectable({
    providedIn: 'root'
})

export class InstanceService {
    services: any = {};
    
    getService(key: string, predicate?: string) : DynamicService {
        if (!this.services[key]) {
            this.services[key] = {};
        }
        if (predicate && !this.services[key][predicate]) {
            this.services[key][predicate] = new DynamicService(key, predicate);
        } else if (!this.services[key]["default"]) {
            this.services[key]["default"] = new DynamicService(key);
        }
        return predicate ? this.services[key][predicate] : this.services[key]["default"];
    }
}