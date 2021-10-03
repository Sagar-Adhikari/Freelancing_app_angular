import { Component, OnInit } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { DeleteconfirmComponent } from './../postjob/deleteconfirm/deleteconfirm.component';
import { FreelancedialogsComponent } from '../freelancedialogs/freelancedialogs.component';
import { FldescpdialogComponent } from '../freelancedialogs/fldescpdialog/fldescpdialog.component';
import { FlvideodialogComponent } from '../freelancedialogs/flvideodialog/flvideodialog.component';
import { FlplayvideodialogComponent } from '../freelancedialogs/flplayvideodialog/flplayvideodialog.component';
import { FlhourlyrateComponent } from '../freelancedialogs/flhourlyrate/flhourlyrate.component';
import { FlskilldialogComponent } from '../freelancedialogs/flskilldialog/flskilldialog.component';
import { FlotherexpdialogComponent } from '../freelancedialogs/flotherexpdialog/flotherexpdialog.component';
import { FldocumentdialogComponent } from '../freelancedialogs/fldocumentdialog/fldocumentdialog.component';
import { FledudialogComponent } from '../freelancedialogs/fledudialog/fledudialog.component';
import { FlempdialogComponent } from '../freelancedialogs/flempdialog/flempdialog.component';
import { FlavailabledialogComponent } from '../freelancedialogs/flavailabledialog/flavailabledialog.component';
import { FlportdialogComponent } from '../freelancedialogs/flportdialog/flportdialog.component';
import { FlenglangdialogComponent } from '../freelancedialogs/flenglangdialog/flenglangdialog.component';
import { FladdlangdialogComponent } from '../freelancedialogs/fladdlangdialog/fladdlangdialog.component';
import { FleditotherdialogComponent } from '../freelancedialogs/fleditotherdialog/fleditotherdialog.component';

import { ApiService } from '../../../services/api/api.service';
import { UserService } from '../../../services/sync/user.service';
import { constant } from '../../../../data/constant';
import { country } from '../../../../data/country';

@Component({
  selector: 'app-freelancerprofile',
  templateUrl: './freelancerprofile.component.html',
  styleUrls: ['./freelancerprofile.component.css']
})
export class FreelancerprofileComponent implements OnInit {
  queryUserID; userID; emailAddress; apiUrl; update_url; jobdescription; jobvideo;
  jobvideotype; jobhourlyrate = 0; skills = []; skillId; available; expected;
  responseDataOther;
  responseDataEdu;
  responseDataEmp;
  editJobTitleDisplay = false;
  editJobDescriptionDisplay = false;
  editVideoDisplay = false;
  editRateDisplay = false;
  editAvailableDisplay = false;
  editLangEngDisplay = false;
  addLangEngDisplay = false;
  displayColor = '';
  category_name;
  category_id: any;

  profileDetails: any;
  resultData: any;

  urls = [];
  docurls = [];
  multifile = [];
  initialDocumentData: any;
  initialDocData: any;

  otherExpResultData: any = [];
  DocumentResultData: any = [];
  eduResultData: any = [];
  empResultData: any = [];
  portResultData: any = [];
  deleteResponse: any = [];

