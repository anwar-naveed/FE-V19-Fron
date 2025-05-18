import { BaseService } from "src/core/services/base.service";
import { DtoResult } from "src/core/entities/dto-result";
import { HelperMethods } from "src/core/helper/helper.methods";

export class PrismService<T> extends BaseService<T> {
    public propsToInclude = [];
    constructor (controller: string) {
        super(controller);
    }

    override async beforeSave(data: any, primaryKey: any) {
        let newData = Object.assign({}, HelperMethods.RemoveExtraObjects(data, this.propsToInclude));
        return newData;
    }

    async SaveFile(file: File, folderName: string) {
        const formData = new FormData();
        formData.append('file', file);
        //Need to change url
        return await this.httpHelper.PostWithFile<DtoResult<T>>('/api/General/SaveResources?FolderName=' + folderName, formData, BaseService.headers);
    }

    getPropertyName<T extends object>(o: T, expression: (x: { [Property in keyof T]: string }) => string) {
        const res = {} as { [Property in keyof T]: string };
        Object.keys(o).map(k => res[k as keyof T] = k);
        return expression(res);
    }

    sorter = (sortBy) => (a, b) => a[sortBy].toLowerCase() > b[sortBy].toLowerCase() ? 1 : -1;
}
