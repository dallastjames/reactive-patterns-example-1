import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FakeHttpService {
    public fakeHttpRequest(): Observable<any> {
        // Wait 1 second, then return
        return interval(1000).pipe(take(1));
    }
}
