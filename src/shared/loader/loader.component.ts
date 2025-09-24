import { Component, Input } from '@angular/core';
// import { LoaderService } from './loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  standalone: true
})
export class LoaderComponent {
  // @Input() loadingMessage = '';
  // displayLoader = false;

  // constructor(private readonly loaderService: LoaderService) {
  //   this.loaderService.displayLoader.subscribe((value) => {
  //     this.displayLoader = value;
  //   });

  //   this.loaderService.loaderMsg.subscribe((value) => {
  //     this.loadingMessage = value;
  //   });
  // }
}
