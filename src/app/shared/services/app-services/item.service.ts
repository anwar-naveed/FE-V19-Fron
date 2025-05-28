import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Item } from '../../component-items/models/item';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private items: Item[] = [
    { id: 1, name: 'Item A', price: 100, discountPercentage: 0.1, taxPercentage: 0.05 },
    { id: 2, name: 'Item B', price: 200, discountPercentage: 0.05, taxPercentage: 0.1 },
    { id: 3, name: 'Item C', price: 300, discountPercentage: 0.15, taxPercentage: 0.2 },
  ];

  searchItems(query: string): Observable<Item[]> {
    const result = this.items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    return of(result);
  }
}
