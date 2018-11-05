import { Component, OnInit, OnDestroy } from '@angular/core';
import { Result, Line, Place, IOPoint } from './../../directives/interfaces';
import { HttpClient } from '@angular/common/http';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';
import { Subscription } from 'rxjs/Subscription';
import 'chart.js';

interface PointData {
  address: string;
  value: number;
}

@Component({
  selector: 'app-real-time-data',
  templateUrl: './real-time-data.component.html',
  styleUrls: ['./real-time-data.component.scss']
})
export class RealTimeDataComponent implements OnInit, OnDestroy {
  static parameters = [HttpClient, StompService];
  lineList = [];
  placeList = [];
  iOPointList = [];
  pointDatas: PointData[];
  private pointDataSubscription: Subscription;
  public subscribed = false;
  constructor(public client: HttpClient
    , private _stompService: StompService) { }

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
    this.client.get<Result<Place[]>>('http://localhost:9000/configure/place', {
      observe: 'response',
      headers: { 'Accept': 'application/json', 'Content-Type': 'apllication/json' }
    }).subscribe(
      res => {
        if (res.body.success === false) {
          console.log('无工位记录');
          console.log(res.body.error);
          return;
        }
        console.log(res.body.data);
        localStorage.setItem('placeList', JSON.stringify(res.body.data));
        this.placeList = res.body.data;
      }
    );
    this.client.get<Result<IOPoint[]>>('http://localhost:9000/configure/iopoint', {
      observe: 'response',
      headers: { 'Accept': 'application/json', 'Content-Type': 'apllication/json' }
    }).subscribe(
      res => {
        if (res.body.success === false) {
          console.log('无IO点记录');
          console.log(res.body.error);
          return;
        }
        console.log(res.body.data);
        localStorage.setItem('pointList', JSON.stringify(res.body.data));
        this.iOPointList = res.body.data;
      }
    );
  }

  public subscribe() {
    console.log(this.subscribed);
    this.pointDataSubscription = this._stompService.subscribe('/topic/dashboard').subscribe((message: Message) => {
      this.pointDatas = JSON.parse(message.body);
    });
  }

  ngOnDestroy() {
    this.pointDataSubscription.unsubscribe();
    this.pointDataSubscription = null;
  }

}
