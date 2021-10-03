import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl , Validators } from '@angular/forms';

@Component({
  selector: 'app-testcategorylist',
  templateUrl: './testcategorylist.component.html',
  styleUrls: ['./testcategorylist.component.css']
})
export class TestcategorylistComponent implements OnInit {
  userID = this.apiService.decodejwts().userid; // logged user id
  // Define & Declare the Skill test table data's display
  skilltestPageEvent: PageEvent;
  displayedSkilltestColumns: string[] = ['no', 'title', 'category_name', 'test_taken', 'test_score', 'qualified_freelancer'];
  skilltestDataSource = new MatTableDataSource(this.skilltestDataSource);
  perpage = constant.itemsPerPage;
  skilltestRes: any;
  @ViewChild('skilltestpaginator') skilltestpaginator: MatPaginator;
  resultsSkilltestLength: any;
  pageno: any;
  // Test Category List variable declaration
  testCateRes: any;
  testCategoryList: any;
  // Filter variable declaration
  testCateID: any = '';
  @ViewChild('keywordsearch') keywordsearch: ElementRef;
  displayResetButton = false;
  searchDisplayForm: FormGroup;
  Paginatorhidder:boolean;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router:Router, 
  ) {
    this.searchDisplayForm = fb.group({
      'search_category' : null
      });
  }

  ngOnInit() {
    this.gettTestCategoryList();
    this.getSkilltestlist();
    this.skilltestpaginator._intl.nextPageLabel = 'Continue';
  }
  /** Get Test Category List for table filter functionality */
  gettTestCategoryList() {
    this.apiService.getRequest(constant.apiurl + constant.getskilltestcategorylist)
    .subscribe(data => {
      this.testCateRes = data;
      if (this.testCateRes !== '' && this.testCateRes.status === 200) {
        this.testCategoryList = this.testCateRes.body;
        this.testCategoryList.unshift({'id': '', 'name': 'All Category'}); // Push the array element first array value
        this.searchDisplayForm.patchValue({
          'search_category' : ''
        });
      }
    });
  }

  /** Common interger convert function for table serial number display functionality */
  ConvertToInt(val) {
    return parseInt(val);
  }
  /** Offer Proposal data's display to the table*/
  getSkilltestlist(page = 1, cateID = '', keyword = '') {
    this.apiService.getRequest(constant.apiurl + constant.getskilltest + '?category=' + cateID + '&search=' + keyword + '&page=' + page)
    .map(data => {
      this.skilltestRes = data;
      this.resultsSkilltestLength = this.skilltestRes.body.count;
      if (this.resultsSkilltestLength > 10) {
        this.Paginatorhidder = true;
      } else {
        this.Paginatorhidder = false;
      }
      return this.skilltestRes.body.results;
    }).subscribe(responseData => {
      this.skilltestDataSource = responseData;
      this.skilltestDataSource.paginator = this.skilltestpaginator;
    });
  }
  /** Offer material table page event call */
  onSkilltestPaginateChange(pageEvent) {
    this.skilltestPageEvent = pageEvent;
    this.pageno = pageEvent.pageIndex + 1;
    this.getSkilltestlist(pageEvent.pageIndex + 1);
  }

  onSelectedTestCategory(testCateId) {
    this.displayResetButton = true;
    this.testCateID = testCateId;
  }

  onSearchSkillTest() {
    this.skilltestPageEvent = null;
    this.skilltestpaginator.pageIndex = 0;
    this.skilltestDataSource.paginator = this.skilltestpaginator;
    this.displayResetButton = true;
    this.getSkilltestlist(1, this.testCateID, this.keywordsearch.nativeElement.value);
  }

  onSearchReset() {
    this.skilltestPageEvent = null;
    this.skilltestpaginator.pageIndex = 0;
    this.skilltestDataSource.paginator = this.skilltestpaginator;
    this.displayResetButton = false;
    this.keywordsearch.nativeElement.value = '';
    this.testCateID = '';
    this.searchDisplayForm.patchValue({
      'search_category' : ''
    });
    this.getSkilltestlist(1, '', '');
  }
  testHeaderSet(event){
    localStorage.setItem('hdr',event.group_name)
    let  nav = '/testdetails/'+event.group_id;
    this.router.navigate([nav]);
  }

  getScoreDetails(element){
    let url = '/test/score/'+element.group_id;
    sessionStorage.setItem('getBtnTemp','yes')
    this.router.navigate([url]);
  }

}
