import {CommonModule} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {APP_INITIALIZER, InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {AppConfigService} from './app-config.service';

const loadRuntimeConfig = <T>(appConfig: AppConfigService<T>) => {
    return () => {
    return appConfig.loadAppConfig();
    };
};

const initService = <T>(httpClient: HttpClient, configFilePath: string, appConfig: T) => {
    return new AppConfigService<T>(httpClient, configFilePath, appConfig)
};


export const CONFIG_FILE_PATH = new InjectionToken<string>('');
export const APP_CONFIG = new InjectionToken('');



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
}
