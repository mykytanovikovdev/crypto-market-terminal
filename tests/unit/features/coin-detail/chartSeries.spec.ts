import { describe, expect, it } from 'vitest';
import {
    toCandlestickData,
    toIndicatorLineData,
    toVolumeData,
} from '@/features/coin-detail/chart/chartSeries';
import { createHourlyCandles } from '../../../fixtures/coinDetails';

describe('chart series data', () => {
    const [first, second] = createHourlyCandles([100, 90]);

    it('keeps OHLC values and time for candlesticks', () => {
        expect(toCandlestickData(first!)).toEqual({
            time: first!.time,
            open: 100,
            high: 110,
            low: 90,
            close: 100,
        });
    });

    it('colours volume by candle direction and leaves gaps without volume', () => {
        expect(toVolumeData(first!, 'up', 'down')).toMatchObject({ value: 100, color: 'up' });
        expect(toVolumeData(second!, 'up', 'down')).toMatchObject({ color: 'down' });
        expect(toVolumeData({ ...first!, volume: null }, 'up', 'down')).toEqual({
            time: first!.time,
        });
    });

    it('turns missing indicator values into whitespace points', () => {
        expect(toIndicatorLineData([first!, second!], [null, 95])).toEqual([
            { time: first!.time },
            { time: second!.time, value: 95 },
        ]);
    });
});
