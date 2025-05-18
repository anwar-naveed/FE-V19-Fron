// import { OnInit, EventEmitter, Injectable } from "@angular/core";
// import { SetupService } from "../services/setup.service";
// import { PrismController } from "./prism.controller";
// // import { SetupFormComponent } from "src/app/components/setup-form/setup-form.component";
// import { MatDialogRef } from "@angular/material/dialog";
// import { Sort } from "@angular/material/sort";
// import { HelperMethods, SearchLogics, formElements } from "src/core/helper/helper.methods";
// // import { FluidFormElement, FluidElementTypes} from "src/app/components/dynamic-form/dynamic-form.component";
// // import { ActionPopupComponent } from "src/app/components/action-popup/action-popup.component";
// import { GeneralService} from "src/app/services/common/general.service";
// import { GlobalConfig } from "src/core/helper/global.config";
// import { PrismFileServerService } from "../services/fileserver.service";
// import { Router } from "@angular/router";
// import { DashboardService } from "src/app/services/dashboard/dashboard.service";
// // import { AppliedFilter } from "src/app/components/advance-search/advance-search.component";

// @Injectable({
//     providedIn: 'root'
// })

// export abstract class SetupController<K> extends PrismController<K> implements OnInit {
//     configurations: any[] = [];
//     searchCriteria = new SearchCriteria();
//     setupList: any;
//     public FormElements!: FluidFormElement[];
//     SearchByDisplayValue = {
//         Display: '',
//         Value: ''
//     };
//     SearchList!: any[];
//     showHeader!: boolean;
//     select: any;

//     dataSource: any[] = [];
//     SelectList: any[] = [];
//     showTable!: boolean;
//     selectNameList: any[] = [];
//     defPredicate: any = null;
//     AdvancePredicate: string = "";
//     TService: any;
//     showPaginator!: boolean;
//     recordCount = 0;
//     _isCustom!: boolean;
//     _showForm = new EventEmitter();
//     SortOn!: string;
//     ChildObjectSelects: any[] =  [];
//     ApiFormElem!: any[];
//     gridLoading = false;
//     _isCUDForAdmin = false;
//     _customBulkUpload = false;
//     _onBulkUpload = new EventEmitter();
//     _PrimaryId = "id";
//     _afterSave = new EventEmitter();
//     fileServerService: PrismFileServerService;
//     private routeUrl: Router;
//     private dashboardServ: DashboardService
//     subscription: any;
//     EnumFormElem!: any[];
//     EditRecord: any;
//     // appliedFilters: AppliedFilter; //find again
//     isDuplicate: boolean = false;
//     get SelectNameLst() {
//         return (this._isCUDForAdmin && this.Role !== 1) ? this.selectNameList : ['more'].concat(this.selectNameList);
//     }

//     constructor() {
//         super();
//         this.fileServerService = GlobalConfig.injector.get(PrismFileServerService);
//         this.routeUrl = GlobalConfig.injector.get(Router);
//         this.dashboardServ = GlobalConfig.injector.get(DashboardService);
//     }

//     async CustomBulkUpload() {}

//     async OnBulkUpload(event?) {
//         if (this._customBulkUpload) {
//             this._onBulkUpload.emit();
//         }
//         else {
//             const file = event.target.files[0];
//             const data = new FormData();
//             data.append("shippingLineId", "295");
//             data.append("ShippingLineId", "295");
//             data.append("file", file);
//             this.TService.BulkUpload(data);
//         }
//     }

//     async Configure() {
//         this.gridLoading = true;
//         const res = await this.GetConfig();
//         this.gridLoading = false;
//         if (!res) { return; }

//         this.FillVars();
//         this.showTable = true;
//         this.GetDataWrapper();
//         if (GeneralService.CustomerFilterRoutes.some((val) => this.routeUrl.url.includes(val))) {
//             this.subscription = this.dashboardServ.syncSubject.subscribe((val) => {
//                 this.GetDataWrapper();
//             });
//         }

