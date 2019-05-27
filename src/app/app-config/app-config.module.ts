import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {APP_INITIALIZER, InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {AppConfigService} from './app-config.service';

const loadRuntimeConfig = <T>(appConfig: AppConfigService<T>) => {
    return () => {
    return appConfig.loadAppConfig();//'/assets/data/appConfig.json'
    };
};

const initService = <T>(httpClient: HttpClient, configFilePath: string, appConfig: T) => {
    return new AppConfigService<T>(httpClient, configFilePath, appConfig)
}
// const initService = <T>(configFilePath: string) => {
//     return (httpClient: HttpClient, appConfig: T) =>{new AppConfigService<T>(httpClient, configFilePath, appConfig)
//     }
// }

export const CONFIG_FILE_PATH = new InjectionToken<string>('');
export const APP_CONFIG = new InjectionToken('');

// export function initService<T>(httpClient: HttpClient, configFilePath: string, appConfig: T) {
//     // return ( appConfig: T) =>{
//    return new AppConfigService<T>(httpClient, configFilePath, appConfig);
//     // }
// }

// export function initAppConfigService<T>(httpClient: HttpClient,configFilePath: string, appConfig: T) {
//     return AppConfigService<T>(httpClient, configFilePath, appConfig);
// }

@NgModule({
    imports: [
        CommonModule,
    ]
})
export class AppConfigModule {
    static forRoot<T>(appConfig: T, configFilePath: string): ModuleWithProviders {

        return {
            ngModule: AppConfigModule,
            providers: [
                {
                    provide: CONFIG_FILE_PATH, useValue: configFilePath
                },
                {
                    provide: APP_CONFIG, useValue: appConfig
                },
                {

                    provide: AppConfigService, deps: [HttpClient, CONFIG_FILE_PATH, APP_CONFIG], useFactory: initService
                    //(httpClient: HttpClient, appConfig: T) => ( new AppConfigService<T>(httpClient, configFilePath, appConfig) )
                },

                {
                    provide: APP_INITIALIZER,
                    useFactory: loadRuntimeConfig,
                    multi: true,
                    deps: [AppConfigService]
                }
            ]
        };
    }

    /*
    Prevent the reimport of the module
    The constructor tells Angular to inject the AppConfigModule into itself.
    The injection would be circular if Angular looked for AppConfigModule in the current injector,
    but the @SkipSelf() decorator means "look for AppConfigModule in an ancestor injector, above me in the injector hierarchy."
    By default, the injector throws an error when it can't find a requested provider.
    The @Optional() decorator means not finding the service is OK. The injector returns null,
    the parentModule parameter is null, and the constructor concludes uneventfully.
    In Case of improperly import AppConfigModule into a lazy loaded module.
    Angular creates a lazy loaded module with its own injector,
    a child of the root injector. @SkipSelf() causes Angular to look for a AppConfigModule in the parent injector,
    which this time is the root injector. Of course it finds the instance imported by the root AppModule.
    Now parentModule exists and the constructor throws the error.
     */
    // constructor (@Optional() @SkipSelf() parentModule: AppConfigModule) {
    //     if (parentModule) {
    //         throw new Error(
    //             'GreetingModule is already loaded. Import it in the AppModule only');
    //     }
    // }

}