  profileImage = 'assets/images/profile_default.png';
  firstName;
  lastName;
  jobtitle;
  selectedcountry;
  current_time:any;
  countries: any = country.list;
  state;
  allCategory;
  english_level;
  copylink;
  otherLangInit;
  otherLangTypeInit;
  otherLangInitRow;
  initalLangArr: any;
  otherlangIntArr: any = [];
  otherlangIntTypeArr: any = [];
  margeOtherLang: any = [];
  image_url = constant.imgurl;
  /* drop-down year */
  currentyear; formyears: any= []; toyears: any= []; toExpyears: any= [];
  dailytypes = [
    { 'key': '1', 'name': 'More than 30 hrs/week' },
    { 'key': '2', 'name': 'Less than 30 hrs/week' },
    { 'key': '3', 'name': 'As Needed - Open to Offers' },
  ];
  selectedAvailable; findselectedAvailable: any;
  textLength = 150;
  initialTextLength = 150;
  morelessText = 'More';
  initialredirectData: any;
  initialProfileRedirectData: any;
  constructor(
    private apiService: ApiService,
    private usersService: UserService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.queryUserID = this.apiService.decodejwts().userid + '/';
    this.userID = this.apiService.decodejwts().userid;
    this.copylink = constant.siteBaseUrl + 'freelancerview/' + this.userID;
    this.emailAddress = this.apiService.decodejwts().email;
    this.apiUrl = constant.apiurl;
    this.update_url = constant.updateUserDetails;

    /* Year drop-down field - start */
    const dt = new Date();
    this.currentyear = dt.getFullYear();
    for (let year = this.currentyear; year >= 1940; year--) {
      this.formyears.push({'name': year, 'value': year});
    }
    for (let year = this.currentyear + 7; year >= 1940; year--) {
      this.toyears.push({'name': year, 'value': year});
    }
    for (let year = this.currentyear; year >= 1940; year--) {
      this.toExpyears.push({'name': year, 'value': year});
    }

    setTimeout(() => {
      this.apiService.getRequest(constant.apiurl + constant.get_user_details + this.userID + '/').subscribe(
        data => {
          this.initialredirectData = data;
          if (this.initialredirectData.status === 200) {
            this.initialProfileRedirectData = this.initialredirectData.body;
            if ( this.initialProfileRedirectData.profile.category == 'None' || this.initialProfileRedirectData.profile.category == null) {
              this.router.navigate(['user/basic']);
              return false;
            } else if ( this.initialProfileRedirectData.profile.title == '' || this.initialProfileRedirectData.profile.title == null ) {
              this.router.navigate(['/freelancer/more']);
              return false;
            }
          }
        }, err => {
          console.log(err);
      });
    }, 500);


    this.getprofileDetails();
    /* Year drop-down field - end */
    this.getAllCategory();
    this.getOtherExp();
    this.getEducation();
    this.getEmpoly();
    this.getPortfolio();
    this.getUserDocument();
  }
getprofileDetails() {
  this.apiService.getRequest(this.apiUrl + this.update_url + this.queryUserID ).subscribe(
    data => {
      this.resultData = data;
      if (this.resultData.body !== []) {
        this.profileDetails = this.resultData.body;
        this.profileImage = this.profileDetails.profile.avatar !== ''
        && this.profileDetails.profile.avatar !== null ? this.image_url + this.profileDetails.profile.avatar : this.profileImage;
        this.firstName = this.profileDetails.first_name;
        this.lastName = this.profileDetails.last_name;
        this.category_name = this.profileDetails.profile.category_name;
        this.category_id = this.profileDetails.profile.category_id;
        this.selectedcountry = this.profileDetails.profile.country;
        this.current_time = this.profileDetails.profile.current_time;
        this.state = this.profileDetails.profile.state;
        this.jobtitle = this.profileDetails.profile.title;
        this.jobdescription = this.profileDetails.profile.description;
        this.jobvideo = this.profileDetails.profile.video_url;
        this.jobvideotype = this.profileDetails.profile.video_type;
        if(this.profileDetails.profile.hourly_rate == null){
          this.jobhourlyrate = 0;
        }else{
          this.jobhourlyrate = this.profileDetails.profile.hourly_rate;
        }
        this.skills = this.profileDetails.profile.offer_skill != '' && this.profileDetails.profile.offer_skill != null ? this.profileDetails.profile.offer_skill.split(',') : [];
        this.skillId = this.profileDetails.profile.category_skill;
        this.available = this.profileDetails.profile.daily_availability;
        this.expected = this.profileDetails.profile.expected_availability;
        this.findselectedAvailable = this.dailytypes.find( row => row.key == this.available);
        if (this.findselectedAvailable !== [] && this.findselectedAvailable != null) {
          this.selectedAvailable = this.findselectedAvailable.name;
        }
        this.english_level = this.profileDetails.profile.english_level;
        this.otherLangInit = this.profileDetails.profile.other_language;
        if ( this.otherLangInit !== [] && this.otherLangInit != null && this.otherLangInit != "" ) {
          this.margeOtherLang = JSON.parse(this.otherLangInit);
        }
        if (this.jobdescription != null && this.jobdescription !== '') {
          if ( this.jobdescription.length < this.initialTextLength ) {
            this.morelessText = '';
          }
        }
        // this.otherLangTypeInit = this.profileDetails.profile.interesting_categories;
        // this.findOtherLangArr(this.otherLangInit, this.otherLangTypeInit);
        // this.otherLangInit = this.profileDetails.profile.other_language == null
        // || this.profileDetails.profile.other_language === ''
        // || this.profileDetails.profile.other_language === '1' ? '' : this.profileDetails.profile.other_language;
        // console.log(this.otherLangInit);
        // console.log(JSON.parse(this.otherLangInit));
        // if (this.otherLangInit !== '' ) {
        //   console.log(this.otherLangInit);
        //   const langArr = this.otherLangInit.split(',');
        //   console.log(langArr);
        //   langArr.forEach(element => {
        //     this.otherLangInitRow = element.split(':');
        //     console.log(this.otherLangInitRow);
        //     this.initalLangArr.push(this.otherLangInitRow['0'] : this.otherLangInitRow['1']);
        //   });
        //   console.log(this.initalLangArr);
        // }
      }
    }, err => {
      console.log(err);
  });
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
  // findOtherLangArr(lang, langType) {
  //   if (lang != null && lang != '') {
  //     this.otherlangIntArr = lang.split(',');
  //   }
  //   if (langType != null && langType != '') {
  //     this.otherlangIntTypeArr = langType.split(',');
  //   }
  //   if (this.otherlangIntTypeArr.length > 0 && this.otherlangIntArr.length > 0) {
  //     let i = 0;
  //     this.otherlangIntArr.forEach(element => {
  //       this.margeOtherLang.push({'language': element, 'languageType': this.otherlangIntTypeArr[i]});
  //       i++;
  //     });
  //     console.log(this.margeOtherLang);
  //   }
  // }
  skillBasedSearch(skill) {
    this.router.navigate(['/search/freelancers/'+skill]);
  }
  getUserDocument() {
    this.apiService.getRequest(constant.apiurl + constant.getDocument + this.queryUserID).subscribe(
      data => {
        this.docurls = [];
        this.initialDocumentData = data;
        if (this.initialDocumentData.status === 200) {
          this.initialDocData = this.initialDocumentData.body;
          var files = this.initialDocData.files;
          this.DocumentResultData = files;
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
  displayCopyColor() {
    this.displayColor = '#ae2838';
  }
  getAllCategory() {
    this.apiService.getRequest(constant.apiurl + constant.job_category_all + '?search=')
      .subscribe(responseData => {
        this.allCategory = responseData['body'];
      });
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
  editFreeJobTitle() {
    const dialogEditTitle = this.dialog.open(FreelancedialogsComponent, {
      disableClose: true,
      data: {
        'api_url': this.apiUrl,
        'update_url': this.update_url,
        'user_id': this.queryUserID,
        'email': this.emailAddress,
        'content': this.jobtitle
      }
    });

    dialogEditTitle.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.jobtitle = result.title;
        this.usersService.snackMessage('User Job Title Updated');
      }
    });
  }

  editJobDescrip() {
    const dialogEditDescp = this.dialog.open(FldescpdialogComponent, {
      disableClose: true,
      data: {
        'api_url': this.apiUrl,
        'update_url': this.update_url,
        'user_id': this.queryUserID,
        'email': this.emailAddress,
        'content': this.jobdescription
      }
    });

    dialogEditDescp.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.jobdescription = result.description;
        this.usersService.snackMessage('User Job Description Updated');
      }
    });
  }

