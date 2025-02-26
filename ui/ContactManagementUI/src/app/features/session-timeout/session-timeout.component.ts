import { Component } from '@angular/core';
import { PopupComponent } from "../../shared/components/popup/popup.component";

@Component({
  selector: 'app-session-timeout',
  imports: [PopupComponent],
  templateUrl: './session-timeout.component.html',
  styleUrl: './session-timeout.component.scss'
})
export class SessionTimeoutComponent {

  refreshPage() {
    location.reload();
  }
}
