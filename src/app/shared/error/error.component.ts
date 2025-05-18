import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HelperMethods } from 'src/core/helper/helper.methods';

@Component({
  standalone: false,
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  border: boolean = false;
  refreshIcon: boolean = false;

  constructor(public dialogRef: MatDialogRef<ErrorComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    // if (data.classes) {
    //   data.classes.push("header");
    // } else {
    //   data.classes = ["header"];
    // }
  }

  close(bool: boolean) {
    this.dialogRef.close(bool);
  }

  openUrl() {
    if (HelperMethods.GetSelected() != "") {
      return;
    }
    window.open(this.data.link1, "_blank");
  }

  async refresh() {
    this.refreshIcon = false;
    // let res = await 
  }

  copyInputMessage(value) {
    value.select();
    document.execCommand('copy');
    value.setSelectRange(0,0);
  }

  copyText(val) {
    this.border = true;
    setTimeout(() => {
      this.border = false;
    }, 500);

    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}

export interface DialogData {
  msg?: string,
  innerHtml?: string;
  title: string,
  msgs?: any,
  points?: string[];
  classes?: string[];
  icon?: any,
  links?: {
    text: string,
    link: string
  }[];
  link1?: any;
  rtcid?: any;
  xml?: any;
  json?: any;
}
