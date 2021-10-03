import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';

@Component({
  selector: 'app-archiveproposal',
  templateUrl: './archiveproposal.component.html',
  styleUrls: ['./archiveproposal.component.css']
})
export class ArchiveproposalComponent implements OnInit {
  userID = this.apiService.decodejwts().userid; // logged user id
  // Define & Declare the Archieve proposal table data's display
  archievePageEvent: PageEvent;
  displayedArchieveColumns: string[] = ['date', 'name', 'reason'];
  archieveDataSource = new MatTableDataSource(this.archieveDataSource);
  archieveRes: any;
  @ViewChild('archievepaginator') archievepaginator: MatPaginator;
  resultsArchieveLength: any;
  perpage = constant.itemsPerPage;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.getArchievedList();
  }
  /** Common interger convert function for table serial number display functionality */
  ConvertToInt(val) {
    return parseInt(val);
  }
  /** Archieve Proposal data's display to the table*/
  getArchievedList(page = 1) {
    this.apiService.getRequest(constant.apiurl + constant.archievedList + `?user=${this.userID}&page=${page}`)
      .map(data => {
        this.archieveRes = data;
        this.resultsArchieveLength = this.archieveRes.body.count;
        return this.archieveRes.body.results;
      }).subscribe(responseData => {
        this.archieveDataSource = responseData;
        this.archieveDataSource.paginator = this.archievepaginator;
      });
  }
  /** Archieve material table page event call */
  onArchievePaginateChange(pageEvent) {
    this.archievePageEvent = pageEvent;
    this.getArchievedList(pageEvent.pageIndex + 1);
  }

}
