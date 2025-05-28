import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { Item } from 'src/app/shared/component-items/models/item';
import { ItemService } from 'src/app/shared/services/app-services/item.service';
import { Observable, startWith, switchMap } from 'rxjs';
import { CustomCurrencyPipe } from 'src/core/pipes/custom-currency.pipe';

@Component({
  selector: 'app-dynamic-table-items',
  imports: [
    CustomCurrencyPipe,
    MaterialModule, 
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule],
  templateUrl: './dynamic-table-items.component.html',
  styleUrl: './dynamic-table-items.component.scss'
})
export class DynamicTableItemsComponent {
  @Input() items: Item[] = [];

  columns = [
    {
      columnDef: 'name',
      header: 'Name',
      cell: (element: Item) => element.name,
      footer: 'Total:',
      type: 'text'
    },
    {
      columnDef: 'price',
      header: 'Price',
      cell: (element: Item) => element.price, // ✅ return number
      footer: '',
      type: 'text'
    },
    {
      columnDef: 'quantity',
      header: 'Quantity',
      type: 'input',
      footer: () => this.items.reduce((sum, item) => sum + item.quantity, 0)
    },
    {
      columnDef: 'discount',
      header: 'Discount %',
      cell: (element: Item) => `${(element.discountPercentage * 100).toFixed(2)}%`,
      footer: () => this.totalDiscount.toFixed(2),
      type: 'text'
    },
    {
      columnDef: 'tax',
      header: 'Tax %',
      cell: (element: Item) => `${(element.taxPercentage * 100).toFixed(2)}%`,
      footer: () => this.totalTax.toFixed(2),
      type: 'text'
    },
    {
      columnDef: 'total',
      header: 'Total',
      cell: (element: Item) => this.getTotal(element), // ✅ return number
      type: 'calculated',
      footer: () => this.totalAmount
    },
    {
      columnDef: 'action',
      header: 'Actions',
      cell: () => '',
      footer: '',
      type: 'action'
    }
  ];
  
  
  displayedColumns: string[] = this.columns.map(c => c.columnDef);
  itemControl = new FormControl();
  filteredOptions: Observable<Item[]> = new Observable<Item[]>();

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.filteredOptions = this.itemControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.itemService.searchItems(typeof value === 'string' ? value : value?.name || ''))
    );
  }
  getFooterValue(column: any): any {
    if (typeof column.footer === 'function') {
      return column.footer();
    }
    return column.footer ?? '';
  }

  selectItem(event: any) {
    const selectedItem: Item = event.option.value;
    const existingItem = this.items.find(i => i.id === selectedItem.id);
  
    if (existingItem) {
      existingItem.quantity! += 1;
    } else {
      this.items = [...this.items, { ...selectedItem, quantity: 1 }];
    }
  
    // Properly reset the input field to avoid re-selection
    this.itemControl.setValue('', { emitEvent: false });
  }
  

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.items = [...this.items];
  }

  getTotal(item: Item): number {
    const quantity = item.quantity ?? 1;
    const base = item.price * quantity;
    const tax = base * item.taxPercentage;
    const discount = base * item.discountPercentage;
    return base + tax - discount;
  }

  get totalDiscount(): number {
    return this.items.reduce((acc, item) => acc + (item.price * (item.quantity ?? 1) * item.discountPercentage), 0);
  }

  get totalTax(): number {
    return this.items.reduce((acc, item) => acc + (item.price * (item.quantity ?? 1) * item.taxPercentage), 0);
  }

  get totalAmount(): number {
    return this.items.reduce((acc, item) => acc + this.getTotal(item), 0);
  }
}
