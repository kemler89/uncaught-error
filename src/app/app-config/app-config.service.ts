import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';



// @Injectable()
export class AppConfigService<T> {

    constructor(private http: HttpClient, private configFilePath: string, private appConfig: T) {}

   loadAppConfig() {
        return this.http.get(this.configFilePath)
            .toPromise()
            .then(data => {
                this.appConfig = <T>data;
            })
            .catch((response: any) => {
                console.error(`Could not load file '${this.configFilePath}': ${JSON.stringify(response)}`);
                // error(`Could not load file '${this.configFilePath}': ${JSON.stringify(response)}`)
            });
    }

    public getConfig(): T {
        return this.appConfig;
    }


}