//         this.setSearches();
//     }

//     FillVars() {
//         const selectPredicateArr = [];
//         const sortPredicateArr = [];
//         const propsToInclude = [];
//         this.configurations.forEach((config) => {
//             if (config.isInclude) {
//                 propsToInclude.push(HelperMethods.ToCamelCaseString(config.fieldName));
//             }

//             if (config.isDisplayed) {
//                 const configCopy = JSON.parse(JSON.stringify(config));
//                 configCopy.fieldName = config.alias ? config.alias : config.fieldName;
//                 configCopy.fieldName = HelperMethods.ToCamelCaseString(configCopy.fieldName);
//                 this.SelectList.push(configCopy);
//                 this.selectNameList.push(configCopy.fieldName);
//             }

//             if ((config.isSelected || config.isDisplayed) && (config.fieldName.toUpperCase() !== 'ID' || config.alias) && (!config.childObject)) {
//                 selectPredicateArr.push(config.alias ? config.fieldName + " as " + config.alias : config.fieldName)
//             }

//             if (config.isDefaultSort) {
//                 if (config.isDefaultSortDesc) {
//                     sortPredicateArr.push((config.alias ? config.alias : config.fieldName) + " Desc");
//                 } else {
//                     sortPredicateArr.push(config.alias ? config.alias : config.fieldName);
//                 }
//             }

//             if (config.childConfig && config.childConfig.objectName) {
//                 this.ChildObjectSelects.push(config);
//             }
//         });

//         // For removing extra objects
//         this.TService.propsToInclude = propsToInclude;
//         this.select = selectPredicateArr.join(',');
//         this.SortOn = sortPredicateArr.join(',');
//         this.ApiFormElem = [];
//         if (!this._isCustom && this.FormElements) {
//             this.FormElements.forEach((val, index) => {
//                 if (val.dataOptions && val.dataOptions.searchType === 'api' && val.dataOptions.objectName) {
//                     const FormElem: any = val;
//                     FormElem.index = index;
//                     this.ApiFormElem.push(FormElem);
//                 } else if (val.dataOptions && val.dataOptions.configField) {
//                     const conf = this.configurations.find(x => x.fieldName.toLowerCase() === val.dataOptions.configField.toLowerCase())
//                     if (conf && conf.displayType === 'enum' && Array.isArray(conf.enumList)) {
//                         this.FormElements[index].dataOptions.dataSource = conf.enumList;
//                         this.FormElements[index].dataOptions.filterDataSource = conf.enumList;
//                         this.FormElements[index].dataOptions.displayField = "display";
//                         this.FormElements[index].dataOptions.valueField = "value";
//                     }
//                 }
//             });
//         }
//     }

//     async FormFilling(dataObj, items, origItems) {
//         if (dataObj) {
//             const res = await this.TService.Get(dataObj[this._PrimaryId]);
//             if (res.IsSuccessful) {
//                 items.forEach(element => {
//                     if ((element.elementType === FluidElementTypes.CHIPBOX || element.elementType === FluidElementTypes.CHIPBOX_TWO) && element.inputType === "autocomplete") {
//                         res.Data[element.key].forEach((val) => {
//                             val[element.displayField] = val[element.dataOptions.objectName] ? val[element.dataOptions.objectName][element.dataOptions.displayField] : '';
//                             delete val[element.dataOptions.objectName];
//                         })
//                     } else {
//                         if (element.dataOptions && element.dataOptions.objectName === 'field') {
//                             const elem = {}
//                             elem[element.dataOptions.displayField] = res.Data[element.key];
//                             elem[element.dataOptions.valueField] = res.Data[element.key];
//                             const elemArr = [elem];
//                             origItems[element.index].dataOptions.dataSource = elemArr;
//                             origItems[element.index].dataOptions.filterDataSource = elemArr;
//                         } else {
//                             const initial = res.Data[element.dataOptions.objectName] ? res.Data[element.dataOptions.objectName] : null;
//                             res.Data[element.dataOptions.objectName + "_object"] = initial;
//                             if (element.dataOptions.objectName) {
//                                 delete res.Data[element.dataOptions.objectName];
//                             }

