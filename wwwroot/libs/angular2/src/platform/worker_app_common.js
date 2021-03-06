'use strict';var xhr_1 = require('angular2/src/compiler/xhr');
var xhr_impl_1 = require('angular2/src/web_workers/worker/xhr_impl');
var renderer_1 = require('angular2/src/web_workers/worker/renderer');
var lang_1 = require('angular2/src/facade/lang');
var api_1 = require('angular2/src/core/render/api');
var core_1 = require('angular2/core');
var common_1 = require("angular2/common");
var client_message_broker_1 = require('angular2/src/web_workers/shared/client_message_broker');
var service_message_broker_1 = require('angular2/src/web_workers/shared/service_message_broker');
var compiler_1 = require('angular2/src/compiler/compiler');
var serializer_1 = require("angular2/src/web_workers/shared/serializer");
var api_2 = require("angular2/src/web_workers/shared/api");
var di_1 = require('angular2/src/core/di');
var render_proto_view_ref_store_1 = require('angular2/src/web_workers/shared/render_proto_view_ref_store');
var render_view_with_fragments_store_1 = require('angular2/src/web_workers/shared/render_view_with_fragments_store');
var event_dispatcher_1 = require('angular2/src/web_workers/worker/event_dispatcher');
var PrintLogger = (function () {
    function PrintLogger() {
        this.log = lang_1.print;
        this.logError = lang_1.print;
        this.logGroup = lang_1.print;
    }
    PrintLogger.prototype.logGroupEnd = function () { };
    return PrintLogger;
})();
exports.WORKER_APP_PLATFORM = lang_1.CONST_EXPR([core_1.PLATFORM_COMMON_PROVIDERS]);
exports.WORKER_APP_APPLICATION_COMMON = lang_1.CONST_EXPR([
    core_1.APPLICATION_COMMON_PROVIDERS,
    compiler_1.COMPILER_PROVIDERS,
    common_1.FORM_PROVIDERS,
    serializer_1.Serializer,
    new di_1.Provider(core_1.PLATFORM_PIPES, { useValue: common_1.COMMON_PIPES, multi: true }),
    new di_1.Provider(core_1.PLATFORM_DIRECTIVES, { useValue: common_1.COMMON_DIRECTIVES, multi: true }),
    new di_1.Provider(client_message_broker_1.ClientMessageBrokerFactory, { useClass: client_message_broker_1.ClientMessageBrokerFactory_ }),
    new di_1.Provider(service_message_broker_1.ServiceMessageBrokerFactory, { useClass: service_message_broker_1.ServiceMessageBrokerFactory_ }),
    renderer_1.WebWorkerRenderer,
    new di_1.Provider(api_1.Renderer, { useExisting: renderer_1.WebWorkerRenderer }),
    new di_1.Provider(api_2.ON_WEB_WORKER, { useValue: true }),
    render_view_with_fragments_store_1.RenderViewWithFragmentsStore,
    render_proto_view_ref_store_1.RenderProtoViewRefStore,
    new di_1.Provider(core_1.ExceptionHandler, { useFactory: _exceptionHandler, deps: [] }),
    xhr_impl_1.WebWorkerXHRImpl,
    new di_1.Provider(xhr_1.XHR, { useExisting: xhr_impl_1.WebWorkerXHRImpl }),
    event_dispatcher_1.WebWorkerEventDispatcher
]);
function _exceptionHandler() {
    return new core_1.ExceptionHandler(new PrintLogger());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX2FwcF9jb21tb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbmd1bGFyMi9zcmMvcGxhdGZvcm0vd29ya2VyX2FwcF9jb21tb24udHMiXSwibmFtZXMiOlsiUHJpbnRMb2dnZXIiLCJQcmludExvZ2dlci5jb25zdHJ1Y3RvciIsIlByaW50TG9nZ2VyLmxvZ0dyb3VwRW5kIiwiX2V4Y2VwdGlvbkhhbmRsZXIiXSwibWFwcGluZ3MiOiJBQUFBLG9CQUFrQiwyQkFBMkIsQ0FBQyxDQUFBO0FBQzlDLHlCQUErQiwwQ0FBMEMsQ0FBQyxDQUFBO0FBQzFFLHlCQUFnQywwQ0FBMEMsQ0FBQyxDQUFBO0FBQzNFLHFCQUFpRCwwQkFBMEIsQ0FBQyxDQUFBO0FBQzVFLG9CQUF1Qiw4QkFBOEIsQ0FBQyxDQUFBO0FBQ3RELHFCQU1PLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLHVCQUE4RCxpQkFBaUIsQ0FBQyxDQUFBO0FBQ2hGLHNDQUdPLHVEQUF1RCxDQUFDLENBQUE7QUFDL0QsdUNBR08sd0RBQXdELENBQUMsQ0FBQTtBQUNoRSx5QkFBaUMsZ0NBQWdDLENBQUMsQ0FBQTtBQUNsRSwyQkFBeUIsNENBQTRDLENBQUMsQ0FBQTtBQUN0RSxvQkFBNEIscUNBQXFDLENBQUMsQ0FBQTtBQUNsRSxtQkFBdUIsc0JBQXNCLENBQUMsQ0FBQTtBQUM5Qyw0Q0FBc0MsNkRBQTZELENBQUMsQ0FBQTtBQUNwRyxpREFFTyxrRUFBa0UsQ0FBQyxDQUFBO0FBQzFFLGlDQUF1QyxrREFBa0QsQ0FBQyxDQUFBO0FBRTFGO0lBQUFBO1FBQ0VDLFFBQUdBLEdBQUdBLFlBQUtBLENBQUNBO1FBQ1pBLGFBQVFBLEdBQUdBLFlBQUtBLENBQUNBO1FBQ2pCQSxhQUFRQSxHQUFHQSxZQUFLQSxDQUFDQTtJQUVuQkEsQ0FBQ0E7SUFEQ0QsaUNBQVdBLEdBQVhBLGNBQWVFLENBQUNBO0lBQ2xCRixrQkFBQ0E7QUFBREEsQ0FBQ0EsQUFMRCxJQUtDO0FBRVksMkJBQW1CLEdBQzVCLGlCQUFVLENBQUMsQ0FBQyxnQ0FBeUIsQ0FBQyxDQUFDLENBQUM7QUFFL0IscUNBQTZCLEdBQTJDLGlCQUFVLENBQUM7SUFDOUYsbUNBQTRCO0lBQzVCLDZCQUFrQjtJQUNsQix1QkFBYztJQUNkLHVCQUFVO0lBQ1YsSUFBSSxhQUFRLENBQUMscUJBQWMsRUFBRSxFQUFDLFFBQVEsRUFBRSxxQkFBWSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztJQUNuRSxJQUFJLGFBQVEsQ0FBQywwQkFBbUIsRUFBRSxFQUFDLFFBQVEsRUFBRSwwQkFBaUIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFDLENBQUM7SUFDN0UsSUFBSSxhQUFRLENBQUMsa0RBQTBCLEVBQUUsRUFBQyxRQUFRLEVBQUUsbURBQTJCLEVBQUMsQ0FBQztJQUNqRixJQUFJLGFBQVEsQ0FBQyxvREFBMkIsRUFBRSxFQUFDLFFBQVEsRUFBRSxxREFBNEIsRUFBQyxDQUFDO0lBQ25GLDRCQUFpQjtJQUNqQixJQUFJLGFBQVEsQ0FBQyxjQUFRLEVBQUUsRUFBQyxXQUFXLEVBQUUsNEJBQWlCLEVBQUMsQ0FBQztJQUN4RCxJQUFJLGFBQVEsQ0FBQyxtQkFBYSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDO0lBQzdDLCtEQUE0QjtJQUM1QixxREFBdUI7SUFDdkIsSUFBSSxhQUFRLENBQUMsdUJBQWdCLEVBQUUsRUFBQyxVQUFVLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBQyxDQUFDO0lBQ3pFLDJCQUFnQjtJQUNoQixJQUFJLGFBQVEsQ0FBQyxTQUFHLEVBQUUsRUFBQyxXQUFXLEVBQUUsMkJBQWdCLEVBQUMsQ0FBQztJQUNsRCwyQ0FBd0I7Q0FDekIsQ0FBQyxDQUFDO0FBRUg7SUFDRUcsTUFBTUEsQ0FBQ0EsSUFBSUEsdUJBQWdCQSxDQUFDQSxJQUFJQSxXQUFXQSxFQUFFQSxDQUFDQSxDQUFDQTtBQUNqREEsQ0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1hIUn0gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL3hocic7XG5pbXBvcnQge1dlYldvcmtlclhIUkltcGx9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy93b3JrZXIveGhyX2ltcGwnO1xuaW1wb3J0IHtXZWJXb3JrZXJSZW5kZXJlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3dvcmtlci9yZW5kZXJlcic7XG5pbXBvcnQge3ByaW50LCBUeXBlLCBDT05TVF9FWFBSLCBpc1ByZXNlbnR9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge1JlbmRlcmVyfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9yZW5kZXIvYXBpJztcbmltcG9ydCB7XG4gIFBMQVRGT1JNX0RJUkVDVElWRVMsXG4gIFBMQVRGT1JNX1BJUEVTLFxuICBFeGNlcHRpb25IYW5kbGVyLFxuICBBUFBMSUNBVElPTl9DT01NT05fUFJPVklERVJTLFxuICBQTEFURk9STV9DT01NT05fUFJPVklERVJTLFxufSBmcm9tICdhbmd1bGFyMi9jb3JlJztcbmltcG9ydCB7Q09NTU9OX0RJUkVDVElWRVMsIENPTU1PTl9QSVBFUywgRk9STV9QUk9WSURFUlN9IGZyb20gXCJhbmd1bGFyMi9jb21tb25cIjtcbmltcG9ydCB7XG4gIENsaWVudE1lc3NhZ2VCcm9rZXJGYWN0b3J5LFxuICBDbGllbnRNZXNzYWdlQnJva2VyRmFjdG9yeV9cbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9jbGllbnRfbWVzc2FnZV9icm9rZXInO1xuaW1wb3J0IHtcbiAgU2VydmljZU1lc3NhZ2VCcm9rZXJGYWN0b3J5LFxuICBTZXJ2aWNlTWVzc2FnZUJyb2tlckZhY3RvcnlfXG59IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvc2VydmljZV9tZXNzYWdlX2Jyb2tlcic7XG5pbXBvcnQge0NPTVBJTEVSX1BST1ZJREVSU30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvbXBpbGVyL2NvbXBpbGVyJztcbmltcG9ydCB7U2VyaWFsaXplcn0gZnJvbSBcImFuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvc2VyaWFsaXplclwiO1xuaW1wb3J0IHtPTl9XRUJfV09SS0VSfSBmcm9tIFwiYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9hcGlcIjtcbmltcG9ydCB7UHJvdmlkZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2RpJztcbmltcG9ydCB7UmVuZGVyUHJvdG9WaWV3UmVmU3RvcmV9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy9zaGFyZWQvcmVuZGVyX3Byb3RvX3ZpZXdfcmVmX3N0b3JlJztcbmltcG9ydCB7XG4gIFJlbmRlclZpZXdXaXRoRnJhZ21lbnRzU3RvcmVcbn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9yZW5kZXJfdmlld193aXRoX2ZyYWdtZW50c19zdG9yZSc7XG5pbXBvcnQge1dlYldvcmtlckV2ZW50RGlzcGF0Y2hlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL3dlYl93b3JrZXJzL3dvcmtlci9ldmVudF9kaXNwYXRjaGVyJztcblxuY2xhc3MgUHJpbnRMb2dnZXIge1xuICBsb2cgPSBwcmludDtcbiAgbG9nRXJyb3IgPSBwcmludDtcbiAgbG9nR3JvdXAgPSBwcmludDtcbiAgbG9nR3JvdXBFbmQoKSB7fVxufVxuXG5leHBvcnQgY29uc3QgV09SS0VSX0FQUF9QTEFURk9STTogQXJyYXk8YW55IC8qVHlwZSB8IFByb3ZpZGVyIHwgYW55W10qLz4gPVxuICAgIENPTlNUX0VYUFIoW1BMQVRGT1JNX0NPTU1PTl9QUk9WSURFUlNdKTtcblxuZXhwb3J0IGNvbnN0IFdPUktFUl9BUFBfQVBQTElDQVRJT05fQ09NTU9OOiBBcnJheTxhbnkgLypUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXSovPiA9IENPTlNUX0VYUFIoW1xuICBBUFBMSUNBVElPTl9DT01NT05fUFJPVklERVJTLFxuICBDT01QSUxFUl9QUk9WSURFUlMsXG4gIEZPUk1fUFJPVklERVJTLFxuICBTZXJpYWxpemVyLFxuICBuZXcgUHJvdmlkZXIoUExBVEZPUk1fUElQRVMsIHt1c2VWYWx1ZTogQ09NTU9OX1BJUEVTLCBtdWx0aTogdHJ1ZX0pLFxuICBuZXcgUHJvdmlkZXIoUExBVEZPUk1fRElSRUNUSVZFUywge3VzZVZhbHVlOiBDT01NT05fRElSRUNUSVZFUywgbXVsdGk6IHRydWV9KSxcbiAgbmV3IFByb3ZpZGVyKENsaWVudE1lc3NhZ2VCcm9rZXJGYWN0b3J5LCB7dXNlQ2xhc3M6IENsaWVudE1lc3NhZ2VCcm9rZXJGYWN0b3J5X30pLFxuICBuZXcgUHJvdmlkZXIoU2VydmljZU1lc3NhZ2VCcm9rZXJGYWN0b3J5LCB7dXNlQ2xhc3M6IFNlcnZpY2VNZXNzYWdlQnJva2VyRmFjdG9yeV99KSxcbiAgV2ViV29ya2VyUmVuZGVyZXIsXG4gIG5ldyBQcm92aWRlcihSZW5kZXJlciwge3VzZUV4aXN0aW5nOiBXZWJXb3JrZXJSZW5kZXJlcn0pLFxuICBuZXcgUHJvdmlkZXIoT05fV0VCX1dPUktFUiwge3VzZVZhbHVlOiB0cnVlfSksXG4gIFJlbmRlclZpZXdXaXRoRnJhZ21lbnRzU3RvcmUsXG4gIFJlbmRlclByb3RvVmlld1JlZlN0b3JlLFxuICBuZXcgUHJvdmlkZXIoRXhjZXB0aW9uSGFuZGxlciwge3VzZUZhY3Rvcnk6IF9leGNlcHRpb25IYW5kbGVyLCBkZXBzOiBbXX0pLFxuICBXZWJXb3JrZXJYSFJJbXBsLFxuICBuZXcgUHJvdmlkZXIoWEhSLCB7dXNlRXhpc3Rpbmc6IFdlYldvcmtlclhIUkltcGx9KSxcbiAgV2ViV29ya2VyRXZlbnREaXNwYXRjaGVyXG5dKTtcblxuZnVuY3Rpb24gX2V4Y2VwdGlvbkhhbmRsZXIoKTogRXhjZXB0aW9uSGFuZGxlciB7XG4gIHJldHVybiBuZXcgRXhjZXB0aW9uSGFuZGxlcihuZXcgUHJpbnRMb2dnZXIoKSk7XG59XG4iXX0=