import { Component, OnInit, Inject, NgModule, ViewChild } from '@angular/core';
import { DomSanitizer, BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ngx-img-cropper';
import { ApiService } from '../../../services/api/api.service';
import { constant } from '../../../../data/constant';
import { UserService } from '../../../services/sync/user.service';
import * as $ from 'jquery';

@Component({
	selector: 'app-profileimage',
	templateUrl: './profileimage.component.html',
	styleUrls: ['./profileimage.component.css']
})
export class ProfileimageComponent implements OnInit {

	private querystring;
	result: any;
	name: string;
	data: any;
	cropperSettings: CropperSettings;
	croppedWidth: number;
	croppedHeight: number;
	ismessage = false;
	isbuttondisable = false;
	changeUrl: any;
	profile_img: any;
	errormessage: string;
	getImg: any;
	user_id: string = this.apiService.decodejwts().userid;
	resultImageUpload: any;
	filePath: String;
	accountresult: any;
	initialImage;
	fileType;
	fileName;
	image_url = constant.imgurl;

	@ViewChild('cropper', undefined) cropper: ImageCropperComponent;
	public allowedMimeType = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
	public uploader: FileUploader = new FileUploader({
		url: constant.apiurl + constant.fileupload,
		headers: [{
			name: 'Authorization',
			value: this.authHeader
		}],
		additionalParameter: {
			user: this.user_id,
			type: 'Jobs',
			file_name: this.fileName,
			file_ext: this.fileType
		}
	});
	public get authHeader(): string {
		return `JWT ${localStorage.getItem('exp_token')}`;
	}

	constructor(
		@Inject(MAT_DIALOG_DATA) public getdata: any,
		private fb: FormBuilder,
		public dialogRefimage: MatDialogRef<ProfileimageComponent>,
		private sanitizer: DomSanitizer,
		private apiService: ApiService,
		private snackBar: MatSnackBar,
		private userService: UserService
	) {
		this.cropperSettings = new CropperSettings();
		this.cropperSettings.noFileInput = true;
		this.cropperSettings.croppedWidth = 200;
		this.cropperSettings.croppedHeight = 200;
		this.cropperSettings.rounded = true;
		this.cropperSettings.minWithRelativeToResolution = false;
		this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
		this.cropperSettings.cropperDrawSettings.strokeWidth = 2;
		this.cropperSettings.keepAspect = true;
		this.cropperSettings.touchRadius = 20;
		this.cropperSettings.centerTouchRadius = 20;
		this.data = {};
	}

	ngOnInit() {
		console.log(this.getdata);
		this.initialImage = this.getdata.imagePath === '' || this.getdata.imagePath === null ? 'assets/images/profile_default.png' : this.image_url + this.getdata.imagePath;
		let count = (this.initialImage.match(/http/g) || []).length;
		console.log(this.initialImage);
		if (count > 1) {
			this.initialImage = this.getdata.imagePath === '' || this.getdata.imagePath == null ? 'assets/images/profile_default.png' : this.getdata.imagePath;
		}

		this.uploader.onAfterAddingFile = (fileItem) => {
			let url = (window.URL) ? window.URL.createObjectURL(fileItem._file) : (window as any).webkitURL.createObjectURL(fileItem._file);
			fileItem.withCredentials = false;
			fileItem.upload();
		}

		this.uploader.onWhenAddingFileFailed = (fileItem) => {
			this.userService.snackMessage('Please upload image file only');
		}

		this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
			this.resultImageUpload = JSON.parse(response);
			this.dialogRefimage.close({ 'imagePath': this.resultImageUpload.file });
		};
	}

	cropped(bounds: Bounds) {
		this.croppedHeight = bounds.bottom - bounds.top;
		this.croppedWidth = bounds.right - bounds.left;
		this.isbuttondisable = true;
	}

	fileChangeListener($event) {
		var image: any = new Image();
		var file: File = $event.target.files[0];
		var myReader: FileReader = new FileReader();
		var that = this;
		if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/gif') {
			this.fileType = file.type;
			this.fileName = file.name;
		} else {
			$event.target.value = '';
			this.userService.snackMessage('Please upload image file only');
			return false;
		}
		myReader.onloadend = function (loadEvent: any) {
			image.src = loadEvent.target.result;
			that.cropper.setImage(image);
		};
		myReader.readAsDataURL(file);
	}

	saveprofileimg() {
		if (this.isbuttondisable) {
			const filedata = this.dataURItoBlob(this.cropper.image.image);
			const file = new File([filedata], this.apiService.decodejwts().userid);
			const fileItem = new FileItem(this.uploader, file, {});
			this.uploader.queue.push(fileItem);
			fileItem.withCredentials = false;
			fileItem.upload();
		}
	}

	dataURItoBlob(dataURI) {
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0) {
			byteString = atob(dataURI.split(',')[1]);
		} else {
			byteString = dataURI.split(',')[1];
		}

		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}

		return new Blob([ia], { type: mimeString });
	}

	onclickcancel() {
		this.dialogRefimage.close('cancel');
	}
}
