import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { FormsModule } from '@angular/forms';

//=== Pages
import { AppComponent } from './app.component';

//=== Services
import { GlobalService } from './services/global/global.service';
import { CharsService } from './services/chars/chars.service';

//=== Plugins
import { InfiniteScrollModule } from 'ngx-infinite-scroll';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    InfiniteScrollModule,
  ],
  providers: [
    GlobalService,
    CharsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
