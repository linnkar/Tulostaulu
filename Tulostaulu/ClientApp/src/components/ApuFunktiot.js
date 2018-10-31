export default function paivays(date) {
    var paiva = ('0' + date.getDate()).slice(-2);
    var kk = ('0' + (date.getMonth() + 1)).slice(-2);
    var vuosi = date.getFullYear();

    return paiva + "." + kk + "." + vuosi;
}