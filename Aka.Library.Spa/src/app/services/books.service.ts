import { environment } from '../../environments/environment';
import { LibraryBook } from '../shared/library-book';
import { Book } from '../shared/book';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignedOutBook } from '../shared/signed-out-book';
import { map, take } from 'rxjs/operators';
import { GoogleBooksMetadata } from '../shared/google-books-metadata';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { of } from 'rxjs/internal/observable/of';

@Injectable()
export class BooksService {

  apiUrl: string;
  googleBooksAPIKey: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiUrl}${environment.apiPath}/libraries/`;
    this.googleBooksAPIKey = 'AIzaSyCCN_lQcnEQ51ohoDBroFvfwN8wnJi9iPY';
  }

  getBooks(libraryId: number): Observable<Book[]> {
    const url = `${this.apiUrl}${libraryId}/books`;
    return this.http.get<LibraryBook[]>(url)
      .pipe(
        map(items => items.map(item => item.book))
      );
  }

  getBook(libraryId: number, bid: number): Observable<Book> {
    const url = `${this.apiUrl}${libraryId}/books/${bid}`;
    return this.http.get<Book>(url);
  }

  getAvailableBooks(libraryId: number): Observable<Book[]> {
    const url = `${this.apiUrl}${libraryId}/books/available`;
    return this.http.get<Book[]>(url);
  }

  getCheckedOutBooks(libraryId: number): Observable<Book[]> {
    const url = `${this.apiUrl}${libraryId}/books/checkedout`;
    return this.http.get<Book[]>(url);
  }

  /**
   * For a given library and given book return the total number of copies for the book
   *
   * @param {number} libraryId Library to look for book
   * @param {number} bookId Book to find
   * @returns {Observable<number>} Count of books
   * @memberof BooksService
   */
  getTotalNumberOfCopiesInLibrary(libraryId: number, bookId: number): Observable<number> {
    // TODO: Add implementation
    return of(0);
  }

  /**
   * This function should calculate the number of available copies of a book within a library given a libraryId and a bookId
   * using the api
   *
   * @param {number} libraryId
   * @param {number} bookId
   * @returns {Observable<number>}
   * @memberof BooksService
   */
  getNumberOfAvailableBookCopies(libraryId: number, bookId: number): Observable<number> {
    const url = `${this.apiUrl}${libraryId}/books/${bookId}/countavailable`;
    return this.http.get<number>(url);
  }

  checkOutBook(libraryId: number, bookId: number, memberId: number): Observable<SignedOutBook> {
    const url = `${this.apiUrl}${libraryId}/books/${bookId}/signout/${memberId}`;
    return this.http.post<SignedOutBook>(url, {});
  }

  returnBook(libraryId: number, bookId: number, memberId: number): Observable<SignedOutBook> {
    const url = `${this.apiUrl}${libraryId}/books/${bookId}/return/${memberId}`;
    return this.http.put<SignedOutBook>(url, {});
  }

  /**
   * Gets all the meta information for the book
   * The google api reference to get meta data https://developers.google.com/books/docs/v1/using
   *
   * @param {string} isbn
   * @returns {Observable<GoogleBooksMetadata>}
   * @memberof BooksService
   */
  getBookMetaData(isbn: string): Observable<GoogleBooksMetadata> {

    // according to https://www.isbn-international.org/content/what-isbn, ISBN values are always numeric only
    //  for the parts that matter
    // api apparently needs isbn numbers in a 'packed' format - i.e. just numbers, no dashes, spaces, etc.

    // normalize, in case we're passed a null/undefined value, and strip out non-numerics
    isbn = (isbn || "").replace(/\D/g, '');

    if (!isbn) {
      // can't do a lookup without a potentially valid isbn (has to contain some numbers)
      return of(null);
    }    

    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&maxResults=1&projection=lite&key=${this.googleBooksAPIKey}`;

    return this.http.get<GoogleBooksSearchResult>(url)
      .pipe(
        take(1),
        map(result => result.items ? result.items[0].volumeInfo : null)
      );
  }
}

interface GoogleBooksSearchResultItem {
  id: string,
  volumeInfo: GoogleBooksMetadata
};

interface GoogleBooksSearchResult {
  items: GoogleBooksSearchResultItem[]
};

