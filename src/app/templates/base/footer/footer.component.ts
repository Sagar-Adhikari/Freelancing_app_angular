import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import * as moment from 'moment';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  year = moment().format("YYYY");  

  constructor(private apiFooter: ApiService) { }

  ngOnInit() {
  }

}
