import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta, DOCUMENT } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { constant } from '../../../../data/constant';
import { ApiService } from '../../../services/api/api.service';
import { UserService } from '../../../services/sync/user.service';

@Component({
  selector: 'app-cmspage',
  templateUrl: './cmspage.component.html',
  styleUrls: ['./cmspage.component.css']
})
export class CmspageComponent implements OnInit {
  title: any;
  desc: any;
  resCmsData: any;
  constructor(
    public activatedRoute: ActivatedRoute,
    public router: Router,
    private apiService: ApiService,
    private usersService: UserService,
    private titleService: Title,
    private metaService: Meta
  ) { }

  ngOnInit() {
    const alias = this.activatedRoute.snapshot.paramMap.get('alias');
    let url = constant.apiurl + constant.getcmspage + '?slug=' + alias;
    this.apiService.getRequest(url).subscribe(data => {
      this.resCmsData = data;
      if (this.resCmsData.status === 200 && this.resCmsData.body.length !== 0) {
        this.title = this.resCmsData.body[0].title;
        this.desc = this.resCmsData.body[0].description;
        this.metaService.removeTag("property='description'");
        this.metaService.removeTag("property='keyword'");
        this.titleService.setTitle(this.title);
        this.metaService.addTag({ property: 'keyword', content: this.resCmsData.body[0].meta_key });
        this.metaService.addTag({ property: 'description', content: this.desc });
        if (this.resCmsData.body[0].status !== 'Active') {
          this.usersService.snackErrorMessage('Invaild page');
        } else {
          if (this.resCmsData.body[0].allow_guest === 'no') {
            if (this.apiService.decodejwts().userid == null) {
              this.usersService.snackErrorMessage('Access Denied');
              this.router.navigateByUrl('/');
            }
          }
        }
      } else {
        this.usersService.snackErrorMessage('Invaild page');
        this.router.navigateByUrl('/');
      }
    });
  }

}
