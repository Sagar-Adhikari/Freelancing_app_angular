import {Pipe, PipeTransform} from "@angular/core";
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { HttpHeaders, HttpResponse, HttpXsrfTokenExtractor, HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Pipe({name: "fileFormat"})
export class FormatFilePipe implements PipeTransform {

	constructor(private apiService: ApiService, private http: HttpClient){

	}

	results:any;
	displayE = [];
	rs:any;

    transform(value: any, file_url:any, type:any){

    	var img_type = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'];
		var excel    = ['application/vnd.ms-excel', 'application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/msword', 'application/vnd.ms-excel', 'application/zip'];
		var adobe    = ['application/pdf'];

		if(img_type.indexOf(value) > -1){
			return constant.imgurl+file_url;
		}else if(excel.indexOf(value) > -1){
			if(type=='url'){
				return constant.imgurl+file_url;	
			}else{
				return constant.siteBaseUrl+'/assets/images/thumbimg/docthumb.png';
			}
			
		}else if(adobe.indexOf(value) > -1){
			if(type=='url'){
				return constant.imgurl+file_url;	
			}else{
				return constant.siteBaseUrl+'/assets/images/thumbimg/pdfthumb.png';
			}
		}
    }
}