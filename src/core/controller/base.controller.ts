import { inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

export abstract class BaseController<T> {
    private _model: T = <T>{};

    get model(): T {
        return this._model;
    }

    set model(value: T) {
        this._model = value || <T>{};
    }

    reset() {
        this._model = <T>{};
    }

    public router: Router;
    protected activatedRoute: ActivatedRoute;

    constructor() {
        this.activatedRoute = inject(ActivatedRoute);
        this.router = inject(Router);
    }

    navigate(url: string){
        this.router.navigate([url]);
    }
}