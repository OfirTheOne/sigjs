import { describe, it, expect, vitest } from 'vitest'
import { buildSignal, signal } from './signal';
import type { Signal } from './signal.types';


[buildSignal, signal].forEach((signalBuilderFn) => {
    describe(signalBuilderFn.name, () => {

        it('should create a signal with the provided value', () => {
            const signal = signalBuilderFn(10);
            expect(signal.value).toBe(10);
        });

        it('should allow setting and getting the value', () => {
            const signal = signalBuilderFn(10);
            signal.value = 20;
            expect(signal.value).toBe(20);
        });

        it('should emit the value to subscribers when the value is set', () => {
            const signal = signalBuilderFn(10);
            const listener = vitest.fn();
            signal.subscribe(listener);
            signal.value = 20;
            expect(listener).toHaveBeenCalledWith(20);
        });

        it('should stop notifying a listener after it unsubscribes', () => {
            const signal = signalBuilderFn(10);
            const listener = vitest.fn();
            const unsubscribe = signal.subscribe(listener);
            unsubscribe();
            signal.value = 20;
            expect(listener).not.toHaveBeenCalled();
        });

        it('should stop notifying all listeners after disconnect is called', () => {
            const signal = signalBuilderFn(10);
            const listener1 = vitest.fn();
            const listener2 = vitest.fn();
            signal.subscribe(listener1);
            signal.subscribe(listener2);
            signal.disconnect();
            signal.value = 20;
            expect(listener1).not.toHaveBeenCalled();
            expect(listener2).not.toHaveBeenCalled();
        });

        describe('link', () => {
            it('should link to another signal and update its value when the other signal changes', () => {
                const signal1 = signalBuilderFn(10);
                const signal2 = signalBuilderFn(20);
                signal1.link(signal2 as Signal<number>);
                signal2.value = 30;
                expect(signal1.value).toBe(30);
            });


            it('should allow transforming the value of the linked signal', () => {
                const signal1 = signalBuilderFn(10);
                const signal2 = signalBuilderFn('20');
                signal1.link(signal2 as Signal<string>, value => Number(value));
                signal2.value = '30';
                expect(signal1.value).toBe(30);
            });

            it('should return an unsubscribe function', () => {
                const signal1 = signalBuilderFn(10);
                const signal2 = signalBuilderFn(20);
                const unsubscribe = signal1.link(signal2 as Signal<number>);
                unsubscribe();
                signal2.value = 30;
                expect(signal1.value).toBe(10);
            });

            it('should allow linking multiple signals', () => {
                const signal1 = signalBuilderFn(10);
                const signal2 = signalBuilderFn(20);
                const signal3 = signalBuilderFn(30);
                signal1.link(signal2 as Signal<number>);
                signal1.link(signal3 as Signal<number>);
                signal2.value = 40;
                expect(signal1.value).toBe(40);
                signal3.value = 50;
                expect(signal1.value).toBe(50);
            });
        });

        describe('derive', () => {
            it('should create a derived signal that transforms the value', () => {
                const signal = signalBuilderFn(10);
                const derivedSignal = signal.derive(value => value * 2);
                expect(derivedSignal.value).toBe(20);
                signal.value = 20;
                expect(derivedSignal.value).toBe(40);
            });

            it('should allow transforming the value of the derived signal directly', () => {
                const signal = signalBuilderFn(10);
                const derivedSignal = signal.derive(value => value * 2);
                derivedSignal.value = 30;
                expect(signal.value).toBe(10);
                expect(derivedSignal.value).toBe(30);
            });
        });

        describe('stale mode', () => {
            it('should not emit values to subscribers while in stale mode', () => {
                const signal = signalBuilderFn(10);
                const listener = vitest.fn();
                signal.subscribe(listener);
                signal.enterStaleMode();
                signal.value = 20;
                expect(listener).not.toHaveBeenCalled();
            });

            it('should emit the last value set while in stale mode when exiting stale mode', () => {
                const signal = signalBuilderFn(10, { emitOnExitStaleMode: true });
                const listener = vitest.fn();
                signal.subscribe(listener);
                signal.enterStaleMode();
                signal.value = 20;
                signal.value = 30;
                signal.exitStaleMode();
                expect(listener).toHaveBeenCalledWith(30);
            });

            it('should not emit any value if no value was set while in stale mode', () => {
                const signal = signalBuilderFn(10);
                const listener = vitest.fn();
                signal.subscribe(listener);
                signal.enterStaleMode();
                signal.exitStaleMode();
                expect(listener).not.toHaveBeenCalled();
            });
        });
    });
});
