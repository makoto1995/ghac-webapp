import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { RouterModule, Routes } from '@angular/router';
import { RealTimeDataComponent } from './real-time-data/real-time-data.component';
import { TrendChartComponent } from './trend-chart/trend-chart.component';
import { MaterialModule } from '../directives/material.module';
import { StompConfig, StompService } from '@stomp/ng2-stompjs';


export const routes: Routes = [
  { path: 'dashboard', component: RealTimeDataComponent }
];

const stompConfig: StompConfig = {
  url: 'ws://localhost:9000/points/websocket',
  headers: {},
  heartbeat_in: 0,
  heartbeat_out: 20000,
  reconnect_delay: 5000,
  debug: true
};

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    RouterModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RealTimeDataComponent, TrendChartComponent],
  entryComponents: [RealTimeDataComponent, TrendChartComponent],
  exports: [RealTimeDataComponent],
  providers: [
    StompService, {
      provide: StompConfig,
      useValue: stompConfig
    }
  ]
})
export class MonitorDashboardModule { }
