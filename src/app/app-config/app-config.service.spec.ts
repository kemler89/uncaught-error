import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';

import {AppConfigService} from './app-config.service';

interface TestConfig {
    apiUrl: string;
}

const testUrl = '/assets/data/appConfig.json';

describe('AppConfigService', () => {
    let service: AppConfigService<TestConfig>;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let appConfig: TestConfig = {apiUrl: 'http://localhost:8080/default'};

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: AppConfigService,
                    deps: [HttpClient],
                    useFactory: (httpClient: HttpClient) => (new AppConfigService<TestConfig>(httpClient, '/assets/data/appConfig.json', appConfig))
                }
            ],
            imports: [HttpClientTestingModule]
        });

        service = TestBed.get(AppConfigService);
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('load runtime config', () => {
        const expectedConfig: TestConfig = {
            apiUrl: 'http://localhost:8080'
        };

        // Make an HTTP GET request
        service.loadAppConfig().then(() => {
            console.log('in test 1' + service.getConfig().apiUrl);
            expect(service.getConfig()).toEqual(expectedConfig);
        });

        const req = httpTestingController.expectOne(testUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(expectedConfig);

        httpTestingController.verify();

    });

    it('load default runtime config because of 404 error', () => {
        const emsg = 'deliberate 404 error';
        console.log('Test 2');
        service.loadAppConfig().catch((e: HttpErrorResponse) => {
            console.log('in test 2 ');
            expect(service.getConfig()).toEqual(appConfig);
            expect(e.status).toEqual(404);
            expect(e.error).toEqual(emsg);
        });

        const req = httpTestingController.expectOne(testUrl);

        // Respond with mock error
        req.flush(emsg, {status: 404, statusText: 'Not Found'});
        httpTestingController.verify();

    });

});
