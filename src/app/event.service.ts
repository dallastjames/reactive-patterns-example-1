import { Injectable } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';

export type EventHandler = (...args: any[]) => any;
@Injectable({
    providedIn: 'root'
})
export class EventService {
    private c = new Map<string, EventHandler[]>();
    private subjectCache = new Map<string, Subject<any>>();

    constructor() {}
    /**
     * Subscribe to an event topic. Events that get posted to that topic will trigger the provided handler.
     *
     * @param topic the topic to subscribe to
     * @param handler the event handler
     */
    subscribe(topic: any, ...handlers: EventHandler[]) {
        let topics = this.c.get(topic);
        if (!topics) {
            this.c.set(topic, (topics = []));
        }
        topics.push(...handlers);
    }

    /**
     *
     * This is the simplest change so that you are using Observables instead of registered callbacks
     */
    newSubscribe(topicKey: any, ...handlers: EventHandler[]): Subscription {
        let subj = this.subjectCache.get(topicKey);
        if (!subj) {
            subj = new Subject();
            this.subjectCache.set(topicKey, subj);
        }
        return subj.subscribe(args => {
            handlers.forEach(h => {
                h.call({}, ...args);
            });
        });
    }

    /**
     * This provides more flexibility than the newSubscribe method, but also requires more changes
     */
    on(topicKey: string): Observable<any> {
        let subj = this.subjectCache.get(topicKey);
        if (!subj) {
            subj = new Subject();
            this.subjectCache.set(topicKey, subj);
        }
        return subj.asObservable();
    }

    /**
     * Unsubscribe from the given topic. Your handler will no longer receive events published to this topic.
     *
     * @param topic the topic to unsubscribe from
     * @param handler the event handler
     *
     * @return true if a handler was removed
     */
    unsubscribe(topic: string, handler?: EventHandler): boolean {
        if (!handler) {
            return this.c.delete(topic);
        }

        const topics = this.c.get(topic);
        if (!topics) {
            return false;
        }

        // We need to find and remove a specific handler
        const index = topics.indexOf(handler);

        if (index < 0) {
            // Wasn't found, wasn't removed
            return false;
        }
        topics.splice(index, 1);
        if (topics.length === 0) {
            this.c.delete(topic);
        }
        return true;
    }

    deleteTopic(topicKey: string): void {
        const subj = this.subjectCache.get(topicKey);
        if (!subj) {
            return;
        }
        // Clear any current listeners
        subj.complete();
        this.subjectCache.delete(topicKey);
    }

    /**
     * Publish an event to the given topic.
     *
     * @param topic the topic to publish to
     * @param eventData the data to send as the event
     */
    publish(topic: string, ...args: any[]): any[] | null {
        const topics = this.c.get(topic);
        if (!topics) {
            return null;
        }
        return topics.map(handler => {
            try {
                return handler(...args);
            } catch (e) {
                console.error(e);
                return null;
            }
        });
    }

    newPublish(topicKey: string, ...args: any[]): void {
        const subj = this.subjectCache.get(topicKey);
        if (!subj) {
            return;
        }
        subj.next(args);
    }
}
