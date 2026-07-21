import { Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

interface StatCard {
  label: string;
  icon: string;
  value: () => number;
  suffix?: string;
  accent: 'primary' | 'tertiary' | 'success' | 'warn';
}

interface Activity {
  who: string;
  action: string;
  when: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    DecimalPipe,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatChipsModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly visitors = signal(1284);
  protected readonly orders = signal(342);
  protected readonly revenue = signal(18730);
  protected readonly conversion = computed(() =>
    Math.round((this.orders() / this.visitors()) * 1000) / 10,
  );

  protected readonly storageUsedGb = signal(64);
  protected readonly storageTotalGb = signal(100);
  protected readonly storagePercent = computed(
    () => (this.storageUsedGb() / this.storageTotalGb()) * 100,
  );

  protected readonly stats: StatCard[] = [
    { label: 'Visitors', icon: 'group', value: () => this.visitors(), accent: 'primary' },
    { label: 'Orders', icon: 'shopping_cart', value: () => this.orders(), accent: 'tertiary' },
    {
      label: 'Revenue',
      icon: 'payments',
      value: () => this.revenue(),
      suffix: '$',
      accent: 'success',
    },
    {
      label: 'Conversion',
      icon: 'trending_up',
      value: () => this.conversion(),
      suffix: '%',
      accent: 'warn',
    },
  ];

  protected readonly activity: Activity[] = [
    { who: 'Ada L.', action: 'placed an order', when: '2 min ago' },
    { who: 'Grace H.', action: 'signed up', when: '17 min ago' },
    { who: 'Alan T.', action: 'left a review', when: '1 hr ago' },
    { who: 'Margaret H.', action: 'requested a refund', when: '3 hr ago' },
  ];

  protected simulateActivity(): void {
    this.visitors.update((v) => v + Math.floor(Math.random() * 12) + 1);
    if (Math.random() > 0.4) {
      this.orders.update((o) => o + 1);
      this.revenue.update((r) => r + Math.floor(Math.random() * 200) + 20);
    }
  }
}
