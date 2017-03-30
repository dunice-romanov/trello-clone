import { Directive, Renderer, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective implements OnInit {

  constructor(private renderer: Renderer,
              private elementRef: ElementRef) {
    console.log('constructor');

  }

  ngOnInit() {
    this.renderer.invokeElementMethod(this.elementRef.nativeElement, 'focus', []);
    console.log('onInit');
  }

}
