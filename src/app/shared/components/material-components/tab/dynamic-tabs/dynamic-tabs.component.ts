import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { DynamicTableItemsComponent } from '../../table/dynamic-table-items/dynamic-table-items.component';

@Component({
  selector: 'app-dynamic-tabs',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CommonModule,
    DynamicTableItemsComponent
  ],
  templateUrl: './dynamic-tabs.component.html',
  styleUrl: './dynamic-tabs.component.scss'
})
export class DynamicTabsComponent {
  tabs: string[] = ['Tab 1'];
  selected = new FormControl(0);
  tabDataMap: Record<string, any[]> = { 'Tab 1': [] };

  addTab(selectAfterAdding: boolean) {
    const tabName = `Tab ${this.tabs.length + 1}`;
    this.tabs.push(tabName);
    this.tabDataMap[tabName] = [];

      this.selected.setValue(this.tabs.length - 1);
  }

  removeTab(index: number) {
    const tabName = this.tabs[index];
    delete this.tabDataMap[tabName];
    this.tabs.splice(index, 1);
    this.selected.setValue(index > 0 ? index - 1 : 0);
  }
}
