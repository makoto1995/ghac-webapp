import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { RouterModule, Routes } from '@angular/router';
import { MainMonitorComponent } from './main-monitor/main-monitor.component';
import { MaterialModule } from '../directives/material.module';

export const routes: Routes = [
  { path: 'main', component: MainMonitorComponent}
];

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
})
export class MainMonitorModule { }