//                             if (initial) {
//                                 const elem = {}
//                                 elem[element.dataOptions.displayField] = initial[element.dataOptions.displayField];
//                                 elem[element.dataOptions.valueField] = initial[element.dataOptions.valueField] === 0 ? res.Data[element.key] : initial[element.dataOptions.valueField];
//                                 if (element.fileNameColumn) {
//                                     elem[element.fileNameColumn] = initial[element.fileNameColumn];
//                                 }

//                                 const elemArr = [elem];
//                                 origItems[element.index].dataOptions.dataSource = elemArr;
//                                 origItems[element.index].dataOptions.filterDataSource = elemArr;
//                                 if (!res.Data[element.key]) {
//                                     res.Data[element.key] = initial[element.dataOptions.valueField];
//                                 }
//                             }
//                         }
//                     }
//                 });
//                 origItems.filter(x => x.elementType === 4).forEach((dataElem) => {
//                     res.Data["Date_" + dataElem.key] = res.Data[dataElem.key];
//                 })

//                 return { data: res.Data, origItems };

//             } else {
//                 //show error and close
//                 this.ShowError(res.Errors);
//                 return { data: null, items };
//             }
//         } 
//         else {
//                 //show error and close
//                 // this.ShowError(res.Errors);
//                 return { data: null, items };
//         }
//     }

//     private setSearches() {
//         this.SearchByDisplayValue = {
//             Display: 'displayName',
//             Value: 'fieldName'
//         }
//         this.SearchList = [...this.configurations].filter(element => element.isSearchable);
//         this.showHeader = true;
//     }

//     public async GetConfig() {
//         const data = await this.TService.GetConfig();
//         if (data.IsSuccessful) {
//             this.configurations = data.Data;
//             return true;
//         } else {
//             this.ShowError(data.Errors);
//             return false;
//         }
//     }

//     private async GetData(linkPredicate, select, pageNo, pageSize, sortOn) {
//         this.gridLoading = true;
//         let tenantId;
//         let customerId;
//         if (this["tenantId"]) {
//             tenantId = this["tenantId"];
//         }
//         if (GeneralService.CustomerFilterRoutes.some((val) => this.routeUrl.url.includes(val)) && GeneralService.tempCustomerId) {
//             customerId = GeneralService.tempCustomerId;
//         }
//         const data = await this.TService.GetList(linkPredicate, select, pageNo, pageSize, sortOn, tenantId, customerId);
//         this.gridLoading = false;
//         if (data.IsSuccessful) {
//             this.setupList = data.Data;
//             this.recordCount = Number(data.Headers.get("recordcount"));
//             if (data.Data) {
//                 this.showPaginator = true;
//                 this.dataSource = data.Data;
//                 this.dataSource.forEach((val) => {
//                     this.ChildObjectSelects.forEach((selector) => {
//                         const childObj = val[selector.childConfig.objectName].find((child) => {
//                             if (selector.childConfig.searchLogic === SearchLogics.EQUALS) {
//                                 return child[selector.childConfig.fieldName] == selector.childConfig.value;
//                             } else { return false; }
//                         })

//                         if (childObj) {
//                             val["_" + selector.childConfig.objectName] = childObj;
//                         }
//                     });
//                     const sad = [...this.configurations];
//                     sad.forEach((selector) => {
//                         if (val.hasOwnProperty("_" + selector.childObject)) {
//                             val[selector.alias] = val["_" + selector.childObject][selector.fieldName];
//                         }
//                     })
//                 })
//                 this.dataSource = [...this.dataSource];
//             } else {
//                 this.dataSource = [];
//             }

//             return true;
//         } else {
//             this.ShowError(data.Errors);
//             return false;
//         }
//     }

