import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import { environment } from './../../../environments/environment';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        // private toast: ToastService // TODO: adicionar serviço de toast notification
    ) {}

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                this.handleError(error);
                return throwError(error);
            }),
            retry(1)
        );
    }

    private handleError(erro: HttpErrorResponse): Observable<any> {
        let mensagensErro: string[] = [];
        const body = !isNullOrUndefined(erro) && typeof erro === 'object' ? JSON.parse(JSON.stringify(erro)) : erro;
        if (erro.status === 0) {
            mensagensErro.unshift('Servidor Indisponível');
        } else if (erro.status >= 400 && erro.status < 500) {
            try {
                mensagensErro = isNullOrUndefined(body.error) ? [] : (JSON.parse(body.error).errors as Array<string>).any() ?
                mensagensErro.concat((JSON.parse(body.error).errors as Array<string>)) : [];
            } catch (e) {
                return;
            }
        } else if (erro.status === 500) {
            mensagensErro.unshift('Erro interno no servidor');
        } else {
            if (!environment.production) {
                if (erro.message.like('Http failure during parsing')) {
                    mensagensErro.unshift('Erro ao tentar converter resposta do servidor');
                } else {
                    mensagensErro.unshift('Erro inesperado');
                }
            }
        }
     //   this.toast.mostrarErros(mensagensErro);
    }

}
