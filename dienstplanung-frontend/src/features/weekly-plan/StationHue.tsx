export function stationHue(stationId:string): number {
    let hash = 0;
    for (let index = 0; index < stationId.length; index++) {
         hash = stationId.charCodeAt(index) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % 360;
}