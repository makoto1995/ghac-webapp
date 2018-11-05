import { Component, OnInit, OnDestroy } from '@angular/core';
import { Result, Line } from './../../directives/interfaces';
import { HttpClient } from '@angular/common/http';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';
import { Subscription } from 'rxjs/Subscription';
import 'chart.js';

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
export class MainMonitorComponent implements OnInit, OnDestroy {
  static parameters = [HttpClient, StompService];
  private lineDataSubscription: Subscription;
  public subscribed = false;
  currentUser = {};
  lineList = [];
  lineDatas: LineData[];
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

  constructor(public client: HttpClient
    , private _stompService: StompService) {
  }

  ngOnInit() {
    this.reset();
    this.subscribe();
  }

  public subscribe() {
    console.log(this.subscribed);
    this.lineDataSubscription = this._stompService.subscribe('/topic/summary').subscribe(this.on_next);
    this.subscribed = true;
  }

  public unsubscribe() {
    this.lineDataSubscription.unsubscribe();
    this.lineDataSubscription = null;
  }

  public on_next = (message: Message) => {
    this.lineDatas = JSON.parse(message.body);
  }

  ngOnDestroy() {
    this.unsubscribe();
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
