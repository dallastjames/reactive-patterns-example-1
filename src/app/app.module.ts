import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TemplateModule } from '@rx-angular/template';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChildAComponent } from './child-a/child-a.component';
import { ChildBComponent } from './child-b/child-b.component';

@NgModule({
    declarations: [AppComponent, ChildAComponent, ChildBComponent],
    imports: [BrowserModule, AppRoutingModule, TemplateModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
