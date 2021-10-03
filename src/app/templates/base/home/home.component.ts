import { Component, ChangeDetectorRef, Inject, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { Broadcast } from '../../../../model/broadcast';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { environment } from './../../../../environments/environment';
import { UserService } from './../../../services/sync/user.service';
import { Metadata } from '../../../../model/metadata';
import { Setting } from '../../../../model/setting';
import { Observable } from 'rxjs/Observable';
import { TestimonialPopupComponent } from './../testimonial-popup/testimonial-popup.component';
import { MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private querystring;
  data: any;
  result = [];
  skills = [];
  testimonials = [];
  categories: any = [];
  static_data: any = [];
  loading = true;
  isDataAvailable = false;
  video_url: any;
  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private usersService: UserService,
    @Inject(DOCUMENT) private document: HTMLDocument
  ) { }

  ngOnInit() {
    // this.homeData();
    this.querystring = '';
    this.apiService.getRequest(constant.apiurl + constant.homeurl + '/').subscribe( data => {
      this.data = data;
      this.isDataAvailable = true;
      this.static_data = this.data.body.options;
      this.data.body.skills.map(skills_info => {
        return skills_info;
      }).forEach(skills_info => this.skills.push(skills_info));

      this.data.body.testimonial.map(tests_info => {
        return tests_info;
      }).forEach(tests_info => this.testimonials.push(tests_info));
      this.data.body.category.map(cats_info => {
        return cats_info;
      }).forEach(cats_info => this.categories.push(cats_info));
    },
    err => {
      console.log(err);
    });
    // console.log('categories',this.categories);
  }

  homeData() {
  }

  openmodal(url) {
    const testimonials = this.dialog.open(TestimonialPopupComponent, {
      disableClose: true,
    });
    testimonials.componentInstance.video_url = url;
  }

  onMoveLayout() {
    const x: Element = document.querySelector('#wefocus');
    if (x) {
        x.scrollIntoView({behavior: 'smooth'});
    }
  }
}
