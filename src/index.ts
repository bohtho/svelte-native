import { run, on, launchEvent } from 'tns-core-modules/application'
import { ViewNode, NativeElementNode, createElement, initializeDom } from './dom';

declare global {
    export class SvelteComponent {
        constructor(options: { target?: ViewNode, props?: any });
        $set(props: any): void;
    }
}

export function svelteNative(startPage: typeof SvelteComponent, data: any): Promise<SvelteComponent> {
    initializeDom();
    let host = createElement('fragment');
    let main = new startPage({ target: host, props: data || {} })
    return new Promise((resolve, reject) => {
        //wait for launch
        on(launchEvent, () => {
            console.log("Application Launched");
            resolve(main);
        })

        try {
            run({ create: () => (host.firstElement() as NativeElementNode).nativeView });
        } catch (e) {
            reject(e);
        }
    });
}

export { navigate, goBack } from "./dom"