//     public OnAddRecord() {
//         if (this._isCustom || (this.FormElements && this.FormElements.length > 0)) {
//             if (this["TenantBased"] && this["TenantRequired"] && !this["tenantId"]) {
//                 this.ShowError("Tenant selection is required for this action.");
//                 return;
//             }
//             this.isDuplicate = true;
//             this.openForm();
//         } else {
//             throw ("No Form Elements were provided for this setup.");
//         }
//     }

//     public OnEditRecord(data) {
//         if (this._isCustom || (this.FormElements && this.FormElements.length > 0)) {
//             this.isDuplicate = false;
//             this.openForm(data);
//             this.EditRecord = data;
//         } else {
//             throw ("No Form Elements were provided for this setup.");
//         }
//     }
    
//     public OnDuplicateRecord(data) {
//         if (this._isCustom || (this.FormElements && this.FormElements.length > 0)) {
//             if (this["TenantBased"] && this["TenantRequired"] && !this["tenantId"]) {
//                 this.ShowError("Tenant selection is required for this action.");
//                 return;
//             }
//             this.isDuplicate = true;
//             this.openForm(data);
//             this.EditRecord = data;
//         } else {
//             throw ("No Form Elements were provided for this setup.");
//         }
//     }

//     OnDeleteRecord(data) {
//         const delPopup = this.dialog.open(ActionPopupComponent, {
//             data: {
//                 msg: ''
//             }
//         });
//         delPopup.afterClosed().subscribe(async (isSuccess) => {
//             if (isSuccess) {
//                 const res = await this.TService.del('/' + data[this._PrimaryId]);
//                 if (res.IsSuccessful) {
//                     this.GetDataWrapper();
//                     this.ShowSuccess("Record successfully deleted.")
//                 } else {
//                     this.ShowError(res.Errors);
//                 }
//             }
//         })
//     }

//     OnAddNew?: (that: SetupFormComponent, data?, selectedRow?) => any;
    
//     private async openForm(dataObjOrg?) {
//         const dataObj = Object.assign({}, dataObjOrg);
//         if (this._isCustom) {
//             this._showForm.emit(dataObjOrg);
//         } else {
//             const dialogRef = this.dialog.open(SetupFormComponent, { data: this.FormElements, maxWidth: '70vw', maxHeight: '85vw' });
//             dialogRef.componentInstance.Title = this["Title"];
//             if (dataObj && Object.keys(dataObj).length > 0) {
//                 dialogRef.componentInstance.isNew = false;
//                 const res = await this.TService.Get(dataObj[this._PrimaryId]);
//                 if (res.IsSuccessful) {
//                     if (this.isDuplicate) {
//                         delete res.Data[this._PrimaryId];
//                         delete dataObj[this._PrimaryId];
//                     } else {
//                         if (res.Data && !res.Data.meta) {
//                             res.Data["meta"] = {
//                                 createUserId: dataObj["createUserId"] || '',
//                                 createTime: dataObj["createTime"] || '',
//                                 editUserId: dataObj["editUserId"] || '',
//                                 editTime: dataObj["editTime"] || '',
//                             }
//                         }
//                     }
//                 }
//                 this.ApiFormElem.forEach(element => {
//                     if ((element.elementType === FluidElementTypes.CHIPBOX || element.elementType === FluidElementTypes.CHIPBOX_TWO) && element.inputType === "autocomplete") {
//                         res.Data[element.key].forEach((val) => {
//                             val[element.displayField] = val[element.dataOptions.objectName] ? val[element.dataOptions.objectName][element.dataOptions.displayField] : '';
//                             delete val[element.dataOptions.objectName]; 
//                         })
//                     } else {
//                         if (element.dataOptions && element.dataOptions.objectName === 'field') {
//                             const elem = {};
//                             elem[element.dataOptions.displayField] = res.Data[element.key];
//                             elem[element.dataOptions.valueField] = res.Data[element.key];
//                             const elemArr = [elem];
//                             dialogRef.componentInstance.items[element.index].dataOptions.dataSource = elemArr;
//                             dialogRef.componentInstance.items[element.index].dataOptions.filterDataSource = elemArr;
//                         } else {
//                             const initial = res.Data[element.dataOptions.objectName] ? res.Data[element.dataOptions.objectName] : null;
//                             res.Data[element.dataOptions.objectName + "_object"] = initial;
//                             if (element.dataOptions.objectName) {
//                                 delete res.Data[element.dataOptions.objectName];
//                             };

