import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private bnIdle: BnNgIdleService) {}

  ngOnInit(): void {
    // 2 minutes
    this.bnIdle.startWatching(2 * 60).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        window.dispatchEvent(new CustomEvent('userIdle', { detail: true }));
        this.bnIdle.stopTimer();
      }
    });
  }
}
