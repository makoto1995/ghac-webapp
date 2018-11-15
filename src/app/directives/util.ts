/**
 * The Util service is for thin, globally reusable, utility functions
 */

import {isFunction, noop } from 'lodash';
import {Response} from '@angular/http';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material';


export class ConfirmPwdErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
        const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

        return (invalidCtrl || invalidParent);
    }
}

export function safeCb(cb) {
    return isFunction(cb) ? cb : noop;
}

/**
 * Parse a given url with the use of an anchor element
 *
 */
export function urlParse(url) {
    const a = document.createElement('a');
    a.href = url;

    // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
    if (a.host === '') {
        a.href = a.href;
    }

    return a;
}

/**
 * Test whether or not a given url is same origin
 *
 */
export function isSameOrigin(url, origins) {
    url = urlParse(url);
    origins = (origins && [].concat(origins)) || [];
    origins = origins.map(urlParse);
    origins.push(window.location);
    origins = origins.filter(function(o) {
        const hostnameCheck = url.hostname === o.hostname;
        const protocolCheck = url.protocol === o.protocol;
        // 2nd part of the special treatment for IE fix (see above):
        // This part is when using well-known ports 80 or 443 with IE,
        // when window.location.port==='' instead of the real port number.
        // Probably the same cause as this IE bug: https://goo.gl/J9hRta
        const portCheck = url.port === o.port || (o.port === '' && (url.port === '80' || url.port === '443'));
        return hostnameCheck && protocolCheck && portCheck;
    });
    return origins.length >= 1;
}

export function extractData(res: Response) {
    if (!res.text()) {return {}; }
    return res.json() || { };
}
