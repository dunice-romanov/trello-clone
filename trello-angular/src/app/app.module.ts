import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { AppRoutingModule } from './app-routing/app-routing.module'
import { LoginService } from './services/login.service'

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ListsComponent } from './lists/lists.component';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { RegisterComponent } from './register/register.component'
import { SharingComponent } from './sharing/sharing.component';
import { IntroductionComponent } from './introduction/introduction.component';
import { CardWindowComponent } from './card-window/card-window.component';
import { ShareListComponent } from './share-list/share-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavigationComponent,
    RegisterComponent,
    SharingComponent,
    ListsComponent,
    IntroductionComponent,
    CardWindowComponent,
    ShareListComponent
  ],
  imports: [
    DragulaModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    NgbModule.forRoot(),
  ],
  providers: [LoginService,
              NgbActiveModal],
  bootstrap: [AppComponent],
  entryComponents: [SharingComponent,
                     CardWindowComponent],
})
export class AppModule { }
