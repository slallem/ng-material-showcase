import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog } from './confirm-dialog';

@Component({
  selector: 'app-components-gallery',
  imports: [
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTabsModule,
    MatExpansionModule,
    MatMenuModule,
    MatTooltipModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './components-gallery.html',
  styleUrl: './components-gallery.scss',
})
export class ComponentsGallery {
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  protected readonly likeCount = signal(12);
  protected readonly liked = signal(false);

  protected readonly notifications = signal(3);

  protected readonly darkMode = signal(false);
  protected readonly notificationsEnabled = signal(true);
  protected readonly termsAccepted = signal(false);

  protected readonly viewMode = signal<'list' | 'grid' | 'board'>('grid');

  protected readonly taskProgress = signal(40);
  protected readonly progressLabel = computed(() => `${this.taskProgress()}% complete`);

  protected readonly cuisineOptions = ['Italian', 'Japanese', 'Mexican', 'Indian', 'French'];
  protected readonly selectedCuisines = signal<string[]>(['Italian', 'Japanese']);

  protected readonly dialogResult = signal<string | null>(null);

  toggleLike(): void {
    this.liked.update((v) => !v);
    this.likeCount.update((count) => count + (this.liked() ? 1 : -1));
  }

  toggleCuisine(option: string): void {
    this.selectedCuisines.update((list) =>
      list.includes(option) ? list.filter((item) => item !== option) : [...list, option],
    );
  }

  bumpProgress(): void {
    this.taskProgress.update((value) => Math.min(100, value + 10));
  }

  clearNotifications(): void {
    this.notifications.set(0);
    this.snackBar.open('Notifications cleared', 'Undo', { duration: 3000 }).onAction().subscribe(() => {
      this.notifications.set(3);
    });
  }

  openConfirmDialog(): void {
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete project?',
        message: 'This action cannot be undone. The project and all its data will be removed.',
      },
    });
    ref.afterClosed().subscribe((result) => {
      this.dialogResult.set(result ? 'Confirmed' : 'Cancelled');
    });
  }
}
