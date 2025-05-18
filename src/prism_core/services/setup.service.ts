import { Injectable } from '@angular/core';
import { BaseService } from 'src/core/services/base.service';
import { PrismService } from './prism.service';

export class SetupService extends PrismService<any> {
    constructor (controller: string) {
        super(controller);
    }

    async GetConfig() {
        const config = await this.get('GetConfig');
        return config;
    }

    async GetData(searchCriteria: any) {
        const data = await this.post('GetData', searchCriteria);
        return data;
    }

    async BulkUpload(uploadData: FormData, otherMethod?: string, params?: any) {
        if (otherMethod) {
            return this.postFile(uploadData, otherMethod);
        }
        if (params) {
            return this.postFile(uploadData, 'BulkUpload', params);
        }
        return this.postFile(uploadData, 'BulkUpload');
    }

    async GetList(linkPredicate: string, select?: string, pageNo?: number, pageSize?: number, sortOn?: string, tenantId?: number, customerId?: number) {
        return this.GetDynamicList(linkPredicate,select,pageNo,pageSize,sortOn,tenantId,customerId);
    }

    async GetDynamicList(linkPredicate: string, select?: string, pageNo?: number, pageSize?: number, sortOn?: string, tenantId?: number, customerId?: number) {
        const params = [
            {
                'name': 'predicate',
                'value': linkPredicate
            },
            {
                'name': 'selector',
                'value': select
            },
            {
                'name': 'page',
                'value': pageNo
            },
            {
                'name': 'pageSize',
                'value': pageSize
            },
            {
                'name': 'sortOn',
                'value': sortOn
            }
        ]

        let header: {[key: string]: string} = {};
        if (tenantId || customerId) {
            if (tenantId) {
                header['tenantId'] = tenantId + "";
            }
            if (customerId) {
                header['CustomerId'] = customerId + "";
            }
        }

        const data = await this.get('', params, header);
        return data;
    }

    async GetListWithCustomController(controllerId: string, linkPredicate: string, select?: string, pageNo?: number, pageSize?: number, sortOn?: string, tenantId?: number, customerId?: number) {
        const params = [
            {
                'name': 'predicate',
                'value': linkPredicate
            },
            {
                'name': 'selector',
                'value': select
            },
            {
                'name': 'page',
                'value': pageNo
            },
            {
                'name': 'pageSize',
                'value': pageSize
            },
            {
                'name': 'sortOn',
                'value': sortOn
            }
        ]

        let header: {[key: string]: string} = {};
        if (tenantId || customerId) {
            if (tenantId) {
                header['tenantId'] = tenantId + "";
            }
            if (customerId) {
                header['CustomerId'] = customerId + "";
            }
        }

        const data = await this.get(`${controllerId}/`, params, header);
        return data;
    }

    async BulkDelete(linkPredicate: string) {
        const params = [
            {
                'name': 'predicate',
                'value': linkPredicate
            }
        ]
        
        const data = await this.del('BulkDelete', undefined, params);
    }

    async BulkDeleteExt(linkPredicate: string, remarks?: string) {
        const params = [
            {
                'name': 'predicate',
                'value': linkPredicate
            },
            {
                'name': 'remarks',
                'value': remarks
            }
        ]
        
        const data = await this.get('BulkDeleteext', params);
        return data;
    }

    async BulkUploadDelete(uploadData: FormData) {
        return this.postFile(uploadData, 'BulkUploadDelete');
    }

    async SampleFile() {
        const data = await this.getFile('SampleFile');
        return data;
    }

    async ExtendRateExpiryDate(body: any) {
        return await this.post('ExtendExpiryDate', body);
    }

    async FilterList(key: string, searchValue: string, dependentId?: string, headers?: any, isActive?: boolean) {
        const para = {
            key,
            searchValue,
            dependentId,
            isActive
        }

        const data = await this.post('FilterList', para, undefined, headers);
        return data;
    }

    async GetFSUploadToken() {
        return await this.get('GetFSUploadToken');
    }

    async GetFSDownloadToken() {
        return await this.get('GetFSDownloadToken');
    }

    async FindReplace(fieldName: any, findValue: any, replaceValue: any, predicate: any) {
        const body = {
            fieldName,
            findValue,
            replaceValue,
            predicate
        }
        return this.post('FindReplace', body);
    }

    async getDownloadInterimExcel(obj?: any) {
        const params = [{
            name: 'shippingLineId',
            value: obj
        }]

        return await this.get('DownloadExcel', params);
    }

    async getDownloadVendorExcel() {
       return await this.get('DownloadExcel');
    }

    async postDownload(obj?: any) {
        return await this.get('DownloadExcel', obj);
    }
}