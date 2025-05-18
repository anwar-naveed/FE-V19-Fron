import { BaseService } from "src/core/services/base.service";
import { DtoResult } from "src/core/entities/dto-result";
import { HttpHelper } from "src/core/helper/http.helper";
import { Injectable } from "@angular/core";
 @Injectable({
    providedIn: 'root'
 })

 export class PrismFileServerService {
    protected static headers: {[key: string]: string} = {};
    constructor(private httpHelper: HttpHelper) {
        PrismFileServerService.headers['Content-Type'] = 'application/json';
    }

    async SaveFile(file: any, access_token: string) {
        const formData = new FormData();
        if (Array.isArray(file)) {
            let fileResp: DtoResult<any>[] = [];
            for (let index = 0; index < file.length; index++) {
                const element = file[index];
                formData.append('file', element);
                const res: any = await this.httpHelper.PostWithFile<DtoResult<any>>('/fsurl/File/upload?access_token=' + access_token, formData, PrismFileServerService.headers);
                res.Data.file = element;
                fileResp.push(res);
            }
            return fileResp;
        } else {
            formData.append('file', file);
            const res: any = await this.httpHelper.PostWithFile<DtoResult<any>>('/fsurl/File/upload?access_token=' + access_token, formData, PrismFileServerService.headers);
            res.Data.file = file;
            return res;
        }
    }

    async RemoveFile(fileId: string, access_token: string) {
        const res = await this.httpHelper.Delete(`/fsurl/File/remove?access_token=${access_token}&fileId=${fileId}`);
        return res;
    }
 }