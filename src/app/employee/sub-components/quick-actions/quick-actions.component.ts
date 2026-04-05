import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ApplyLeaveComponent } from '../../apply-leave/apply-leave.component';


@Component({
  selector: 'app-quick-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quick-actions.component.html',
  styleUrls: ['./quick-actions.component.css']
})
export class QuickActionsComponent implements OnInit {
  isModalOpen = false;
  constructor(private dialog: MatDialog) {}


  ngOnInit(): void {
  }

  openModal() {
    this.dialog.open(ApplyLeaveComponent);
  }

  closeModal() {
    this.isModalOpen = false;
  }

}
