import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {AppComponent} from "./app.component";


const routes: Routes = [

  { path: 'home', component: HomeComponent }

];
@NgModule({
  exports: [ RouterModule ],
  imports: [ RouterModule.forRoot(routes, {
    useHash: false
  }) ]

})
export class AppRoutingModule {

}
