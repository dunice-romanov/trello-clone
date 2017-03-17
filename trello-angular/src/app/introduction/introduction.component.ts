import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.css']
})
export class IntroductionComponent implements OnInit {
	readonly TEXT_HEADER = 'Shmrello';
	readonly TEXT_LEAD_INFO = 'Trello is a web-based project management application';
	readonly TEXT_SUPPORT_INFO = "But this is not a Trello. It's just a simple clone named Shmrello.";
  readonly TEXT_BUTTON_REGISTER = "Register";
  constructor() { }

  ngOnInit() {
  }

}
