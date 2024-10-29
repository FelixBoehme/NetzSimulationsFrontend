import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NetworkService } from '../shared/network.service';
import { Network } from '../shared/network';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-network-overview',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './network-overview.component.html',
  styleUrl: './network-overview.component.scss',
})
export class NetworkOverviewComponent implements OnInit, OnDestroy {
  @Input() pollTrigger!: Observable<unknown>;
  private destroy = new Subject<void>();
  network: undefined | Network;

  constructor(private networkService: NetworkService) {
    this.networkService.getCurrentNetwork().subscribe((network) => {
      this.network = network;
    });
  }

  ngOnInit(): void {
    this.pollTrigger.pipe(takeUntil(this.destroy)).subscribe(() => {
      this.networkService.refreshNetwork();
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
