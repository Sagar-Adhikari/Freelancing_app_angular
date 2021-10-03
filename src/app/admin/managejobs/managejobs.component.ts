import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-managejobs',
  templateUrl: './managejobs.component.html',
  styleUrls: ['./managejobs.component.css']
})
export class ManagejobsComponent implements OnInit {
  displayedColumns: string[] = ['project', 'deadline', 'leader', 'budget', 'status', 'action'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor() { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }
}



export interface PeriodicElement {
  project: string;
  project_from: string;
  deadline: string;
  deadline_status: string;
  leader: string;
  leader_position: string;
  leader_image: string;
  budget: string;
  budget_status: string;
  status: string;
  status_first: string;
  action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {project: 'New Dashboard', project_from : 'Google', deadline: '17th, Aprl 2018', deadline_status: 'Overdue', leader: 'Norman Hammond', leader_position: 'UK Design Team', leader_image: 'assets/images/candidate-img.png', budget: '$5000', budget_status: 'paid', status: 'RUNNING SUCCESSFUL', status_first: 'running', action: ''},
  {project: 'New Dashboard', project_from : 'Google', deadline: '17th, Aprl 2018', deadline_status: 'Overdue', leader: 'Norman Hammond', leader_position: 'UK Design Team', leader_image: 'assets/images/candidate-img.png', budget: '$5000', budget_status: 'not-paid', status: 'RUNNING SUCCESSFUL', status_first: 'running', action: ''},
  {project: 'New Dashboard', project_from : 'Apple', deadline: '17th, Aprl 2018', deadline_status: 'Overdue', leader: 'Norman Hammond', leader_position: 'UK Design Team', leader_image: 'assets/images/candidate-img.png', budget: '$5000', budget_status: 'paid', status: 'RUNNING SUCCESSFUL', status_first: 'running', action: ''},
  {project: 'New Dashboard', project_from : 'Google', deadline: '17th, Aprl 2018', deadline_status: 'Overdue', leader: 'Norman Hammond', leader_position: 'UK Design Team', leader_image: 'assets/images/candidate-img.png', budget: '$5000', budget_status: 'not-paid', status: 'PENDING INVOICE', status_first: 'pending', action: ''},
  {project: 'New Dashboard', project_from : 'Yahoo', deadline: '17th, Aprl 2018', deadline_status: 'Overdue', leader: 'Norman Hammond', leader_position: 'UK Design Team', leader_image: 'assets/images/candidate-img.png', budget: '$5000', budget_status: 'not-paid', status: 'RUNNING SUCCESSFUL', status_first: 'running', action: ''},
  {project: 'New Dashboard', project_from : 'Google', deadline: '17th, Aprl 2018', deadline_status: 'Overdue', leader: 'Norman Hammond', leader_position: 'UK Design Team', leader_image: 'assets/images/candidate-img.png', budget: '$5000', budget_status: 'paid', status: 'RUNNING SUCCESSFUL', status_first: 'running', action: ''},
];
