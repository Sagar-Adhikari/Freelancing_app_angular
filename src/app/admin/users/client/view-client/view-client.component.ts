import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.css']
})
export class ViewClientComponent implements OnInit {

  results:any;
  userinfo:any;
  userid:any;
  errormessage:string = "";
  ismessage:boolean = false;
  isLoadingResults:boolean = false;
  profileImage = 'assets/images/profile_default.png';
  image_url = constant.imgurl;
  companyresult: any;
  initialDocData: any;
  initialDocumentData: any;
  company_id:any;
  docurls = [];
  company_name="";
  company_website="";
  company_tagline="";
  company_description="";
  isLoadCompany:boolean = false;
  constructor( private route:ActivatedRoute, private api : ApiService ) { }

  ngOnInit() {
    this.getClient();
    this.getUserDocument();
    this.getUserCompany();
  }

  getClient(){
    const id = this.route.snapshot.paramMap.get('id');
    this.userid = id;
    var url = constant.apiurl + constant.clientView+id+'/';
    this.api.getRequest(url).subscribe(result => {
      this.results = result;
	 },error => {
	    this.errormessage = error.error.non_field_errors["0"];
	    this.showError();
	 },() => {
      this.userinfo = this.results.body;
      this.profileImage = this.userinfo.profile.avatar !== '' && this.userinfo.profile.avatar !== null ? this.image_url + this.userinfo.profile.avatar : this.profileImage;
      this.isLoadingResults = true;
   });
  }

  getUserDocument() {
    const id = this.route.snapshot.paramMap.get('id');
    this.api.getRequest(constant.apiurl + constant.getDocument + id + '/').subscribe(
      data => {
        this.docurls = [];
        this.initialDocumentData = data;
        if (this.initialDocumentData.status === 200) {
          this.initialDocData = this.initialDocumentData.body;
          var files = this.initialDocData.files;
          var ids = this.initialDocData.file_id;
          for (let i = 0; i < files.length; i++) {
            if(files[i] != ''){
              var fileName = files[i].replace(/^.*[\\\/]/, '');
              var fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1);
              if(fileExtension == 'pdf'){
                var image = 'assets/images/pdf.png'; 
              }else if(fileExtension == 'doc' || fileExtension == 'docx'){
                var image = 'assets/images/doc.png'; 
              }else{
                var image = constant.imgurl + files[i];
              }
              
              this.docurls.push({
              'file': constant.imgurl + files[i],
              'image': image,
              'id': constant.apiurl + constant.deleteDocument + ids[i] + '/'
              });
            }
          }
        }
      }, err => {
        console.log(err);
      });
  }

  getUserCompany() { 
    this.api.getRequest(constant.apiurl + constant.clientCompany+'?user='+this.userid).subscribe(
      data => {
        this.companyresult = data;
        if(this.companyresult.body.results.length > 0){
          this.companyresult.results = this.companyresult.body.results[0];
          this.company_id = this.companyresult.results.id;
          this.company_name = this.companyresult.results.name;
          this.company_website = this.companyresult.results.website;
          this.company_tagline = this.companyresult.results.tag_line;
          this.company_description = this.companyresult.results.description;
          this.isLoadCompany = true;
        }
      }, err => {
        console.log(err);
    });
  }

  showError() {
    this.ismessage = true;          
    setTimeout(() => {
      this.ismessage = false;
    }, 2000);       
  }

}
