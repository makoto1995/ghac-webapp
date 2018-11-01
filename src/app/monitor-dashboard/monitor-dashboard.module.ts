import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealTimeDataComponent } from './real-time-data/real-time-data.component';
import { TrendChartComponent } from './trend-chart/trend-chart.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RealTimeDataComponent, TrendChartComponent]
})
export class MonitorDashboardModule { }
