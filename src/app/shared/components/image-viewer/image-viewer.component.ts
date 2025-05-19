import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  standalone: false,
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.scss']
})
export class ImageViewerComponent implements OnInit {
  src: any;
  
  constructor(public dialogRef: MatDialogRef<ImageViewerComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data) {
      this.src = data;
    }
  }

  close(bool?: boolean) {
    this.dialogRef.close(bool);
  }
  ngOnInit(): void {
  }

}
