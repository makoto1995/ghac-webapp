import { Component, OnInit, OnDestroy } from '@angular/core';
import { Result, Line, Place, IOPoint } from './../../directives/interfaces';
import { HttpClient } from '@angular/common/http';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';
import { Subscription } from 'rxjs/Subscription';
import 'chart.js';

interface PointMessage {
  address: string;
  value: number;
}

interface LineStatus {
  lineId: number;
  lineChecked: boolean;
}

interface PlaceStatus {
  placeId: number;
  placeChecked: boolean;
}

interface PointStatus {
  id: number;
  pointShown: boolean;
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
  pointMessages: PointMessage[];
  lineStatus: LineStatus[];
  placeStatus: PlaceStatus[];
  pointStatus: PointStatus[];
  private pointDataSubscription: Subscription;
  public subscribed = false;
  constructor(public client: HttpClient
    , private _stompService: StompService) { }

  ngOnInit() {
    this.reset();
    this.subscribe();
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
        this.lineList.map((line: Line) => {
          this.lineStatus.push({ lineId: line.lineId, lineChecked: true });
        });
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
        this.placeList.map((place: Place) => {
          this.placeStatus.push({ placeId: place.placeId, placeChecked: true });
        });
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
        this.iOPointList.map((ioPoint: IOPoint) => {
          this.pointStatus.push({ id: ioPoint.id, pointShown: true });
        });
      }
    );
  }

  filterDisplay() {
    this.pointStatus = this.pointStatus.map((status: PointStatus) => {
      const iOPoint: IOPoint = this.iOPointList.filter((ioPoint: IOPoint) => {
        return ioPoint.id === status.id;
      })[0];
      status.pointShown = (this.lineStatus[iOPoint.lineId].lineChecked && this.placeStatus[iOPoint.placeId].placeChecked) ? true : false;
      return status;
    });
  }

  public subscribe() {
    console.log(this.subscribed);
    this.pointDataSubscription = this._stompService.subscribe('/topic/dashboard').subscribe((message: Message) => {
      this.pointMessages = JSON.parse(message.body);
      this.iOPointList.map((ioPoint: IOPoint) => {
        ioPoint.value = this.pointMessages.filter((pointMessage: PointMessage) => {
          return pointMessage.address === ioPoint.address;
        })[0].value;
        return ioPoint;
      });
    });
  }

  ngOnDestroy() {
    this.pointDataSubscription.unsubscribe();
    this.pointDataSubscription = null;
  }

}
