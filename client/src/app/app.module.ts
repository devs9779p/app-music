import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing, appRoutingProviders } from './app.routing';

// General
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home.component';

// Usuarios
import { UserEditComponent } from './components/user-edit.component';

// Artistas
import { ArtistListComponent } from './components/artis-list.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';

// Albums
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditComponent } from './components/album-edit.component';
import { AlbumDetailComponent } from './components/album-detail.component';

// Canciones
import { SongAddComponent } from './components/song-add.component';
import { SongEditComponent } from './components/song-edit.component';

// Player
import { PlayerComponent } from './components/player.component';

// Social-login
import {
  SocialLoginModule, 
  AuthServiceConfig,
  GoogleLoginProvider, 
  FacebookLoginProvider, 
} from 'ng4-social-login';
 
const CONFIG = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider("501850352230-qfsoloe4joj9kp8pquh57ask0fss6hvv.apps.googleusercontent.com")
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider('659502064648605')
  }
], false);
 
export function provideConfig() {
  return CONFIG;
}

@NgModule({
  declarations: [         
    AppComponent,
    HomeComponent,
    UserEditComponent,
    ArtistListComponent,
    ArtistAddComponent,
    ArtistEditComponent,
    ArtistDetailComponent,
    AlbumAddComponent,
    AlbumEditComponent,
    AlbumDetailComponent,
    SongAddComponent,
    SongEditComponent,
    PlayerComponent,
  ],
  imports: [               
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    SocialLoginModule
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    appRoutingProviders
  ],            
  bootstrap: [AppComponent]                     
})

export class AppModule { }
