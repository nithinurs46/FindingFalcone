import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ErrorDialogComponent } from '../dialog/error-dialog/error-dialog.component';

export class HttpErrorInterceptor implements HttpInterceptor {
    public dialogConfig;
    constructor( private dialog: MatDialog ){
        this.dialogConfig = {
            height: '200px',
            width: '400px',
            disableClose: true,
            data: { }
          }
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        errorMessage = `Error: ${error.error.message}`;
                    } else {
                        // server-side error
                        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                    }
                    // window.alert(errorMessage);
                    this.dialogConfig.data = { 'errorMessage': errorMessage };
                    this.dialog.open(ErrorDialogComponent, this.dialogConfig);
                    return throwError(errorMessage);
                })
            )
    }
}
