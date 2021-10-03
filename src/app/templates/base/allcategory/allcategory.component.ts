import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
@Component({
  selector: 'app-allcategory',
  templateUrl: './allcategory.component.html',
  styleUrls: ['./allcategory.component.css']
})
export class AllcategoryComponent implements OnInit {
  allCategorys: any;
  getbackupcategory: any;
  categoryName  = '';
  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) { }
  /*
  * Page : /allcategory
  * Decription : Get All Category List
  * Modified Date : 05/06/2018
  * Created By : Ananth
  * Author : Bsetec
  */
  ngOnInit() {
    this.route.params.subscribe(params => {
      const urlParamsVal = params['category'];
      if (urlParamsVal !== '') {
        this.categoryName = urlParamsVal;
      }
    });
    this.getAllCategory();
  }

  getAllCategory() {
    this.apiService.getRequest(constant.apiurl + constant.job_category_all + '?search=')
      .subscribe(responseData => {
        this.allCategorys = responseData['body'];
        // console.log(this.allCategorys)
        this.getbackupcategory = this.allCategorys;
        if (this.categoryName !== '') {
          let getval: string[] = [];
          let data = this.categoryName;
          let getsearchfromobject = this.getbackupcategory.map(function(a) {
            let getstr = a.name;
            let vals = getstr.search(data);
            if(vals >= 0){
              getval.push(a);
            }
          });
          this.allCategorys =  getval;
        }
      },
      err => {
        console.log(err);
    });
  }

  searchbycategory(event) {
    let getloadedcategory = this.allCategorys;
    if (event.target.value === '') {
      this.allCategorys = this.getbackupcategory;
    } else {
      let getvalues: string[] = [];
      this.getbackupcategory.filter((m)=>{
        if(m.name.toLowerCase().includes(event.target.value.toLowerCase())){
          getvalues.push(m);
        }
      });
      this.allCategorys =  getvalues;
    }
  }

}