//                             if (initial) {
//                                 const elem = {}
//                                 elem[element.dataOptions.displayField] = initial[element.dataOptions.displayField];
//                                 elem[element.dataOptions.valueField] = initial[element.dataOptions.valueField] === 0 ? res.Data[element.key] : initial[element.dataOptions.valueField];
//                                 if (element.fileNameColumn) {
//                                     elem[element.fileNameColumn] = initial[element.fileNameColumn];
//                                 }

//                                 const elemArr = [elem];
//                                 dialogRef.componentInstance.items[element.index].dataOptions.dataSource = elemArr;
//                                 dialogRef.componentInstance.items[element.index].dataOptions.filterDataSource = elemArr;
//                             }
//                         }
//                     }
//                 });
//                 this.FormElements.filter(x => x.elementType === 4).forEach((dataElem) => {
//                     res.Data["Date_" + dataElem.key] = res.Data[dataElem.key];
//                 });
//                 dialogRef.componentInstance.Data = res.Data;
//                 dialogRef.componentInstance.isDuplicate = this.isDuplicate;

//                 if (this.OnAddNew) {
//                     this.OnAddNew(dialogRef.componentInstance, res.Data, dataObj);
//                 } else {
//                     this.ShowError(res.Errors);
//                     dialogRef.close();
//                 }
//             } else {
//                 dialogRef.componentInstance.Data = this.BeforeAdd();
//                 dialogRef.componentInstance.Data["isAutoAddrCSZ"] = true;
//                 if (this.OnAddNew) {
//                     this.OnAddNew(dialogRef.componentInstance);
//                 }
//             }
//             dialogRef.componentInstance.IsReady = true;
//             dialogRef.componentInstance.Search().subscribe((data) => {
//                 this.GeneralAutoSearch(data, dialogRef);
//             });
            
//             dialogRef.componentInstance.Submit().subscribe(async (data) => {
//                 dialogRef.componentInstance.loading = true;
//                 const res = await this.Save(data, (dataObj && !this.isDuplicate) ? dataObj[this._PrimaryId] : null, dialogRef.componentInstance);
//                 dialogRef.componentInstance.loading = false;
//                 if (res) {
//                     dialogRef.close();
//                     this.GetDataWrapper();
//                 };
//             });
//         }; 
//     }

//     async SaveFile(file: File, data): Promise<string> {
//         const tokenRes = await this.TService.GetFSUploadToken(data);
//         if (tokenRes.IsSuccessful) {
//             const token = tokenRes.Data;
//             const fileResp = await this.fileServerService.SaveFile(file, token);
//             if (fileResp.IsSuccessful) {
//                 const fileId = fileResp.Data.fileId;
//                 return fileId;
//             }
//             return null;
//         }
//         return null;
//     }

//     OnBeforeSave?: (that: SetupController<K>, data, Id) => any;

//     async BeforeSave(data, Id?) {
//         if (this.OnBeforeSave) {
//             let retdata = this.OnBeforeSave(this, data, Id);
//             if (!retdata) {
//                 console.log("On Before Save returned empty data.");
//                 return;
//             }
//         }
        
//         if (data['FileObjs'] && data['FileObjs'].length > 0) {
//             for (let index = 0; index < data['FileObjs'].length; index++) {
//                 const fileObj = data['FileObjs'][index];
//                 const path = await this.SaveFile(fileObj.file, data);
//                 if (!path) {
                    
//                 }
//                 data[fileObj.key] = path;
//             }
//         }

//         return data;
//     }

