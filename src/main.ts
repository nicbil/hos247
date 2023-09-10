import { Component, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter, RouterModule } from "@angular/router";
import { provideAnimations, BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxsModule } from "@ngxs/store";
import { ContainersState } from "./app/store/containers/containers.state";
import { ThingsState } from "./app/store/things/things.state";

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
  imports: [
    RouterModule,
  ],
})
export class AppComponent  {}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter([{
      path: '',
      loadComponent: () => import('src/app/main/main.component').then(m => m.MainComponent)
    },{
      path: 'containers',
      loadComponent: () => import('src/app/containers/containers.component').then(m => m.ContainersComponent)
    }, {
      path: 'things',
      loadComponent: () => import('src/app/things/things.component').then(m => m.ThingsComponent)
    }]),
    importProvidersFrom(
      NgxsModule.forRoot([ContainersState, ThingsState]),
      BrowserAnimationsModule,
    )
  ]
});
