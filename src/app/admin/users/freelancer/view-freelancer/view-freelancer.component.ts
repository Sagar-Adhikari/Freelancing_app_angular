import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog} from '@angular/material';

import { ApiService } from '../../../../services/api/api.service';
import { constant } from '../../../../../data/constant';
import { FlplayvideodialogComponent } from '../../../../templates/base/freelancedialogs/flplayvideodialog/flplayvideodialog.component';


@Component({
  selector: 'app-view-freelancer',
  templateUrl: './view-freelancer.component.html',
  styleUrls: ['./view-freelancer.component.css']
})
export class ViewFreelancerComponent implements OnInit {

  jobdescription; jobvideo;apiUrl;userID;
  jobvideotype; jobhourlyrate = 0; skills; skillId; available; expected;
  resultData:any;
  profileDetails:any;
  profileImage = 'assets/images/profile_default.png';
  copylink = '';
  firstName;
  lastName;
  jobtitle;
  country;
  state;
  allCategory;
  english_level;
  image_url = constant.imgurl;
  textLength = 150;
  is_success:boolean = false;
  initialDocData: any;
  initialDocumentData: any;
  initialTextLength = 150;
  morelessText = 'More';
  docurls = [];
  selectedAvailable; findselectedAvailable: any;

  otherExpResultData: any = [];
  eduResultData: any = [];
  empResultData: any = [];
  portResultData: any = [];

  dailytypes = [
    { 'key': '1', 'name': 'More than 30 hrs/week' },
    { 'key': '2', 'name': 'Less than 30 hrs/week' },
    { 'key': '3', 'name': 'As Needed - Open to Offers' },
  ];
  errormessage:string = "";
  ismessage:boolean = false;
  isLoadingResults:boolean = false;
  displayColor = '';
  constructor(
    private route:ActivatedRoute,
    public router: Router,
    public dialog: MatDialog,
    private apiService : ApiService ) { }

  ngOnInit() { 
    this.apiUrl = constant.apiurl;
    this.getFreelancer();
    this.getAllCategory();
    this.getOtherExp();
    this.getEducation();
    this.getUserDocument();
    this.getEmpoly();
    this.getPortfolio();
  }
  onMoreFun(textlength, findText) {
    if ( findText === 'More') {
      this.textLength = textlength;
      this.morelessText = 'Less';
    } else {
      this.textLength = 150;
      this.morelessText = 'More';
    }
    this.morelessText = this.morelessText;
    if ( this.jobdescription.length < this.initialTextLength ) {
      this.morelessText = '';
    }
  }
  getUserDocument() {
    const id = this.route.snapshot.paramMap.get('id');
    this.apiService.getRequest(constant.apiurl + constant.getDocument + id + '/').subscribe(
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
  
  getFreelancer(){
    const id = this.route.snapshot.paramMap.get('id');
    this.userID = id;
    this.copylink = constant.siteBaseUrl + '/freelancerview/' + id;
    var url = this.apiUrl + constant.freelancerView+id+'/';
    this.apiService.getRequest(url).subscribe(result => {
      this.resultData = result;
	 },error => {
	    this.errormessage = error.error.non_field_errors["0"];
	    this.showError();
	 },() => {
      // this.userinfo = this.results.body;
      this.isLoadingResults = true;
      if (this.resultData.body !== []) {
        this.profileDetails = this.resultData.body;
        this.profileImage = this.profileDetails.profile.avatar !== '' && this.profileDetails.profile.avatar !== null ? this.image_url + this.profileDetails.profile.avatar : this.profileImage;
        this.firstName = this.profileDetails.first_name;
        this.lastName = this.profileDetails.last_name;

        this.country = this.profileDetails.profile.country;
        this.state = this.profileDetails.profile.state;
        this.jobtitle = this.profileDetails.profile.title;
        this.jobdescription = this.profileDetails.profile.description;
        this.jobvideo = this.profileDetails.profile.video_url;
        this.jobvideotype = this.profileDetails.profile.video_type;
        this.jobhourlyrate = this.profileDetails.profile.hourly_rate;
        this.skills = this.profileDetails.profile.offer_skill != '' && this.profileDetails.profile.offer_skill != null ? this.profileDetails.profile.offer_skill.split(',') : [];
        this.skillId = this.profileDetails.profile.category_skill;
        this.available = this.profileDetails.profile.daily_availability;
        this.expected = this.profileDetails.profile.expected_availability;
        this.findselectedAvailable = this.dailytypes.find( row => row.key == this.available);
        if (this.findselectedAvailable !== [] && this.findselectedAvailable != null) {
          this.selectedAvailable = this.findselectedAvailable.name;
        }
        if ( this.jobdescription.length < this.initialTextLength ) {
          this.morelessText = '';
        }
        this.english_level = this.profileDetails.profile.english_level;
      }
   });
  }

  showError() {
    this.ismessage = true;          
    setTimeout(() => {
      this.ismessage = false;
    }, 2000);       
  }
  getAllCategory() {
    this.apiService.getRequest(constant.apiurl + constant.job_category_all + '?search=')
      .subscribe(responseData => {
        this.allCategory = responseData['body'];
      });
  }
  skillBasedSearch(skill) {
    this.router.navigate(['/search/freelancers/'+skill]);
  }
  getOtherExp() {
    this.apiService.getRequest(this.apiUrl + constant.saveotherexp + '?user=' + this.userID ).subscribe(
      data => {
        this.otherExpResultData = data['body']['results'];
      });
  }
  getEducation() {
    this.apiService.getRequest(this.apiUrl + constant.educationupdate + '?user=' + this.userID).subscribe(
      data => {
        this.eduResultData = data['body']['results'];
      });
  }
  getEmpoly() {
    this.apiService.getRequest(this.apiUrl + constant.emp_url + '?user=' + this.userID).subscribe(
      data => {
        this.empResultData = data['body']['results'];
      });
  }
  getPortfolio() {
    this.apiService.getRequest(this.apiUrl + constant.portfolio_url + '?user=' + this.userID).subscribe(
      data => {
        this.portResultData = data['body']['results'];
      });
  }
  onPlayVideo() {
    if(this.jobvideo == null){
      return false;
    }
    const dialogPlayVideo = this.dialog.open(FlplayvideodialogComponent, {
      disableClose: true,
      data: {
        'content': {
          'video': this.jobvideo
        }
      }
    });
  }

  displayCopyColor() {
    this.is_success = true;
    setTimeout(() => {
        this.is_success = false;
      }, 1000);
  }

}
