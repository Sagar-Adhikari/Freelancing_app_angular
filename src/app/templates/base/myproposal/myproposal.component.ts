import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';

@Component({
  selector: 'app-myproposal',
  templateUrl: './myproposal.component.html',
  styleUrls: ['./myproposal.component.css']
})
export class MyproposalComponent implements OnInit {
  userID = this.apiService.decodejwts().userid; // logged user id
  // Define & Declare the Offer proposal table data's display
  offerPageEvent: PageEvent;
  displayedOfferColumns: string[] = ['no', 'date', 'title', 'amount', 'action'];
  offerDataSource = new MatTableDataSource(this.offerDataSource);
  offerRes: any;
  @ViewChild('offerpaginator') offerpaginator: MatPaginator;
  resultsOfferLength: any;
  // Define & Declare the  Invite proposal table data's display
  invitePageEvent: PageEvent;
  displayedInviteColumns: string[] = ['no', 'date', 'name', 'action'];
  inviteDataSource = new MatTableDataSource(this.inviteDataSource);
  inviteRes: any;
  @ViewChild('invitepaginator') invitepaginator: MatPaginator;
  resultsInviteLength: any;
  // Define & Declare the  Active proposal table data's display
  activePageEvent: PageEvent;
  displayedActiveColumns: string[] = ['no', 'date', 'name', 'action'];
  activeDataSource = new MatTableDataSource(this.activeDataSource);
  activeRes: any;
  @ViewChild('activepaginator') activepaginator: MatPaginator;
  resultsActiveLength: any;
  // Define & Declare the  submitted table display variable's
  submittedPageEvent: PageEvent;
  displayedSubmittedColumns: string[] = ['no', 'date', 'name', 'action'];
  submittedDataSource = new MatTableDataSource(this.submittedDataSource);
  submittedRes: any;
  @ViewChild('submitpaginator') submitpaginator: MatPaginator;
  resultsSubmittedLength: any;
  perpage = constant.itemsPerPage;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.getOfferProposallist();
    this.getInviteProposallist();
    this.getActiveProposallist();
    this.getSubmittedProposallist();
    // this.getclientlocationfunc();
  }
  /** Common interger convert function for table serial number display functionality */
  ConvertToInt(val) {
    return parseInt(val);
  }
  /** Offer Proposal data's display to the table*/
  getOfferProposallist(page = 1) {
    let oUrl = constant.apiurl + constant.offerList + `?freelancer=${this.userID}&page=${page}&offer_status=Pending`;
    this.apiService.getRequest(oUrl)
      .map(data => {
        this.offerRes = data;
        this.resultsOfferLength = this.offerRes.body.count;
        return this.offerRes.body.results;
      }).subscribe(responseData => {
        this.offerDataSource = responseData;
        this.offerDataSource.paginator = this.offerpaginator;
      });
  }
  /** Offer material table page event call */
  onOfferPaginateChange(pageEvent) {
    this.offerPageEvent = pageEvent;
    this.getOfferProposallist(pageEvent.pageIndex + 1);
  }
  /** Invite Proposal data's display to the table*/
  getInviteProposallist(page = 1) {
    this.apiService.getRequest(constant.apiurl + constant.getinvitelist + `?freelancer=${this.userID}&page=${page}&status=Request&job__status=Open`)
      .map(data => {
        this.inviteRes = data;
        this.resultsInviteLength = this.inviteRes.body.count;
        return this.inviteRes.body.results;
      }).subscribe(responseData => {
        this.inviteDataSource.data = responseData;
        // console.log(responseData)
        // this.inviteDataSource.paginator = this.invitepaginator;
        // console.log(this.inviteDataSource)
      });
  }
  /** Invite material table page event call */
  onInvitePaginateChange(pageEvent) {
    this.invitePageEvent = pageEvent;
    console.log(this.invitePageEvent)
    let test = pageEvent.pageIndex + 1;
    this.getInviteProposallist(test);
  }
  /** Active Proposal data's display to the table*/
  getActiveProposallist(page = 1) {
    this.apiService.getRequest(constant.apiurl + constant.job_proposal + `?user=${this.userID}&page=${page}&offer_status=Accept`)
      .map(data => {
        this.activeRes = data;
        this.resultsActiveLength = this.activeRes.body.count;
        return this.activeRes.body.results;
      }).subscribe(responseData => {
        this.activeDataSource = responseData;
        this.activeDataSource.paginator = this.activepaginator;
      });
  }
  /** active material table page event call */
  onActivePaginateChange(pageEvent) {
    this.activePageEvent = pageEvent;
    this.getActiveProposallist(pageEvent.pageIndex + 1);
  }
  /** Submitted Proposal data's display to the table*/
  getSubmittedProposallist(page = 1) {
    this.apiService.getRequest(constant.apiurl + constant.job_proposal + `?user=${this.userID}&page=${page}&job__status=Accept`)
      .map(data => {
        this.submittedRes = data;
        this.resultsSubmittedLength = this.submittedRes.body.count;
        return this.submittedRes.body.results;
      }).subscribe(responseData => {
        this.submittedDataSource = responseData;
        this.submittedDataSource.paginator = this.submitpaginator;
      });
  }
  /** submitted material table page event call */
  onSubmitPaginateChange(pageEvent) {
    this.submittedPageEvent = pageEvent;
    this.getSubmittedProposallist(pageEvent.pageIndex + 1);
  }
  // getclientlocation:any;
  // getclientlocationfunc(){
  //   this.apiService.getRequest('http://ip-api.com/json')
  //     .subscribe(data => {
  //       console.log(data)
  //     });
  // }
}
