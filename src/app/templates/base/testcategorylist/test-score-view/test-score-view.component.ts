import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-test-score-view',
  templateUrl: './test-score-view.component.html',
  styleUrls: ['./test-score-view.component.css']
})
export class TestScoreViewComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  getGroupID = this.route.snapshot.paramMap['params'].group_id;
  scoreDetails: any;
  testCateRes: any;
  profileImage = 'assets/images/profile_default.png';
  img_url: string = constant.imgurl;
  showBtn: string;
  ngOnInit() {
    this.showBtn = sessionStorage.getItem('getBtnTemp');
     this.gettTestCategoryList();
     sessionStorage.removeItem('getBtnTemp');
  }

  gettTestCategoryList() {
    console.log(this.getGroupID)
    let apiDynamic;
    if (this.getGroupID === undefined) {
      apiDynamic = this.apiService.getRequest(constant.apiurl + constant.getTestScore)
    } else {
      apiDynamic = this.apiService.getRequest(constant.apiurl + constant.getTestScore + '?groups=' + this.getGroupID)
    }
    apiDynamic
    .subscribe(data => {
      this.scoreDetails = data['body'];
      this.testCateRes = data;
      console.log(this.testCateRes);
      if (this.testCateRes !== '' && this.testCateRes.status === 200) {
        this.scoreDetails = this.testCateRes.body;
        console.log(this.scoreDetails);
      }
    });
  }

  onClickBackBtn() {
    this.router.navigate(['search/test']);
  }
}
