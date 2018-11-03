import { Result, Factory, Line } from './../../directives/interfaces';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../directives/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import 'chart.js';
import { MatDialogRef } from '@angular/material';

interface LineData {
  electric: number;
  gas: number;
  steam: number;
  waste: number;
}

@Component({
  selector: 'app-main-monitor',
  templateUrl: './main-monitor.component.html',
  styleUrls: ['./main-monitor.component.scss']
})
export class MainMonitorComponent implements OnInit {
  static parameters = [];
  currentUser = {};
  lineList = [];
  lineDatas = [];
  displayItems = [{
      name: '用电'
    }, {
      name: '天然气'
    }, {
      name: '蒸汽'
    }, {
      name: '废水'
    }
  ];
  AuthService;

  constructor(public client: HttpClient) {

  }

  ngOnInit() {
    this.reset();
  }
  reset() {
    this.client.get<Result<Line[]>>('http://localhost:9000/configure/line', {
      observe: 'response',
      headers: { 'Accept': 'application/json', 'Content-Type': 'apllication/json' }
    }).subscribe(
      res => {
        if (res.body.success === false) {
          console.log('无生产线记录');
          console.log(res.body.error);
          return;
        }
        console.log(res.body.data);
        localStorage.setItem('lineList', JSON.stringify(res.body.data));
        this.lineList = res.body.data;
      }
    );
  }

}
