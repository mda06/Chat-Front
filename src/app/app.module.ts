import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import {ChatService} from './service/chat.service';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { ParticipantComponent } from './participant/participant.component';
import { ConnectingComponent } from './connecting/connecting.component';
import { ConnectedComponent } from './connected/connected.component';

@NgModule({
  declarations: [
    AppComponent,
    UserSettingsComponent,
    ParticipantComponent,
    ConnectingComponent,
    ConnectedComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
