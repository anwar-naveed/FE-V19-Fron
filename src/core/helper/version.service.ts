import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class VersionCheckService {
    // this will be replaced by actual hash post-build.js
    private currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';

    currenVersion: any
    constructor(private http: HttpClient){}

    /**
     * Checks in every set frequency the version of frontend application
     * @param url
     * @param frequency - in milliseconds, defaults to 30 minutes
     */
    public InitVersionCheck(url: string, frequency = 1000 * 60 * 30) {
        setInterval(() => {
            this.CheckVersion(url);
        }, frequency);
    }

    /**
     * Will do the call and check if the hash has changed or not
     * @param url
     */
    public CheckVersion(url: string) {
        console.log("Checking version");

        //timestamp these requests to invalidate caches
        this.http.get(url + '?t=' + new Date().getTime())
        .subscribe({
            next: (response: any) => {
                //console.log('Checking Version : ', response);
                this.currenVersion = response.version;
                const hash = response.hash;
                const hashChanged = this.HasHashChanged(this.currentHash, hash);
                // If new version, do something
                if (hashChanged) {
                    //console.log('Checking Version has changed : ', response);
                    //console.log('Hash changed : ', hash);
                    //localStorage.clear();
                    Object.keys(localStorage).filter(x => !x.includes('unra')).forEach(x => localStorage.removeItem(x));
                    window.location.reload();
                    //ENTER YOUR CODE TO DO SOMETHING UPON VERSION CHANGE
                }
                // store the new hash so we wouldn't trigger versionChange again
                // only necessary in case you did not force refresh
                this.currentHash = hash;
        },
        error: (error) => {
            console.error(error, 'Could not get version');
        },
        complete: () => {
          console.log('Version Check Request complete');
        }
        });
    }

    private HasHashChanged(currentHash: string, newHash: string) {
        if (!currentHash || currentHash === this.currentHash) {
            return false;
        }

        return currentHash !== newHash;
    }
}