//     OnAfterSave?: (that: SetupFormComponent, oldData, newData, Id?) => any;

//     async Save(data, Id, that?: SetupFormComponent) {
//         const isValid = this.isValidBeforeSave(data);
//         if (isValid) {
//             data = await this.BeforeSave(data, Id);
//             if (!data) {
//                 return;
//             }
//             delete data['FileObjs'];
//             const header = this.GetDataHeaders(data);
//             if (this["tenantId"] && this["TenantBased"]) {
//                 header["tenantId"] = this["tenantId"] + "";
//             }

//             const dataValid = this.isDataValid(data, Id);
//             // if (dataValid) {
//             if (!dataValid) {
//                 this.ShowError(dataValid);
//                 return;
//             }
//             const res = await this.TService.save(data, Id, header);

//             if (res.IsSuccessful) {
//                 this._afterSave.emit({ data: res.Data, Id });
//                 if (this.OnAfterSave) {
//                     this.OnAfterSave(that, data, res.Data, Id);
//                 }

//                 const message = Id ? "Successfully Updated." : "Successfully Added.";
//                 this.ShowSuccess(message); 
//             } else {
//                 this.ShowError(res.Errors);
//             }
//             return res.IsSuccessful;
//         } else {
//             return false;
//         }
//     }

//     isDataValid(data: any, Id: any): string {
//         return null;
//     }

//     GetDataHeaders(data: any) {
//         const keys = Object.keys(data);
//         const headerKeys = keys.filter(x => x.indexOf("_header") > 0);
//         const header: any = {}
//         headerKeys.forEach((key) => {
//             const keySplit = key.split("_header");
//             if (keySplit.length > 0) {
//                 const originalKey = key.split("_header")[0];
//                 header[HelperMethods.ToUpperFirst(originalKey)] = data[key] + "";
//             }
//         })
//         return header;
//     }

//     isValidBeforeSave(data: any): boolean {
//         let unfiled;
//         unfiled = this.FormElements.find((item, index) => {
//             if (item.requireDependentOn) {
//                 if (item.requireDependentOn.ifTrue && data[item.requireDependentOn.field] || (!item.requireDependentOn.ifTrue && !data[item.requireDependentOn.field])) {
//                     return (!data[item.key] || data[item.key] === "");
//                 }
//             }
//             if (item.required && (item.inputType == "number" ? isNaN(data[item.key]) : (!data[item.key] || data[item.key] === ""))) {
//                 return true;
//             }
//             return false;
//         });
//         if (unfiled) {
//             this.ShowError(unfiled.label + " is required.");
//             return false;
//         } else {
//             return true;
//         };
//     }
//     protected async GeneralAutoSearch(SearchP, dialogRef: MatDialogRef<SetupFormComponent, any>) {
//         // const searchPara = {}
//         let header = undefined;
//         if (SearchP.Key.indexOf("_header") > 0) {
//             SearchP.Key = SearchP.Key.split("_header")[0];
//         }
//         if (SearchP.DependentHeaderValue && SearchP.DependentHeaderKey) {
//             header = {};
//             if (SearchP.DependentHeaderKey.indexOf("_header") > 0) {
//                 SearchP.DependentHeaderKey = SearchP.DependentHeaderKey.split("_header")[0];
//             }
//             header[SearchP.DependentHeaderKey] = SearchP.DependentHeaderValue;
//         }
//         const data = await this.TService.FilterList(SearchP.Key, SearchP.SearchValue, SearchP.DependentValue, header);
//         if (data.IsSuccessful) {
//             dialogRef.componentInstance.items[SearchP.Index].dataOptions.dataSource = data.Data;
//             dialogRef.componentInstance.items[SearchP.Index].dataOptions.filterDataSource = data.Data;
//             return true;
//         } else {
//             return false;
//         }
//     }

