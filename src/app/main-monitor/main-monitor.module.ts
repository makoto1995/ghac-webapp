import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { RouterModule, Routes } from '@angular/router';
import { MainMonitorComponent } from './main-monitor/main-monitor.component';
import { MaterialModule } from '../directives/material.module';
import { StompConfig, StompService } from '@stomp/ng2-stompjs';

export const routes: Routes = [
  { path: 'main', component: MainMonitorComponent}
];

const stompConfig: StompConfig = {
  url: 'ws://localhost:9000/line/websocket',
  headers: {},
  heartbeat_in: 0,
  heartbeat_out: 20000,
  reconnect_delay: 5000,
  debug: true
};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ChartsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MaterialModule
  ],
  declarations: [MainMonitorComponent],
  exports: [
    MainMonitorComponent,
  ],
  providers: [
    StompService, {
      provide: StompConfig,
      useValue: stompConfig
    }
  ]
})
export class MainMonitorModule { }
