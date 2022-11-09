import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckedOutBooksComponent } from './checked-out-books/checked-out-books.component';
import { LibraryMatModule } from '../library-mat.module';
import { CheckedOutRoutingModule } from './checked-out-routing.module';
import { CheckedOutBooksHistoryComponent } from './check-out-books-history/checked-out-books-history.component';

@NgModule({
  declarations: [
    CheckedOutBooksComponent,
    CheckedOutBooksHistoryComponent
  ],
  imports: [
    CommonModule,
    CheckedOutRoutingModule,
    LibraryMatModule
  ],
  exports: [
    CheckedOutBooksComponent,
    CheckedOutBooksHistoryComponent
  ]
})
export class CheckedOutModule { }
