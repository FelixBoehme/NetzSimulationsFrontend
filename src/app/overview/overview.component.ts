import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Network, Overview, OverviewService } from './overview.service';
import { EnergyStoresComponent } from '../energy-stores/energy-stores.component';
import { NewEnergyStore } from '../energy-stores/energy-stores.service';
import { EnergyStore } from '../energy-store';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, EnergyStoresComponent, ReactiveFormsModule],
  providers: [OverviewService],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css',
})
export class OverviewComponent implements OnInit {
  constructor(
    private overviewService: OverviewService,
    private formBuilder: FormBuilder,
  ) {}

  overview: Overview | undefined;
  popupActive: Boolean = false;

  @ViewChild(EnergyStoresComponent) storeComponent!: EnergyStoresComponent;

  private lessOrEqValidator(controlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);

      if (!control) {
        return null;
      }

      const controlValue = control.value;
      var compareValue: number;

      if (this.overview == null) {
        compareValue = 0;
      } else {
        compareValue = this.overview!.currentCapacity;
      }

      if (
        controlValue !== null &&
        compareValue !== null &&
        controlValue > compareValue
      ) {
        return { lessThan: true };
      }

      return null;
    };
  }

  drawForm = this.formBuilder.group(
    {
      amount: [0, Validators.min(0)],
    },
    {
      validators: this.lessOrEqValidator('amount'),
    },
  );

  ngOnInit(): void {
    this.getOverview();
  }

  getOverview(): void {
    this.overviewService
      .getOverview()
      .subscribe((overview) => (this.overview = overview));
  }

  //TODO: decide if it's better to just call getOverview() instead
  updateNewStore(store: NewEnergyStore): void {
    this.overview!.maxCapacity += store.maxCapacity;
    this.overview!.currentCapacity += store.currentCapacity;
    this.overview!.percentageCapacity =
      this.overview!.currentCapacity / this.overview!.maxCapacity;
  }

  updateRemovedStore(store: EnergyStore): void {
    this.overview!.maxCapacity -= store.maxCapacity;
    this.overview!.currentCapacity -= store.currentCapacity;

    if (
      this.overview!.maxCapacity == 0 ||
      this.overview!.currentCapacity == 0
    ) {
      this.overview!.percentageCapacity = 0;
    } else {
      this.overview!.percentageCapacity =
        this.overview!.currentCapacity / this.overview!.maxCapacity;
    }
  }

  increasedCapacity(amount: number): void {
    this.overview!.currentCapacity += amount;

    this.overview!.percentageCapacity =
      this.overview!.currentCapacity / this.overview!.maxCapacity;
  }

  addNetwork(name: string): void {
    const newNetwork = { name } as Network;
    this.overviewService.addNetwork(newNetwork).subscribe();

    this.getOverview();
  }

  drawCapacity(): void {
    const amount: number = this.drawForm.get('amount')?.value!;
    this.overviewService.drawCapacity(amount).subscribe((newCapacity) => {
      this.overview!.currentCapacity = newCapacity;
      this.overview!.percentageCapacity =
        newCapacity / this.overview!.maxCapacity;
      this.storeComponent.getEnergyStores();
    });

    this.drawForm.reset(); //TODO: reset to default values
    this.closePopup();
  }

  openPopup(): void {
    this.popupActive = true;
  }

  closePopup(): void {
    this.popupActive = false;
  }
}
