import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { JsonPipe } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';

const INTEREST_OPTIONS = [
  'Angular',
  'TypeScript',
  'Design Systems',
  'Accessibility',
  'Performance',
  'RxJS',
  'Signals',
  'Testing',
];

@Component({
  selector: 'app-forms-showcase',
  imports: [
    JsonPipe,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './forms-showcase.html',
  styleUrl: './forms-showcase.scss',
})
export class FormsShowcase {
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly countries = [
    'United States',
    'France',
    'Germany',
    'United Kingdom',
    'Canada',
    'Japan',
    'Australia',
  ];

  protected readonly personalInfoForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    birthDate: [null as Date | null, Validators.required],
  });

  protected readonly addressForm = this.fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    country: ['', Validators.required],
    remote: [false],
  });

  protected readonly preferencesForm = this.fb.group({
    contactMethod: ['email', Validators.required],
    newsletter: [true],
    experience: [3],
    interestControl: [''],
  });

  protected readonly interests = signal<string[]>(['Angular', 'Signals']);

  protected readonly interestSuggestions = computed(() => {
    const term = (this.preferencesForm.controls.interestControl.value ?? '')
      .toString()
      .toLowerCase();
    const chosen = new Set(this.interests());
    return INTEREST_OPTIONS.filter(
      (option) => !chosen.has(option) && option.toLowerCase().includes(term),
    );
  });

  private readonly personalInfoStatus = toSignal(this.personalInfoForm.statusChanges, {
    initialValue: this.personalInfoForm.status,
  });
  private readonly addressStatus = toSignal(this.addressForm.statusChanges, {
    initialValue: this.addressForm.status,
  });

  protected readonly personalInfoValid = computed(() => this.personalInfoStatus() === 'VALID');
  protected readonly addressValid = computed(() => this.addressStatus() === 'VALID');

  protected readonly liveValue = toSignal(this.personalInfoForm.valueChanges, {
    initialValue: this.personalInfoForm.value,
  });

  protected readonly submitted = signal(false);

  protected readonly summary = computed(() => ({
    ...this.personalInfoForm.getRawValue(),
    ...this.addressForm.getRawValue(),
    ...this.preferencesForm.getRawValue(),
    interests: this.interests(),
  }));

  addInterest(value: string): void {
    const trimmed = value.trim();
    if (trimmed && !this.interests().includes(trimmed)) {
      this.interests.update((list) => [...list, trimmed]);
    }
    this.preferencesForm.controls.interestControl.setValue('');
  }

  removeInterest(value: string): void {
    this.interests.update((list) => list.filter((item) => item !== value));
  }

  errorFor(control: 'firstName' | 'lastName' | 'email' | 'birthDate'): string | null {
    const ctrl = this.personalInfoForm.controls[control];
    if (!ctrl.touched || ctrl.valid) return null;
    if (ctrl.hasError('required')) return 'This field is required.';
    if (ctrl.hasError('email')) return 'Enter a valid email address.';
    if (ctrl.hasError('minlength')) return 'Too short.';
    return 'Invalid value.';
  }

  submit(): void {
    this.submitted.set(true);
    this.snackBar.open('Form submitted — check the console for the payload.', 'Dismiss', {
      duration: 4000,
    });
    console.log('Form payload', this.summary());
  }

  reset(): void {
    this.personalInfoForm.reset();
    this.addressForm.reset({ remote: false });
    this.preferencesForm.reset({ contactMethod: 'email', newsletter: true, experience: 3 });
    this.interests.set([]);
    this.submitted.set(false);
  }
}
