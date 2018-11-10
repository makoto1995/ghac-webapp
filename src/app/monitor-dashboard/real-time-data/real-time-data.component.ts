import { TrendChartComponent } from './../trend-chart/trend-chart.component';
import { AuthService } from './../../directives/auth/auth.service';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { Result, Line, Place, IOPoint, User } from './../../directives/interfaces';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Message } from '@stomp/stompjs';
import { StompService } from '@stomp/ng2-stompjs';
import { Subscription } from 'rxjs/Subscription';
import { SelectionModel } from '@angular/cdk/collections';
import { of as ofObservable } from 'rxjs/observable/of';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { MatDialog } from '@angular/material';

interface PointMessage {
  address: string;
  value: number;
}

export interface FilterNode {
  id: number;
  name: string;
  type: string;
  children: FilterNode[];
}

export class FilterFlatNode {
  id: number;
  name: string;
  level: number;
  expandable: boolean;
}

class PointNode implements FilterNode {
  lineName: string;
  placeName: string;
  id: number;
  name: string;
  type: string;
  children: FilterNode[];
  pointShown: boolean;
}

@Component({
  selector: 'app-real-time-data',
  templateUrl: './real-time-data.component.html',
  styleUrls: ['./real-time-data.component.scss']
})
export class RealTimeDataComponent implements OnInit, OnDestroy {
  static parameters = [HttpClient, StompService, AuthService, MatDialog];
  lineList = [];
  placeList = [];
  iOPointList = [];
  pointMessages: PointMessage[];
  lineNodes: FilterNode[];
  placeNodes: FilterNode[];
  pointNodes: PointNode[];
  dataChange: BehaviorSubject<FilterNode[]>;
  flatNodeMap: Map<FilterFlatNode, FilterNode>;
  nestedNodeMap: Map<FilterNode, FilterFlatNode>;
  selectedParent: FilterFlatNode | null = null;
  treeControl: FlatTreeControl<FilterFlatNode>;
  treeFlattener: MatTreeFlattener<FilterNode, FilterFlatNode>;
  datasource: MatTreeFlatDataSource<FilterNode, FilterFlatNode>;
  checklistSelection = new SelectionModel<FilterFlatNode>(true /* multiple */);
  filterOpened: boolean;
  currentUser: User;
  AuthService: AuthService;
  private pointDataSubscription: Subscription;
  public subscribed = false;
  constructor(public client: HttpClient
    , private _stompService: StompService
    , private _authService: AuthService
    , public dialog: MatDialog) {
    this.currentUser = _authService.currentUser;
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<FilterFlatNode>(this.getLevel, this.isExpandable);
    this.datasource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataChange.subscribe(data => {
      this.datasource.data = data;
    });
  }

  getSelectedPoints = () => {
    this.lineNodes = this.lineNodes.map((line: FilterNode) => {
      line.children.map((place: FilterNode) => {
        place.children.map((point: PointNode) => {
          this.checklistSelection.isSelected(this.nestedNodeMap.get(point))
          ? point.pointShown = true
          : point.pointShown = false;
          return point;
        });
        return place;
      });
      return line;
    });
  }

  openTrend = (id: number) => {
    const lineData = this.lineList.filter((line: Line) => {
      return line.lineId === id;
    })[0];
    this.dialog.open(TrendChartComponent, {
      data : {
        line: lineData
      }
    });
  }

  getLevel = (node: FilterFlatNode) => {
    return node.level;
  }

  isExpandable = (node: FilterFlatNode) => {
    return node.expandable;
  }

  getChildren = (node: FilterNode): Observable<FilterNode[]> => {
    return ofObservable(node.children);
  }

  hasChild = (_: number, _nodeData: FilterFlatNode) => {
    return _nodeData.expandable;
  }

  hasNoContent = (_: number, _nodeData: FilterFlatNode) => {
    return _nodeData.id == null;
  }

  isEndPoint = (_: number, _nodeData: FilterFlatNode) => {
    return this.flatNodeMap.get(_nodeData).constructor.name === 'PointNode';
  }

