import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderComponent } from './loader.component';
import { LoaderService } from './loader.service';
import { BehaviorSubject, of } from 'rxjs';

const mockTransVal = JSON.stringify({
  loadingTextLine1: 'loadingText.line1',
  loadingTextLine2: 'loadingText.line2'
});

const mockLoaderService = {
  displayLoader: of({} as BehaviorSubject<boolean>),
  loaderMsg: of(mockTransVal),
  showLoader: jest.fn()
};
describe('LoaderComponent', () => {
  let fixture: ComponentFixture<LoaderComponent>;
  let component: LoaderComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoaderComponent],
      imports: [],
      providers: [{ provide: LoaderService, useValue: mockLoaderService }]
    }).compileComponents();
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
  });

  it('should create the LoaderComponent', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call ngOnInit method', () => {
      JSON.parse = jest.fn().mockImplementationOnce(() => {
        mockTransVal;
      });
      const parseSpy = jest.spyOn(JSON, 'parse');
      mockLoaderService.loaderMsg.subscribe(() => {
        expect(parseSpy).toBeCalledWith(mockTransVal);
      });
    });
  });
});
