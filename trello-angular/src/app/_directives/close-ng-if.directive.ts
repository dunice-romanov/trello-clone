import { Directive, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[closeNgIf]',
  host: {
    '(document:click)': 'onDocumentClick($event)'
  },
})
export class CloseNgIfDirective {

  @Input() toggle: boolean;
  @Output() toggleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  private isFirstTime: boolean;

  constructor(private elRef: ElementRef) {
      this.isFirstTime = true;
   }

  onDocumentClick(event) {
    if (this.isFirstTime == true) { this.isFirstTime = false; return; }
    
    if (!this.elRef.nativeElement.contains(event.target) && this.toggle == true) {
      this.toggleChange.emit(false);
      return;
    }
  }

}
