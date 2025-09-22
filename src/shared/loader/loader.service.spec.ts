import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';

describe('LoaderService', () => {
  let service: LoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [LoaderService]
    }).compileComponents();
    service = TestBed.inject(LoaderService);
  });

  describe('LoaderService Calls', () => {
    it('should call showLoader', () => {
      // when
      service.show();
      // then
      let result;
      service.displayLoader.subscribe((val) => (result = val));
      expect(result).toBe(true);
    });

    it('should call hideLoader', () => {
      // when
      service.hide();
      // then
      let result;
      service.displayLoader.subscribe((val) => (result = val));
      expect(result).toBe(false);
    });
  });

  describe('loaderMsg', () => {
    it('should return the loader message', () => {
      // when
      service.show('loader text');
      let result = '';
      service.loaderMsg.subscribe((val: string) => (result = val));
      // then

      expect(result).toEqual('loader text');
    });
  });
});
