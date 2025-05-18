import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class SharedService {
    public apiResponse: Subject<any> = new Subject();

    getApiResponse(){
        return this.apiResponse.asObservable();
    }

    setApiResponse(val: any) {
        this.apiResponse.next(val);
    }
}