import { Component, OnDestroy } from '@angular/core';
import { EventService } from './event.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RxState } from '@rx-angular/state';
import { FakeHttpService } from './fake-http.service';

interface Todo {
    id: number;
    value: string;
}

interface ComponentState {
    user: any;
    todoList: Todo[];
    loading: boolean;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    /**
     * Provides a new instance of RxState per component
     */
    providers: [RxState]
})
export class AppComponent implements OnDestroy {
    private unsub = new Subject<void>();
    title = 'change-detection';

    todoList$ = this.state.select('todoList');
    user$ = this.state.select('user');
    loading$ = this.state.select('loading');

    constructor(
        private events: EventService,
        private state: RxState<ComponentState>,
        private http: FakeHttpService
    ) {
        // Set the default value of your local state
        this.state.set({
            user: null,
            todoList: [],
            loading: true
        });
        // Connect an observable to your local state
        this.state.connect('user', this.events.on('user-change'));
    }

    ngOnDestroy(): void {
        this.unsub.next();
        this.unsub.complete();
    }

    public trackByFn(idx: number, item: Todo): any {
        return item.id;
    }

    public oldEventHandling(): void {
        const handler = () => console.log('it works');
        this.events.subscribe('my-topic', handler);
        this.events.publish('my-topic', { some: 'data' });
        this.events.unsubscribe('my-topic', handler);
    }

    public newEventHandlingType1(): void {
        const sub = this.events.newSubscribe('my-topic', () =>
            console.log('it works')
        );
        this.events.newPublish('my-topic', { some: 'data' });
        sub.unsubscribe();
    }

    public newEventHandlingType2(): void {
        this.events
            .on('my-topic')
            .pipe(takeUntil(this.unsub))
            .subscribe(() => console.log('it works'));
        this.events.newPublish('my-topic', { some: 'data' });
    }

    public refresh(): void {
        this.state.set({
            loading: true
        });
        this.http.fakeHttpRequest().subscribe(res => {
            this.state.set({
                loading: false,
                todoList: [
                    { id: 1, value: 'data' },
                    { id: 2, value: 'from' },
                    { id: 3, value: 'server' }
                ]
            });
        });
    }
}
