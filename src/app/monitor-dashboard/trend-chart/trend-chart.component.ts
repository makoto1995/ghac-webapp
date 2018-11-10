import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Result, Line, LineData } from 'src/app/directives/interfaces';

export class DialogData {
  line: Line;
}

@Component({
  selector: 'app-trend-chart',
  templateUrl: './trend-chart.component.html',
  styleUrls: ['./trend-chart.component.scss']
})
export class TrendChartComponent implements OnInit {

  static parameters = [ DialogData, HttpClient];
  trendChartOptions: any = {
    responsive: true
  };
  trendChartLegend = true;
  trendChartType = 'line';
  trendChartData = [];
  trendChartLabels = [];
  electricDatas = [];
  gasDatas = [];
  steamDatas = [];
  wasteDatas = [];
  currentDate: Date;
  currentHour;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public client: HttpClient) {
    this.currentDate = new Date();
    this.currentHour = this.currentDate.getHours();
   }

  ngOnInit() {
    this.client.post<Result<LineData[]>>('http://127.0.0.1:9000/history/line/day', {
      lineId: this.data.line.lineId
    }, {
      observe: 'response',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).subscribe(
      res => {
        if (res.body.success === false) {
          console.log(res.body.error);
          return;
        }
        res.body.data.map((lineData: LineData) => {
          this.electricDatas.push(lineData.electric);
          this.gasDatas.push(lineData.gas);
          this.steamDatas.push(lineData.steam);
          this.wasteDatas.push(lineData.waste);
        });
        this.trendChartData.push({data: this.electricDatas.reverse, label: '电力'});
        this.trendChartData.push({data: this.gasDatas.reverse, label: '天然气'});
        this.trendChartData.push({data: this.steamDatas.reverse, label: '蒸汽'});
        this.trendChartData.push({data: this.wasteDatas.reverse, label: '废水'});
        for (let i = 24; i >= 0; i--) {
          this.trendChartLabels.push(this.currentHour - i > 0
            ? <number>(this.currentHour - i) + ':00' : <number>(this.currentHour - i + 24) + ':00');
        }
      },
      error => {
        alert(error.text());
        console.log(error.text());
      }
    );
  }
  chartHovered(e: any): void {
    console.log(e);
  }
  chartClicked(e: any): void {
    console.log(e);
  }

}
