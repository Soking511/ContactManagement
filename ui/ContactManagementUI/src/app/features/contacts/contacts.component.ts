import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsListComponent } from "./contacts-list/contacts-list.component";

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ContactsListComponent],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})

export class ContactsComponent {
  
  constructor() {}

}
