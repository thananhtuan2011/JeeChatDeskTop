import { ElectronIpcService } from './../../../../services/electron-ipc.service';
import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-slider-message',
  templateUrl: './slider-message.component.html',
  styleUrls: ['./slider-message.component.scss']
})
export class SliderMessageComponent implements OnInit {
  
  // images = [700, 800, 807].map((n) => `https://picsum.photos/id/${n}/900/500`);

  constructor(config: NgbCarouselConfig,private eletron_services:ElectronIpcService) {
    // customize default values of carousels used by this component tree
    config.interval = 5000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  ngOnInit(): void {
    this.eletron_services.setIdGroup(0)
      //  localStorage.setItem('chatGroup',"");
  }

}
