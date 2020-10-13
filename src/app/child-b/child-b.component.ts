import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-child-b',
  templateUrl: './child-b.component.html',
  styleUrls: ['./child-b.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildBComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
