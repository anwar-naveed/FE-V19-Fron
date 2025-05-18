import { HelperMethods } from "src/core/helper/helper.methods";
import { SetupService } from "./setup.service";

export class DynamicService extends SetupService {
    DefaultPredicate: any;
    configArr: any[] = [];
    configLoadingStart: Date | null = null;
    searchByArr: any[] = [];
    selectPredicateArr: any[] = [];
    sortPredicateArr: any[] = [];

    constructor(controller: string, predicate?: any) {
        super(controller);
        this.DefaultPredicate = predicate;
        this.setInitials();
    }

    async setInitials() {
        this.configLoadingStart = new Date();
        const res = await this.GetConfig();
        if (res.IsSuccessful && res.Data) {
            this.configArr = res.Data;
            // this.selectPredicateArr = [];
            // this.sortPredicateArr = [];
            // this.searchByArr = [];
            this.configArr.forEach((config) => {
                if ((config.isSelected || config.isDisplayed) && 
                (config.fieldName.toUpperCase() !== "ID" || config.alias) &&
                !config.childObject) {
                this.selectPredicateArr.push(
                    config.alias ? config.fieldName + " as " + config.alias : config.fieldName
                );
                }
                if (config.isDefaultSort) {
                    this.sortPredicateArr.push(
                        (config.alias ? config.alias : config.fieldName) + 
                        (config.isDefaultSortDesc ? " Desc" : "")
                    );
                }
                if (config.isSearchable) {
                    this.searchByArr.push(config);
                }
            });
        }
        this.configLoadingStart = null;
    }
    async search(phrase: string, tenantId?: number): Promise<any[]> {
        if (!this.configArr) {
            await this.setInitials();
        }
        let isSearchPhraseNumeric = phrase && !isNaN(Number(phrase));
        let predicate = "";
        predicate = this.searchByArr.reduce((previousVal, currVal, index) => {
            if (currVal.isQuoted) {
                if (previousVal) {
                    predicate += " || ";
                }

                previousVal += HelperMethods.GetNewLinkPredicate(
                    currVal.fieldName,
                    currVal.searchLogic,
                    phrase,
                    currVal.isQuoted
                );
            }
            return previousVal;
        }, "");
        predicate = `(${predicate})`;
        const res = await this.GetList(
            predicate,
            this.selectPredicateArr.join(","),
            1,
            10,
            this.sortPredicateArr.join(","),
            tenantId
        );

        if (res.IsSuccessful && res.Data) {
            return res.Data;
        }

        return [];
    }

    async getList(linkPredicate: string, select?: string, pageNo?: number, pageSize?: number, sortOn?: string, tenantId?: number, customerId?: number) {
        if (this.DefaultPredicate) {
            linkPredicate = linkPredicate ? `${this.DefaultPredicate} && (${linkPredicate})` : this.DefaultPredicate;
        }

        return this.GetDynamicList(linkPredicate,select,pageNo,pageSize,sortOn,tenantId,customerId);
    }
}