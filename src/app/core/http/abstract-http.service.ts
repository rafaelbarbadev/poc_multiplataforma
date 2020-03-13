import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ResponseType } from './../../shared/enums/responseType-enum';
import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs';

type Parametter = string | number | boolean | Array<string | number | boolean>;

export abstract class AbstractHttpService {

    private readonly APPLICATION_JSON_UTF_8 = ResponseType.JSON;
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient,
                private initialPath?: string, ) {}

    /**
     *
     *
     * @protected
     * @param {Parametter} param
     * @param {string} [responseType=this.APPLICATION_JSON_UTF_8]
     * @returns {Observable<T>}
     * @memberof AbstractHttpService
     */
    protected findBy<T>(param: Parametter, responseType: string = this.APPLICATION_JSON_UTF_8): Observable<T> {
        const paramStr = param instanceof Array ? param.join('/') : param;
        return this.http.get(`${this.buildUrl()}/${paramStr}`, this.createOptions(null, null, responseType))
        .pipe(
            map((next) => this.handleResult<T>(next))
        );
    }

    /**
     * Utilizar método buscarComQueryParam, quando não tiver certeza que todos os parametros do serviço serão informados e
     * queira que os mesmos sejão capturados como null no backend.
     * OBS.: No QueryParam utilizar nomeação por posição, ou seja, 0 para o primeiro e assim em diante.
     * @param path
     * @param pathParam
     */
    protected findWithQueryParam<T>(path: string, ...pathParam: Array<any>): Observable<T> {
        const parametros = {};

        if (!isNullOrUndefined(pathParam)) {
            let c = 0;
            pathParam.forEach(param => {
                const label: string = c.toString();
                parametros[label] = param;
                c++;
            });
        }

        return this.http.get(`${this.buildUrl(path)}`, this.createOptions(parametros))
        .pipe(
            map((next) => this.handleResult<T>(next))
        );
    }

    protected get<T>(path?: string, params?: any, responseType: string = this.APPLICATION_JSON_UTF_8): Observable<T> {
        return this.http.get(`${this.buildUrl(path)}`, this.createOptions(params, null, responseType))
            .pipe(
                map((next) => this.handleResult<T>(next))
            );
    }

    protected post<T>(path?: string, body?: any, params?: any, responseType: string = this.APPLICATION_JSON_UTF_8): Observable<T> {
        return this.http.post(`${this.buildUrl(path)}`, body, this.createOptions(params, body, responseType))
            .pipe(
                map((next) => this.handleResult<T>(next))
            );
    }

    protected send<T>(path?: string, body?: any): Observable<T> {
        return this.http.post(`${this.buildUrl(path)}`, body)
            .pipe(
                map((next) => this.handleResult<T>(next))
            );
    }

    protected put<T>(path?: string, body?: any, params?: any, responseType: string = this.APPLICATION_JSON_UTF_8): Observable<T> {
        return this.http.put(`${this.buildUrl(path)}`, body, this.createOptions(params, body, responseType))
            .pipe(
                map((next) => this.handleResult<T>(next))
            );
    }

    protected delete<T>(path?: string, body?: any, params?: any, responseType: string = this.APPLICATION_JSON_UTF_8): Observable<T> {
        return this.http.delete(`${this.buildUrl(path)}`, this.createOptions(params, body, responseType))
            .pipe(
                map((next) => this.handleResult<T>(next))
            );
    }

    protected head<T>(path?: string, body?: any, params?: any, responseType: string = this.APPLICATION_JSON_UTF_8): Observable<T> {
        return this.http.head(`${this.buildUrl(path)}`, this.createOptions(params, body, responseType))
            .pipe(
                map((next) => this.handleResult<T>(next))
            );
    }

    protected postLogout<T>(): Observable<T> {
        return this.http.post(`${this.buildUrl().replace('/api', '')}`, null, this.createOptions())
            .pipe(
                map((next) => this.handleResult<T>(next))
            );
    }

    private handleResult<T>(result: any): T {
        /*
            TODO: substituir 'res = {}' por 'res = null' para evitar falso-positivo no sistema em caso de No content
            e depois disto, adicionar verificação de nulo nos subscribes que recebem o resultado desta chamada
        */
        let res: any = {};
        if (this.isJsonString(result)) {
            const dataRaw = JSON.parse(result);
            if (dataRaw instanceof Array) {
                res = dataRaw.map(x => x as T);
            } else {
                res = JSON.parse(result) as T;
            }
        } else if (!isNullOrUndefined(result)) {
            if (typeof result === 'string') {
                const resultFormatted = ['true', 'false'].any(x => x === result.toLocaleLowerCase()) ?
                Boolean(JSON.parse(result)) : result;
                res = resultFormatted;
            } else if (typeof result === 'object') {
                res = result;
            } else if (result instanceof Blob || typeof result === 'number' || typeof result === 'boolean') {
                res = result;
            }
        }
        return res;
    }

    protected createOptions(parametters: any = null, body: any = null, responseType: string = this.APPLICATION_JSON_UTF_8): any {
        if (parametters) {
            let httpParams = new HttpParams();
            httpParams = this.buildParametters(parametters, httpParams);
            return {
                headers: this.buildHeaders(responseType),
                params: httpParams,
                body: body,
                responseType: responseType,
                reportProgress: false,
                withCredentials: true
            };
        } else {
            return {
                headers: this.buildHeaders(),
                body: body,
                responseType: responseType,
                withCredentials: true
            };
        }
    }

    private buildParametters(arg: Object, httpParams: HttpParams): HttpParams {
        const entries = Object.entries(arg);
        entries.forEach(x => {
            if (!isNullOrUndefined(x[1])) {
                if (typeof x[1] === 'object') {
                    httpParams = this.buildParametters(x[1] as Object, httpParams);
                } else {
                    httpParams = httpParams.set(x[0], x[1]);
                }
            }
        });
        return httpParams;
    }

    public createParams(params: any): string {
        let url = '';
        if (params) {
            const p = Object.entries(params);
            p.forEach((x, i) => {
                const separator = i === 0 ? '?' : '&';
                url = url.concat(`${separator}${x[0]}=${x[1]}`);
            });
        }
        return url;
    }

    private buildHeaders(accept: string = this.APPLICATION_JSON_UTF_8): HttpHeaders {
        return new HttpHeaders({
        'Content-Type' : this.APPLICATION_JSON_UTF_8,
        'accept': accept,
        'Authorization': this.buildAuthorization()
        });
    }

    private buildAuthorization(): string {
        // const token = this.localStorage.getItem(AppConstants.TOKEN);
        // return token ? token : '';
        return 'Bearer ';
    }

    private buildUrl(path: string = ''): string {
        const initPath = !isNullOrUndefined(this.initialPath) && this.initialPath !== '' ? `/${this.initialPath}` : '';
        path = !isNullOrUndefined(path) && path !== '' ? `/${path}` : '';
        return `${this.apiUrl}${initPath}${path}`;
    }

    private isJsonString(resposta: any): boolean {
        try {
            const formattedResponse = JSON.parse(resposta);
            if (formattedResponse && typeof formattedResponse === 'object') {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }

}
