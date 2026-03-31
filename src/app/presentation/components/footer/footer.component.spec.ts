import { TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should render the footer message', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Made with love by Camilo Villa');
    expect(compiled.textContent).toContain('❤️');
  });
});
