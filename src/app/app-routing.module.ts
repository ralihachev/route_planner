import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { RouteComponent } from './route/route.component';


const routes: Routes = [
    {
        path: 'main',
        component: MainComponent
    },
    {
        path: 'route',
        component: RouteComponent
    },
    {
        path: '',
        redirectTo: '/main',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