//     public async GeneralAutoSearchWithoutDialog(SearchP) {
//         const searchPara = {}
//         const data = await this.TService.FilterList(SearchP.Key, SearchP.SearchValue, SearchP.DependentValue);
//         if (data.IsSuccessful) {
//             this.FormElements[SearchP.Index].dataOptions.dataSource = data.Data;
//             this.FormElements[SearchP.Index].dataOptions.filterDataSource = data.Data;
//             return true;
//         } else {
//             return false;
//         }
//     }

//     FillForm(FormStructures, ApiFormElem, data) {
//         ApiFormElem.forEach(element => {
//             if (element.dataOptions && element.dataOptions.objectName === 'field') {
//                 const elem = {};
//                 elem[element.dataOptions.displayField] = data[element.key];
//                 elem[element.dataOptions.valueField] = data[element.key];
//                 const elemArr = [elem];
//                 FormStructures[element.index].dataOptions.dataSource = elemArr;
//                 FormStructures[element.index].dataOptions.filterDataSource = elemArr;
//             } else {
//                 const initial = data[element.dataOptions.objectName] ? data[element.dataOptions.objectName] : null;
//                 if (element.dataOptions.objectName) {
//                     delete data[element.dataOptions.objectName];
//                 }

//                 if (initial) {
//                     const elem = {};
//                     elem[element.dataOptions.displayField] = initial[element.dataOptions.displayField];
//                     elem[element.dataOptions.valueField] = initial[element.dataOptions.valueField];
//                     const elemArr = [elem];
//                     FormStructures[element.index].dataOptions.dataSource = elemArr;
//                     FormStructures[element.index].dataOptions.filterDataSource = elemArr;
//                 }
//             }
//         });
//         return FormStructures;
//     }

//     ClearForm(FormStructures, ApiFormElem) {
//         ApiFormElem.forEach(element => {
//             FormStructures[element.index].dataOptions.dataSource = [];
//             FormStructures[element.index].dataOptions.filterDataSource = [];
//         });
//         return FormStructures;
//     }

//     OnSearch(Search) {
//         this.searchCriteria.SearchParams = [];
//         this.searchCriteria.SearchParams.push(Search);
//         this.searchCriteria.PageNo = 1;
//         this.GetDataWrapper();
//     }

//     GetDataWrapper(isRefresh?: boolean) {
//         if (isRefresh) {
//             this.searchCriteria.PageNo = 1;
//         }
//         const Search = this.searchCriteria.SearchParams[0];
//         const linkPredicates = []
//         if (this.defPredicate) { linkPredicates.push(this.defPredicate) };

//         const linkPredicate = HelperMethods.GetLinkPredicate(Search.fieldName, Search.searchLogic, Search.searchValue);
//         if (linkPredicate && linkPredicate != "") { linkPredicates.push(linkPredicate) };
//         if (this.AdvancePredicate) {
//             this.GetData(this.AdvancePredicate, this.select, this.searchCriteria.PageNo, this.searchCriteria.RecordCount, this.SortOn);
//         } else {
//             this.GetData(linkPredicates.join(' && '), this.select, this.searchCriteria.PageNo, this.searchCriteria.RecordCount, this.SortOn);
//         }
//     }

//     apiSortData(sort: Sort) {
//         this.SortOn = "" + sort.active + " " + sort.direction;
//         this.GetDataWrapper();
//     }

//     BeforeAdd(): any {
//         console.log("setup controller");
//         return {};
//     }

//     ngOnInit(): void {
        
//     }

//     Init(TService: any) {
//         this.TService = TService;
//         this.Configure();
//     }
// }

// export class SearchCriteria {
//     PageNo = 1;
//     RecordCount = 20;
//     SearchParams: SearchParam[];
//     constructor() {
//         this.SearchParams = [];
//         this.SearchParams.push(new SearchParam());
//     }
// }

// export class SearchParam {
//     fieldName: string;
//     searchValue: string;
//     searchLogic: SearchLogics;
//     andOr: string;
//     childObject:  string;
// }

// export class Configuration {
//     FieldName: string;
//     DisplayName: string;
//     IsSearchable: string;
// }