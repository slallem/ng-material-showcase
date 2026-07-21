import { Component, computed, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectionModel } from '@angular/cdk/collections';

interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
  status: 'Active' | 'On leave' | 'Inactive';
  salary: number;
  startDate: string;
}

const DEPARTMENTS = ['Engineering', 'Design', 'Sales', 'Marketing', 'Support'];
const ROLES = [
  'Software Engineer',
  'Product Designer',
  'Account Executive',
  'Marketing Manager',
  'Support Specialist',
  'Engineering Manager',
];
const STATUSES: Employee['status'][] = ['Active', 'On leave', 'Inactive'];
const FIRST_NAMES = [
  'Ada',
  'Grace',
  'Alan',
  'Margaret',
  'Katherine',
  'Dennis',
  'Barbara',
  'Tim',
  'Radia',
  'Vint',
  'Linus',
  'Guido',
];
const LAST_NAMES = [
  'Lovelace',
  'Hopper',
  'Turing',
  'Hamilton',
  'Johnson',
  'Ritchie',
  'Liskov',
  'Berners-Lee',
  'Perlman',
  'Cerf',
  'Torvalds',
  'van Rossum',
];

function generateEmployees(count: number): Employee[] {
  const employees: Employee[] = [];
  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const year = 2018 + (i % 7);
    const month = String(1 + (i % 12)).padStart(2, '0');
    const day = String(1 + (i % 28)).padStart(2, '0');
    employees.push({
      id: i + 1,
      name: `${first} ${last}`,
      role: ROLES[i % ROLES.length],
      department: DEPARTMENTS[i % DEPARTMENTS.length],
      status: STATUSES[i % STATUSES.length],
      salary: 65000 + ((i * 3417) % 85000),
      startDate: `${year}-${month}-${day}`,
    });
  }
  return employees;
}

@Component({
  selector: 'app-data-grid',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatCheckboxModule,
    MatTooltipModule,
  ],
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.scss',
})
export class DataGrid {
  protected readonly displayedColumns = [
    'select',
    'id',
    'name',
    'role',
    'department',
    'status',
    'salary',
    'startDate',
  ];

  private readonly allEmployees = signal<Employee[]>(generateEmployees(60));

  protected readonly filterValue = signal('');
  protected readonly sortState = signal<Sort>({ active: 'id', direction: 'asc' });
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(10);

  protected readonly selection = new SelectionModel<Employee>(true, []);

  private readonly filtered = computed(() => {
    const term = this.filterValue().trim().toLowerCase();
    const rows = this.allEmployees();
    if (!term) return rows;
    return rows.filter((row) =>
      [row.name, row.role, row.department, row.status].some((field) =>
        field.toLowerCase().includes(term),
      ),
    );
  });

  private readonly sorted = computed(() => {
    const { active, direction } = this.sortState();
    const rows = [...this.filtered()];
    if (!direction) return rows;
    const dir = direction === 'asc' ? 1 : -1;
    return rows.sort((a, b) => {
      const valA = a[active as keyof Employee];
      const valB = b[active as keyof Employee];
      if (typeof valA === 'number' && typeof valB === 'number') return (valA - valB) * dir;
      return String(valA).localeCompare(String(valB)) * dir;
    });
  });

  protected readonly totalRows = computed(() => this.filtered().length);

  protected readonly pagedRows = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.sorted().slice(start, start + this.pageSize());
  });

  protected readonly isAllSelected = computed(() => {
    const rows = this.pagedRows();
    return rows.length > 0 && rows.every((row) => this.selection.isSelected(row));
  });

  onFilterChange(value: string): void {
    this.filterValue.set(value);
    this.pageIndex.set(0);
  }

  onSortChange(sort: Sort): void {
    this.sortState.set(sort);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.pagedRows().forEach((row) => this.selection.deselect(row));
    } else {
      this.pagedRows().forEach((row) => this.selection.select(row));
    }
  }

  removeSelected(): void {
    const toRemove = new Set(this.selection.selected.map((row) => row.id));
    this.allEmployees.update((rows) => rows.filter((row) => !toRemove.has(row.id)));
    this.selection.clear();
  }

  statusColor(status: Employee['status']): 'active' | 'leave' | 'inactive' {
    switch (status) {
      case 'Active':
        return 'active';
      case 'On leave':
        return 'leave';
      default:
        return 'inactive';
    }
  }
}