  transformer = (node: FilterNode, level: number) => {
    const flatNode = (this.nestedNodeMap.has(node) && this.nestedNodeMap.get(node).name === node.name)
      ? this.nestedNodeMap.get(node)
      : new FilterFlatNode();
    flatNode.id = node.id;
    flatNode.name = node.name;
    flatNode.expandable = !!node.children;
    flatNode.level = level;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  descendantsAllSelected(node: FilterFlatNode): boolean {
    return this.treeControl.getDescendants(node).every(child =>
      this.checklistSelection.isSelected(child));
  }

  descendantsPartiallySelected(node: FilterFlatNode): boolean {
    return this.treeControl.getDescendants(node).some(child =>
      this.checklistSelection.isSelected(child))
      && !this.descendantsAllSelected(node);
  }

  filterSelectionToggle(node: FilterFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);
    if (this.isEndPoint(0, node)) {
      this.pointNodes.filter((point: PointNode) => {
        return point.id === node.id && point.name === node.name;
      }).map((point: PointNode) => {
        point.pointShown = !point.pointShown;
        return point;
      });
    }
  }

  ngOnInit() {
    this.reset();
    this.subscribe();
  }

  reset() {
    // 请求点表
    this.client.get<Result<IOPoint[]>>('http://localhost:9000/configure/iopoint', {
      observe: 'response',
      headers: { 'Accept': 'application/json', 'Content-Type': 'apllication/json' }
    }).subscribe(
      (iOPointRes: HttpResponse<Result<IOPoint[]>>) => {
        if (iOPointRes.body.success === false) {
          console.log('无IO点记录');
          console.log(iOPointRes.body.error);
          return;
        }
        console.log(iOPointRes.body.data);
        localStorage.setItem('pointList', JSON.stringify(iOPointRes.body.data));
        this.iOPointList = iOPointRes.body.data;
        // 将点表推入点节点数组中
        this.iOPointList.map((ioPoint: IOPoint) => {
          this.pointNodes.push({
            id: ioPoint.id,
            name: ioPoint.address,
            type: ioPoint.type,
            pointShown: true,
            children: null,
            lineName: null,
            placeName: null
          });
        });
        // 点表请求完毕后请求工位表
        this.client.get<Result<Place[]>>('http://localhost:9000/configure/place', {
          observe: 'response',
          headers: { 'Accept': 'application/json', 'Content-Type': 'apllication/json' }
        }).subscribe(
          (placeRes: HttpResponse<Result<Place[]>>) => {
            if (placeRes.body.success === false) {
              console.log('无工位记录');
              console.log(placeRes.body.error);
              return;
            }
            console.log(placeRes.body.data);
            localStorage.setItem('placeList', JSON.stringify(placeRes.body.data));
            this.placeList = placeRes.body.data;
            // 将工位表推入工位节点数组中
            this.placeList.map((place: Place) => {
              this.placeNodes.push({ id: place.placeId, name: place.placeName, type: 'place', children: null });
            });
            // 将从属于工位的点节点推入工位节点的子节点数组中
            this.pointNodes.map((pointNode: PointNode) => {
              const parentPlace =  this.placeNodes.filter((placeNode: FilterNode) => {
                return this.iOPointList.filter((iOPoint: IOPoint) => {
                  return iOPoint.id === pointNode.id;
                })[0].placeId === placeNode.id;
              })[0];
              pointNode.placeName = parentPlace.name;
              parentPlace.children.push(pointNode);
              return pointNode;
            });
            // 工位表请求完毕后请求生产线表
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
                // 生产线表推入生产线节点数组中
                this.lineList.map((line: Line) => {
                  this.lineNodes.push({ id: line.lineId, name: line.lineName, type: 'line', children: null });
                });
                // 将工位节点推入对应生产线节点的子节点中
                this.placeNodes.map((placeNode: FilterNode) => {
                  const parentLine = this.lineNodes.filter((lineNode: FilterNode) => {
                    return this.placeList.filter((place: Place) => {
                      return place.placeId === placeNode.id;
                    })[0].lineId === lineNode.id;
                  })[0];
                  placeNode.children.map((point: PointNode) => {
                    point.lineName = parentLine.name;
                    return point;
                  });
                  parentLine.children.push(placeNode);
                });
                this.getSelectedPoints();
                // 将显示数据初始化为产线节点列表
                this.dataChange.next(this.lineNodes);
              }
            );
          }
        );
      }
    );
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