  editJobVideo() {
    const dialogEditVideo = this.dialog.open(FlvideodialogComponent, {
      disableClose: true,
      data: {
        'api_url': this.apiUrl,
        'update_url': this.update_url,
        'user_id': this.queryUserID,
        'email': this.emailAddress,
        'content': {
          'video': this.jobvideo,
          'type': this.jobvideotype
        }
      }
    });

    dialogEditVideo.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.jobvideo = result.content.video;
        this.jobvideotype = result.content.type;
        this.usersService.snackMessage('User Job Video Updated');
      }
    });
  }

  onPlayVideo() {
    if (this.jobvideo == null) {
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

  editHourlyRate() {
    const dialogEditRate = this.dialog.open(FlhourlyrateComponent, {
      disableClose: true,
      data: {
        'api_url': this.apiUrl,
        'update_url': this.update_url,
        'user_id': this.queryUserID,
        'email': this.emailAddress,
        'content': {
          'hourly_rate': this.jobhourlyrate,
        }
      }
    });

    dialogEditRate.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.jobhourlyrate = result.content.hourly_rate;
        this.usersService.snackMessage('User Job Hourly Rate Updated');
      }
    });
  }

  editSkills() {
    const dialogEditSkill = this.dialog.open(FlskilldialogComponent, {
      disableClose: true,
      data: {
        'api_url': this.apiUrl,
        'update_url': this.update_url,
        'skill_url': constant.skills_creation,
        'all_skill': constant.getallskill,
        'user_id': this.queryUserID,
        'email': this.emailAddress,
        'content': {
          'skills': this.skills,
          'skills_id': this.skillId,
          'category_name': this.category_name,
          'category_id': this.category_id
        }
      }
    });
    dialogEditSkill.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.skills = result.content.skills.split(',');
        this.skillId = result.content.skill_ids;
        this.usersService.snackMessage('User Job Skill details Updated');
      }
    });
  }

  editOtherExp(action, other_id = '', subject = '', description = '') {
    const dialogEditOtherExp = this.dialog.open(FlotherexpdialogComponent, {
      disableClose: true,
      data: {
        'api_url': this.apiUrl,
        'update_url': this.update_url,
        'saveotherskill': constant.saveotherexp,
        'user_id': this.userID,
        'other_id' : other_id,
        'other_subject' : subject,
        'other_description' : description,
        'action' : action
      }
    });
    dialogEditOtherExp.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.getOtherExp();
        let notificationMsg = 'New Other Experience Added';
        if (result.action === 'edit') {
          notificationMsg = 'Other Experience Details Updated';
        }
        this.usersService.snackMessage(notificationMsg);
      }
    });
  }

  deleteOtherExp(other_id) {
    const deleteConfirmdialog = this.dialog.open(DeleteconfirmComponent, {
      disableClose: true,
      data: {}
    });
    deleteConfirmdialog.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        const URL = this.apiUrl + constant.saveotherexp + other_id + '/';
        this.apiService.deleteRequest(URL, '').subscribe(response => {
          this.responseDataOther = response;
          if (this.responseDataOther.status === 204) {
            this.getOtherExp();
            this.usersService.snackMessage('Other Experience Deleted Successfully');
          }
        });
      }
    });
  }

  editDocument() {
    const dialogEditDocument = this.dialog.open(FldocumentdialogComponent, {
      disableClose: true,
      data: {
        'api_url': this.apiUrl,
        'user_id': this.userID
      }
    });
    dialogEditDocument.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.getUserDocument();
        let notificationMsg = 'New document Added';
        this.usersService.snackMessage(notificationMsg);
      }
    });
  }
  
  documentDeleteSubmit(url) {
    if(confirm('Are you sure to delete ??')) {
      this.apiService.deleteRequest(url,'').subscribe(
      data => {
        this.getUserDocument();
        let notificationMsg = 'Deleted successfully';
        this.usersService.snackMessage(notificationMsg);
      }, err => {
        let notificationMsg = 'Not Deleted';
        this.usersService.snackMessage(notificationMsg);
      });
    }
  }

  editEdu(action, eduID = '', organization = '', year_from = '', year_to = '', degree = '', area = '', description = '') {
    const dialogEditEdu = this.dialog.open(FledudialogComponent, {
      disableClose: true,
      data: {
        'api_url': this.apiUrl,
        'update_url': this.update_url,
        'save_edu': constant.educationupdate,
        'user_id': this.userID,
        'from_year' : this.formyears,
        'to_year' : this.toyears,
        'action' : action,
        'organization': organization,
        'year_from': Number(year_from),
        'year_to': Number(year_to),
        'degree': degree,
        'area': area,
        'description': description,
        'edu_id': eduID
      }
    });
    dialogEditEdu.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        let notificationMsg = 'New Education details Added';
        if (result.action === 'edit') {
          notificationMsg = 'Education Details Updated';
        }
        this.getEducation();
        this.usersService.snackMessage(notificationMsg);
      }
    });
  }

  deleteEduc(eduId) {
    const deleteConfirmdialog = this.dialog.open(DeleteconfirmComponent, {
      disableClose: true,
      data: {}
    });
    deleteConfirmdialog.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        const URL = this.apiUrl + constant.educationupdate + eduId + '/';
        this.apiService.deleteRequest(URL, '').subscribe(response => {
          this.responseDataEdu = response;
          if (this.responseDataEdu.status === 204) {
            this.getEducation();
            this.usersService.snackMessage('Education detail Deleted Successfully');
          }
        });
      }
    });
  }

  editEmp(action,
    empId = '',
    organization= '',
    currently_working_here = false,
    location = '',
    country = '', title = '', role = '', year_from = '', year_to = '', description = '' ) {
    const dialogEditEmp = this.dialog.open(FlempdialogComponent, {
      disableClose: true,
      data: {
        'api_url': this.apiUrl,
        'update_url': this.update_url,
        'emp_url': constant.emp_url,
        'user_id': this.userID,
        'action' : action,
        'from_year' : this.formyears,
        'to_year' : this.toExpyears,
        'organization': organization,
        'location': location,
        'country': country,
        'title': title,
        'role': role,
        'year_from': Number(year_from),
        'year_to': Number(year_to),
        'currently_working_here': currently_working_here,
        'description': description,
        'emp_id' : empId
      }
    });
    dialogEditEmp.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        let notificationMsg = 'New Employment details Added';
        if (result.action === 'edit') {
          notificationMsg = 'Employment Details Updated';
        }
        this.getEmpoly();
        this.usersService.snackMessage(notificationMsg);
      }
    });
  }

  deleteEmp(empId) {
    const deleteConfirmdialog = this.dialog.open(DeleteconfirmComponent, {
      disableClose: true,
      data: {}
    });
    deleteConfirmdialog.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        const URL = this.apiUrl + constant.emp_url + empId + '/';
        this.apiService.deleteRequest(URL, '').subscribe(response => {
          this.responseDataEmp = response;
          if (this.responseDataEmp.status === 204) {
            this.getEmpoly();
            this.usersService.snackMessage('Employment detail Deleted Successfully');
          }
        });
      }
    });
  }

  editAvailable() {
    const dialogAvailable = this.dialog.open(FlavailabledialogComponent, {
      disableClose: true,
      data: {
        'api_url': this.apiUrl,
        'update_url': this.update_url,
        'email' : this.emailAddress,
        'user_id': this.userID,
        'initialAvailable': this.available,
        'initialexcepted': this.expected,
      }
    });
    dialogAvailable.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.available = result.available;
        this.expected = result.expected;
          this.findselectedAvailable = this.dailytypes.find( row => row.key == this.available);
          if ( this.findselectedAvailable !== [] && this.findselectedAvailable != null) {
            this.selectedAvailable = this.findselectedAvailable.name;
          }
          this.usersService.snackMessage('Available Details Updated');
      }
    });
  }

  addPortfolio(action,
    portid = '', project_title = '', project_categories = '',
    project_subcategories = '', project_url = '', completion_date = '',
    skills = '', project_image = '', project_file = '', project_overview = '', categoryname = '') {
    const dialogPort = this.dialog.open(FlportdialogComponent, {
      disableClose: true,
      data: {
        'api_url': this.apiUrl,
        'update_url': constant.portfolio_url,
        'user_id': this.userID,
        'action': action,
        'portid' : portid,
        'project_title' : project_title,
        'project_categories': project_categories,
        'project_subcategories': project_subcategories,
        'project_url': project_url,
        'completion_date': completion_date,
        'skills': skills,
        'project_image': project_image,
        'project_file': project_file,
        'project_overview': project_overview,
        'categoryname': categoryname
      }
    });
    dialogPort.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.getPortfolio();
        let notificationMsg = 'Portfolio Details Added';
        if (result.action === 'edit') {
          notificationMsg = 'Portfolio Details Updated';
        }
        this.usersService.snackMessage(notificationMsg);
      }
    });
  }

  portDelete(portId) {
    const deleteConfirmdialog = this.dialog.open(DeleteconfirmComponent, {
      disableClose: true,
      data: {}
    });
    deleteConfirmdialog.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        const URL = this.apiUrl + constant.portfolio_url + portId + '/';
        this.apiService.deleteRequest(URL, '').subscribe(response => {
          this.responseDataEmp = response;
          if (this.responseDataEmp.status === 204) {
            this.getPortfolio();
            this.usersService.snackMessage('Portfolio Deleted Successfully');
          }
        });
      }
    });
  }

  editEngLang() {
    const dialogEnglang = this.dialog.open(FlenglangdialogComponent, {
      disableClose: true,
      data: {
        'api_url': this.apiUrl,
        'update_url': this.update_url,
        'email' : this.emailAddress,
        'user_id': this.userID,
        'english_level':  this.english_level
      }
    });
    dialogEnglang.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.english_level = result.english_level;
        this.usersService.snackMessage('Language Details Updated');
      }
    });
  }

  addEngLang() {
    const dialogAddLang = this.dialog.open(FladdlangdialogComponent, {
      disableClose: true,
      data: {
        'api_url': this.apiUrl,
        'update_url': this.update_url,
        'email' : this.emailAddress,
        'user_id': this.userID,
        'all_lang': constant.all_language,
        'init_lang': this.margeOtherLang ? this.margeOtherLang : []
      }
    });
    dialogAddLang.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.margeOtherLang = [];
        this.margeOtherLang = result.other_language;
        this.usersService.snackMessage('Language Added Successfully');
      }
    });
  }

  editOtherLang(index, otherLanguageArr) {
    const dialogEditLang = this.dialog.open(FleditotherdialogComponent, {
      disableClose: true,
      data: {
        'api_url': this.apiUrl,
        'update_url': this.update_url,
        'email' : this.emailAddress,
        'user_id': this.userID,
        'all_lang': constant.all_language,
        'lang_arr': otherLanguageArr,
        'lang_index': index
      }
    });
    dialogEditLang.afterClosed().subscribe(result => {
      if (result.status === 'success') {
        this.margeOtherLang = [];
        this.margeOtherLang = result.other_language;
        this.usersService.snackMessage('Language Updated Successfully');
      }
    });
  }

  deleteOtherLang(index) {
    const deleteConfirmdialog = this.dialog.open(DeleteconfirmComponent, {
      disableClose: true,
      data: {}
    });
    deleteConfirmdialog.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.margeOtherLang.splice(index, 1);
        const params = {
          'id': this.queryUserID,
          'email': this.emailAddress,
            'profile': {
              'other_language': JSON.stringify(this.margeOtherLang)
            }
          };
          this.apiService.putRequest(this.apiUrl + this.update_url + this.queryUserID, params ).subscribe(
            data => {
              this.deleteResponse = data;
              if (this.deleteResponse.body !== '') {
                this.usersService.snackMessage('Language Deleted');
              }
            }, err => {
              console.log(err);
            });
      }
    });
  }

  downloadFileThirdParty(fileUrl) {
    console.log(fileUrl);
    this.apiService.downloadFile(fileUrl).subscribe(data => {
      console.log(data);
    });
  }

}
