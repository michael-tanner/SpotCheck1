'use strict';var lang_1 = require('angular2/src/facade/lang');
var exceptions_1 = require('angular2/src/facade/exceptions');
var http_utils_1 = require('./http_utils');
/**
 * Creates `Response` instances from provided values.
 *
 * Though this object isn't
 * usually instantiated by end-users, it is the primary object interacted with when it comes time to
 * add data to a view.
 *
 * ### Example
 *
 * ```
 * http.request('my-friends.txt').subscribe(response => this.friends = response.text());
 * ```
 *
 * The Response's interface is inspired by the Response constructor defined in the [Fetch
 * Spec](https://fetch.spec.whatwg.org/#response-class), but is considered a static value whose body
 * can be accessed many times. There are other differences in the implementation, but this is the
 * most significant.
 */
var Response = (function () {
    function Response(responseOptions) {
        this._body = responseOptions.body;
        this.status = responseOptions.status;
        this.statusText = responseOptions.statusText;
        this.headers = responseOptions.headers;
        this.type = responseOptions.type;
        this.url = responseOptions.url;
    }
    /**
     * Not yet implemented
     */
    // TODO: Blob return type
    Response.prototype.blob = function () { throw new exceptions_1.BaseException('"blob()" method not implemented on Response superclass'); };
    /**
     * Attempts to return body as parsed `JSON` object, or raises an exception.
     */
    Response.prototype.json = function () {
        var jsonResponse;
        if (http_utils_1.isJsObject(this._body)) {
            jsonResponse = this._body;
        }
        else if (lang_1.isString(this._body)) {
            jsonResponse = lang_1.Json.parse(this._body);
        }
        return jsonResponse;
    };
    /**
     * Returns the body as a string, presuming `toString()` can be called on the response body.
     */
    Response.prototype.text = function () { return this._body.toString(); };
    /**
     * Not yet implemented
     */
    // TODO: ArrayBuffer return type
    Response.prototype.arrayBuffer = function () {
        throw new exceptions_1.BaseException('"arrayBuffer()" method not implemented on Response superclass');
    };
    return Response;
})();
exports.Response = Response;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljX3Jlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYW5ndWxhcjIvc3JjL2h0dHAvc3RhdGljX3Jlc3BvbnNlLnRzIl0sIm5hbWVzIjpbIlJlc3BvbnNlIiwiUmVzcG9uc2UuY29uc3RydWN0b3IiLCJSZXNwb25zZS5ibG9iIiwiUmVzcG9uc2UuanNvbiIsIlJlc3BvbnNlLnRleHQiLCJSZXNwb25zZS5hcnJheUJ1ZmZlciJdLCJtYXBwaW5ncyI6IkFBQ0EscUJBQW9ELDBCQUEwQixDQUFDLENBQUE7QUFDL0UsMkJBQThDLGdDQUFnQyxDQUFDLENBQUE7QUFHL0UsMkJBQXlCLGNBQWMsQ0FBQyxDQUFBO0FBRXhDOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUNIO0lBa0RFQSxrQkFBWUEsZUFBZ0NBO1FBQzFDQyxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxlQUFlQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNsQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsZUFBZUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7UUFDckNBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLGVBQWVBLENBQUNBLFVBQVVBLENBQUNBO1FBQzdDQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxlQUFlQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUN2Q0EsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsZUFBZUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDakNBLElBQUlBLENBQUNBLEdBQUdBLEdBQUdBLGVBQWVBLENBQUNBLEdBQUdBLENBQUNBO0lBQ2pDQSxDQUFDQTtJQUVERDs7T0FFR0E7SUFDSEEseUJBQXlCQTtJQUN6QkEsdUJBQUlBLEdBQUpBLGNBQWNFLE1BQU1BLElBQUlBLDBCQUFhQSxDQUFDQSx3REFBd0RBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO0lBRWxHRjs7T0FFR0E7SUFDSEEsdUJBQUlBLEdBQUpBO1FBQ0VHLElBQUlBLFlBQVlBLENBQUNBO1FBQ2pCQSxFQUFFQSxDQUFDQSxDQUFDQSx1QkFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDM0JBLFlBQVlBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBO1FBQzVCQSxDQUFDQTtRQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxlQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNoQ0EsWUFBWUEsR0FBR0EsV0FBSUEsQ0FBQ0EsS0FBS0EsQ0FBU0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDaERBLENBQUNBO1FBQ0RBLE1BQU1BLENBQUNBLFlBQVlBLENBQUNBO0lBQ3RCQSxDQUFDQTtJQUVESDs7T0FFR0E7SUFDSEEsdUJBQUlBLEdBQUpBLGNBQWlCSSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtJQUVoREo7O09BRUdBO0lBQ0hBLGdDQUFnQ0E7SUFDaENBLDhCQUFXQSxHQUFYQTtRQUNFSyxNQUFNQSxJQUFJQSwwQkFBYUEsQ0FBQ0EsK0RBQStEQSxDQUFDQSxDQUFDQTtJQUMzRkEsQ0FBQ0E7SUFDSEwsZUFBQ0E7QUFBREEsQ0FBQ0EsQUExRkQsSUEwRkM7QUExRlksZ0JBQVEsV0EwRnBCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1Jlc3BvbnNlVHlwZX0gZnJvbSAnLi9lbnVtcyc7XG5pbXBvcnQge0NPTlNUX0VYUFIsIGlzU3RyaW5nLCBpc1ByZXNlbnQsIEpzb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0Jhc2VFeGNlcHRpb24sIFdyYXBwZWRFeGNlcHRpb259IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvZXhjZXB0aW9ucyc7XG5pbXBvcnQge0hlYWRlcnN9IGZyb20gJy4vaGVhZGVycyc7XG5pbXBvcnQge1Jlc3BvbnNlT3B0aW9uc30gZnJvbSAnLi9iYXNlX3Jlc3BvbnNlX29wdGlvbnMnO1xuaW1wb3J0IHtpc0pzT2JqZWN0fSBmcm9tICcuL2h0dHBfdXRpbHMnO1xuXG4vKipcbiAqIENyZWF0ZXMgYFJlc3BvbnNlYCBpbnN0YW5jZXMgZnJvbSBwcm92aWRlZCB2YWx1ZXMuXG4gKlxuICogVGhvdWdoIHRoaXMgb2JqZWN0IGlzbid0XG4gKiB1c3VhbGx5IGluc3RhbnRpYXRlZCBieSBlbmQtdXNlcnMsIGl0IGlzIHRoZSBwcmltYXJ5IG9iamVjdCBpbnRlcmFjdGVkIHdpdGggd2hlbiBpdCBjb21lcyB0aW1lIHRvXG4gKiBhZGQgZGF0YSB0byBhIHZpZXcuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGBcbiAqIGh0dHAucmVxdWVzdCgnbXktZnJpZW5kcy50eHQnKS5zdWJzY3JpYmUocmVzcG9uc2UgPT4gdGhpcy5mcmllbmRzID0gcmVzcG9uc2UudGV4dCgpKTtcbiAqIGBgYFxuICpcbiAqIFRoZSBSZXNwb25zZSdzIGludGVyZmFjZSBpcyBpbnNwaXJlZCBieSB0aGUgUmVzcG9uc2UgY29uc3RydWN0b3IgZGVmaW5lZCBpbiB0aGUgW0ZldGNoXG4gKiBTcGVjXShodHRwczovL2ZldGNoLnNwZWMud2hhdHdnLm9yZy8jcmVzcG9uc2UtY2xhc3MpLCBidXQgaXMgY29uc2lkZXJlZCBhIHN0YXRpYyB2YWx1ZSB3aG9zZSBib2R5XG4gKiBjYW4gYmUgYWNjZXNzZWQgbWFueSB0aW1lcy4gVGhlcmUgYXJlIG90aGVyIGRpZmZlcmVuY2VzIGluIHRoZSBpbXBsZW1lbnRhdGlvbiwgYnV0IHRoaXMgaXMgdGhlXG4gKiBtb3N0IHNpZ25pZmljYW50LlxuICovXG5leHBvcnQgY2xhc3MgUmVzcG9uc2Uge1xuICAvKipcbiAgICogT25lIG9mIFwiYmFzaWNcIiwgXCJjb3JzXCIsIFwiZGVmYXVsdFwiLCBcImVycm9yLCBvciBcIm9wYXF1ZVwiLlxuICAgKlxuICAgKiBEZWZhdWx0cyB0byBcImRlZmF1bHRcIi5cbiAgICovXG4gIHR5cGU6IFJlc3BvbnNlVHlwZTtcbiAgLyoqXG4gICAqIFRydWUgaWYgdGhlIHJlc3BvbnNlJ3Mgc3RhdHVzIGlzIHdpdGhpbiAyMDAtMjk5XG4gICAqL1xuICBvazogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFVSTCBvZiByZXNwb25zZS5cbiAgICpcbiAgICogRGVmYXVsdHMgdG8gZW1wdHkgc3RyaW5nLlxuICAgKi9cbiAgdXJsOiBzdHJpbmc7XG4gIC8qKlxuICAgKiBTdGF0dXMgY29kZSByZXR1cm5lZCBieSBzZXJ2ZXIuXG4gICAqXG4gICAqIERlZmF1bHRzIHRvIDIwMC5cbiAgICovXG4gIHN0YXR1czogbnVtYmVyO1xuICAvKipcbiAgICogVGV4dCByZXByZXNlbnRpbmcgdGhlIGNvcnJlc3BvbmRpbmcgcmVhc29uIHBocmFzZSB0byB0aGUgYHN0YXR1c2AsIGFzIGRlZmluZWQgaW4gW2lldGYgcmZjIDI2MTZcbiAgICogc2VjdGlvbiA2LjEuMV0oaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzI2MTYjc2VjdGlvbi02LjEuMSlcbiAgICpcbiAgICogRGVmYXVsdHMgdG8gXCJPS1wiXG4gICAqL1xuICBzdGF0dXNUZXh0OiBzdHJpbmc7XG4gIC8qKlxuICAgKiBOb24tc3RhbmRhcmQgcHJvcGVydHlcbiAgICpcbiAgICogRGVub3RlcyBob3cgbWFueSBvZiB0aGUgcmVzcG9uc2UgYm9keSdzIGJ5dGVzIGhhdmUgYmVlbiBsb2FkZWQsIGZvciBleGFtcGxlIGlmIHRoZSByZXNwb25zZSBpc1xuICAgKiB0aGUgcmVzdWx0IG9mIGEgcHJvZ3Jlc3MgZXZlbnQuXG4gICAqL1xuICBieXRlc0xvYWRlZDogbnVtYmVyO1xuICAvKipcbiAgICogTm9uLXN0YW5kYXJkIHByb3BlcnR5XG4gICAqXG4gICAqIERlbm90ZXMgaG93IG1hbnkgYnl0ZXMgYXJlIGV4cGVjdGVkIGluIHRoZSBmaW5hbCByZXNwb25zZSBib2R5LlxuICAgKi9cbiAgdG90YWxCeXRlczogbnVtYmVyO1xuICAvKipcbiAgICogSGVhZGVycyBvYmplY3QgYmFzZWQgb24gdGhlIGBIZWFkZXJzYCBjbGFzcyBpbiB0aGUgW0ZldGNoXG4gICAqIFNwZWNdKGh0dHBzOi8vZmV0Y2guc3BlYy53aGF0d2cub3JnLyNoZWFkZXJzLWNsYXNzKS5cbiAgICovXG4gIGhlYWRlcnM6IEhlYWRlcnM7XG4gIC8vIFRPRE86IFN1cHBvcnQgQXJyYXlCdWZmZXIsIEpTT04sIEZvcm1EYXRhLCBCbG9iXG4gIHByaXZhdGUgX2JvZHk6IHN0cmluZyB8IE9iamVjdDtcbiAgY29uc3RydWN0b3IocmVzcG9uc2VPcHRpb25zOiBSZXNwb25zZU9wdGlvbnMpIHtcbiAgICB0aGlzLl9ib2R5ID0gcmVzcG9uc2VPcHRpb25zLmJvZHk7XG4gICAgdGhpcy5zdGF0dXMgPSByZXNwb25zZU9wdGlvbnMuc3RhdHVzO1xuICAgIHRoaXMuc3RhdHVzVGV4dCA9IHJlc3BvbnNlT3B0aW9ucy5zdGF0dXNUZXh0O1xuICAgIHRoaXMuaGVhZGVycyA9IHJlc3BvbnNlT3B0aW9ucy5oZWFkZXJzO1xuICAgIHRoaXMudHlwZSA9IHJlc3BvbnNlT3B0aW9ucy50eXBlO1xuICAgIHRoaXMudXJsID0gcmVzcG9uc2VPcHRpb25zLnVybDtcbiAgfVxuXG4gIC8qKlxuICAgKiBOb3QgeWV0IGltcGxlbWVudGVkXG4gICAqL1xuICAvLyBUT0RPOiBCbG9iIHJldHVybiB0eXBlXG4gIGJsb2IoKTogYW55IHsgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oJ1wiYmxvYigpXCIgbWV0aG9kIG5vdCBpbXBsZW1lbnRlZCBvbiBSZXNwb25zZSBzdXBlcmNsYXNzJyk7IH1cblxuICAvKipcbiAgICogQXR0ZW1wdHMgdG8gcmV0dXJuIGJvZHkgYXMgcGFyc2VkIGBKU09OYCBvYmplY3QsIG9yIHJhaXNlcyBhbiBleGNlcHRpb24uXG4gICAqL1xuICBqc29uKCk6IGFueSB7XG4gICAgdmFyIGpzb25SZXNwb25zZTtcbiAgICBpZiAoaXNKc09iamVjdCh0aGlzLl9ib2R5KSkge1xuICAgICAganNvblJlc3BvbnNlID0gdGhpcy5fYm9keTtcbiAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKHRoaXMuX2JvZHkpKSB7XG4gICAgICBqc29uUmVzcG9uc2UgPSBKc29uLnBhcnNlKDxzdHJpbmc+dGhpcy5fYm9keSk7XG4gICAgfVxuICAgIHJldHVybiBqc29uUmVzcG9uc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYm9keSBhcyBhIHN0cmluZywgcHJlc3VtaW5nIGB0b1N0cmluZygpYCBjYW4gYmUgY2FsbGVkIG9uIHRoZSByZXNwb25zZSBib2R5LlxuICAgKi9cbiAgdGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5fYm9keS50b1N0cmluZygpOyB9XG5cbiAgLyoqXG4gICAqIE5vdCB5ZXQgaW1wbGVtZW50ZWRcbiAgICovXG4gIC8vIFRPRE86IEFycmF5QnVmZmVyIHJldHVybiB0eXBlXG4gIGFycmF5QnVmZmVyKCk6IGFueSB7XG4gICAgdGhyb3cgbmV3IEJhc2VFeGNlcHRpb24oJ1wiYXJyYXlCdWZmZXIoKVwiIG1ldGhvZCBub3QgaW1wbGVtZW50ZWQgb24gUmVzcG9uc2Ugc3VwZXJjbGFzcycpO1xuICB9XG59XG4iXX0=