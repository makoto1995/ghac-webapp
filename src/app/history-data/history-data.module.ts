import { AuthService } from './../directives/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryDataComponent } from './history-data/history-data.component';
import { MaterialModule } from '../directives/material.module';
import { DirectivesModule } from '../directives/directives.module';
import { DailyDataModalComponent } from './daily-data-modal/daily-data-modal.component';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    DirectivesModule,
    HttpClientModule
  ],
  providers: [
    AuthService
  ],
  declarations: [HistoryDataComponent, DailyDataModalComponent]
})
export class HistoryDataModule { }
