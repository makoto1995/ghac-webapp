import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { RouterModule, Routes } from '@angular/router';
import { MainMonitorComponent } from './main-monitor/main-monitor.component';

export const routes: Routes = [
  { path: 'main', component: MainMonitorComponent}
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ChartsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MainMonitorComponent],
  exports: [
    MainMonitorComponent,
  ],
})
export class MainMonitorModule { }
