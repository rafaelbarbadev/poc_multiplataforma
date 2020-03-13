import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: 'catalogo' }, // default route
  // { path: 'catalogo', component: CatalogoProdutosComponent }, // generic route
  // { path: '**', component: null} // 404 page error
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
