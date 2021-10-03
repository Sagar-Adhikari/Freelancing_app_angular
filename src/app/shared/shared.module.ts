import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TruncatetextPipe } from '../templates/base/jobdetail/truncatetext.pipe';
import { TimeAgoPipe } from 'time-ago-pipe';
import {
  MatIconModule
} from '@angular/material';
import { FlplayvideodialogComponent } from '../templates/base/freelancedialogs/flplayvideodialog/flplayvideodialog.component';


@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  entryComponents:[FlplayvideodialogComponent],
  declarations: [ 
    TruncatetextPipe,
    TimeAgoPipe,
    FlplayvideodialogComponent
  ],
  exports: [
    TruncatetextPipe,
    TimeAgoPipe
  ]
})
export class SharedModule {}