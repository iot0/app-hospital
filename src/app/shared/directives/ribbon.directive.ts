import { Directive, Input, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[ribbon]' // Attribute selector
})
export class RibbonDirective implements OnInit {

  @Input("ribbon") enable: boolean;
  @Input("ribbonContent") content: string;
  @Input("ribbonColor") color: string;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2) {
    console.log('Hello RibbonDirective Directive');
  }
  ngOnInit(): void {
    if (this.enable) {
      //add styles to parent
      this.renderer.addClass(this.element.nativeElement, "item-ribbon");

      let color = this.color || 'default';
      let content = this.content || 'empty';

      //creating ribbon element
      const spanContainer = this.renderer.createElement('span');
      const spanContent = this.renderer.createElement('span');
      const text = this.renderer.createText(content);
      this.renderer.addClass(spanContainer,"ribbon");
      this.renderer.addClass(spanContainer,`"${color}"`);
      this.renderer.appendChild(spanContent, text);
      this.renderer.appendChild(spanContainer, spanContent);

      //finally append the content to out element
      this.renderer.appendChild(this.element.nativeElement,spanContainer);
    }
  }
}
