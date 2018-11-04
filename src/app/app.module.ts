import { ApplicationRef, NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { RouterModule, Routes } from '@angular/router';

import { UserSettingsModule } from './user-settings/user-settings.module';
import { ReportDownloadModule } from './report-download/report-download.module';
import { MonitorDashboardModule } from './monitor-dashboard/monitor-dashboard.module';
import { MainMonitorModule } from './main-monitor/main-monitor.module';
import { HistoryDataModule } from './history-data/history-data.module';
import { DirectivesModule } from './directives/directives.module';
import { DisplaySettingsModule } from './display-settings/display-settings.module';
import { MaterialModule } from './directives/material.module';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const appRoutes: Routes = [{
  path: '',
  redirectTo: '/login',
  pathMatch: 'full'
}];

@NgModule({
  providers: [],
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    UserSettingsModule,
    ReportDownloadModule,
    MonitorDashboardModule,
    MainMonitorModule,
    HistoryDataModule,
    DirectivesModule,
    DisplaySettingsModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  static parameters = [ApplicationRef];

  constructor(private appRef: ApplicationRef) {
    this.appRef = appRef;
  }

  hmrOnInit(store) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', store);
    console.log('store.state.data:', store.state.data);
    // inject AppStore here and update it
    // this.AppStore.update(store.state)
    if ('restoreInputValues' in store) {
      store.restoreInputValues();
    }
    // change detection
    this.appRef.tick();
    Reflect.deleteProperty(store, 'state');
    Reflect.deleteProperty(store, 'restoreInputValues');
  }

  hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // inject your AppStore and grab state then set it on store
    // var appState = this.AppStore.get()
    store.state = { data: 'yolo' };
    // store.state = Object.assign({}, appState)
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    Reflect.deleteProperty(store, 'disposeOldHosts');
    // anything you need done the component is removed
  }

}
