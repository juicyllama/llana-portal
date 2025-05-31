function padZero(num: number) {
    return (num < 10 ? '0' : '') + num;
}

export function formatDate(currentTime: Date | null): string {

    if (!currentTime) {
        return '';
    }
    return `${currentTime.getFullYear()}-${padZero(currentTime.getMonth() + 1)}-${padZero(currentTime.getDate())}T${currentTime.getHours()}:${padZero(currentTime.getMinutes())}:${padZero(currentTime.getSeconds())}`;
}